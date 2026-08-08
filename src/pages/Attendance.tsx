import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, UserPlus, LogIn, LogOut, ArrowRight, ArrowLeft, 
  CheckCircle2, Clock, Smartphone, ShieldCheck, AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AttendancePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { toast } = useToast();

  const [mode, setMode] = useState<"choice" | "login" | "register" | "action" | "success">("choice");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState("");
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);

  // Form states
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    // Initialize fingerprint
    FingerprintJS.load().then(fp => fp.get()).then(result => setFingerprint(result.visitorId));

    // Validate token
    if (token) {
      supabase.from("qr_codes").select("id").eq("token_hash", token).eq("status", "active").single()
        .then(({ data }) => {
          if (data) setQrCodeId(data.id);
          else toast({ variant: "destructive", title: "Invalid QR", description: "This QR code is invalid or revoked." });
        });
    }

    // Check existing session
    const storedUser = localStorage.getItem("library_member");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setMode("action");
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.from("members").select("*").eq("mobile", mobile).single();
      if (error || !data) throw new Error("Member not found");
      
      if (data.status === 'suspended') throw new Error("Account suspended. Contact admin.");

      const valid = await bcrypt.compare(password, data.password_hash);
      if (!valid) throw new Error("Invalid password");

      setUser(data);
      localStorage.setItem("library_member", JSON.stringify(data));
      setMode("action");
      toast({ title: "Welcome back!", description: `Hello, ${data.full_name}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Login Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const { data, error } = await supabase.from("members").insert([{
        full_name: fullName,
        father_name: fatherName,
        mobile,
        address,
        password_hash: hash,
        device_fingerprint: fingerprint
      }]).select().single();

      if (error) {
        if (error.code === '23505') throw new Error("Mobile number already registered. Please login.");
        throw error;
      }

      setUser(data);
      localStorage.setItem("library_member", JSON.stringify(data));
      setMode("action");
      toast({ title: "Registration Successful", description: "Welcome to Janhitkari Library!" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async (type: "in" | "out") => {
    if (!qrCodeId && !token) {
      toast({ variant: "destructive", title: "Scan Required", description: "Please scan a valid library QR code." });
      return;
    }

    setLoading(true);
    try {
      if (type === "in") {
        // Check for active visit
        const { data: active } = await supabase.from("attendance").select("*").eq("member_id", user.id).eq("status", "inside").single();
        if (active) throw new Error("You are already checked in.");

        await supabase.from("attendance").insert([{
          member_id: user.id,
          qr_code_id: qrCodeId,
          device_fingerprint: fingerprint,
          status: "inside"
        }]);
      } else {
        const { data: active, error } = await supabase.from("attendance").select("*").eq("member_id", user.id).eq("status", "inside").single();
        if (error || !active) throw new Error("No active check-in found.");

        const checkIn = new Date(active.check_in_time);
        const checkOut = new Date();
        const duration = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000);

        await supabase.from("attendance").update({
          check_out_time: checkOut.toISOString(),
          duration_minutes: duration,
          status: "completed"
        }).eq("id", active.id);
      }
      setMode("success");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Failed", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("library_member");
    setUser(null);
    setMode("choice");
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-navy w-full max-w-md rounded-3xl p-8 shadow-2xl border border-gold/20"
        >
          {mode === "choice" && (
            <div className="text-center space-y-6">
              <QrCode className="w-16 h-16 text-gold mx-auto" />
              <h1 className="font-display text-3xl font-bold text-gradient-gold">Digital Attendance</h1>
              <p className="font-body text-cream/70">Welcome to Janhitkari Library. Scan when you enter and when you leave.</p>
              <div className="grid gap-4">
                <button onClick={() => setMode("login")} className="flex items-center justify-center gap-3 py-4 bg-gold text-navy font-bold rounded-2xl hover:scale-[1.02] transition-all">
                  <LogIn className="w-5 h-5" /> Member Login
                </button>
                <button onClick={() => setMode("register")} className="flex items-center justify-center gap-3 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-2xl hover:bg-gold/10 transition-all">
                  <UserPlus className="w-5 h-5" /> New Registration
                </button>
              </div>
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-6">
              <button type="button" onClick={() => setMode("choice")} className="text-gold flex items-center gap-2 text-sm font-body"><ArrowLeft className="w-4 h-4"/> Back</button>
              <h2 className="font-display text-2xl font-bold text-cream">Member Login</h2>
              <div className="space-y-4">
                <Input label="Mobile Number" type="tel" value={mobile} onChange={setMobile} icon={Smartphone} />
                <Input label="Password" type="password" value={password} onChange={setPassword} icon={ShieldCheck} />
              </div>
              <button disabled={loading} className="w-full py-4 bg-gold text-navy font-bold rounded-2xl disabled:opacity-50">
                {loading ? "Authenticating..." : "Login & Continue"}
              </button>
            </form>
          )}

          {mode === "register" && (
            <form onSubmit={handleRegister} className="space-y-6">
              <button type="button" onClick={() => setMode("choice")} className="text-gold flex items-center gap-2 text-sm font-body"><ArrowLeft className="w-4 h-4"/> Back</button>
              <h2 className="font-display text-2xl font-bold text-cream">New Registration</h2>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                <Input label="Full Name" value={fullName} onChange={setFullName} />
                <Input label="Father's Name" value={fatherName} onChange={setFatherName} />
                <Input label="Mobile Number" type="tel" value={mobile} onChange={setMobile} />
                <Input label="Address" value={address} onChange={setAddress} />
                <Input label="Create Password" type="password" value={password} onChange={setPassword} />
              </div>
              <button disabled={loading} className="w-full py-4 bg-gold text-navy font-bold rounded-2xl disabled:opacity-50">
                {loading ? "Registering..." : "Create Account"}
              </button>
            </form>
          )}

          {mode === "action" && user && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-cream">Hello, {user.full_name}</h2>
                <p className="font-body text-cream/60 text-sm">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
              </div>

              <div className="grid gap-4">
                <button 
                  onClick={() => handleAttendance("in")}
                  disabled={loading}
                  className="group relative flex items-center justify-between p-6 bg-green-600/20 border-2 border-green-500/50 rounded-2xl hover:bg-green-600/30 transition-all text-left"
                >
                  <div>
                    <span className="block font-display font-bold text-green-400 text-xl">CHECK IN</span>
                    <span className="text-xs text-green-400/70 font-body">Starting study session</span>
                  </div>
                  <LogIn className="w-8 h-8 text-green-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button 
                  onClick={() => handleAttendance("out")}
                  disabled={loading}
                  className="group relative flex items-center justify-between p-6 bg-red-600/20 border-2 border-red-500/50 rounded-2xl hover:bg-red-600/30 transition-all text-left"
                >
                  <div>
                    <span className="block font-display font-bold text-red-400 text-xl">LEAVE LIBRARY</span>
                    <span className="text-xs text-red-400/70 font-body">Ending study session</span>
                  </div>
                  <LogOut className="w-8 h-8 text-red-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <div className="pt-4 border-t border-cream/10">
                <button onClick={logout} className="text-cream/40 hover:text-cream text-xs font-body transition-colors underline">Not you? Switch Account</button>
              </div>
            </div>
          )}

          {mode === "success" && (
            <div className="text-center space-y-6">
              <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
              <h2 className="font-display text-3xl font-bold text-cream">Success!</h2>
              <p className="font-body text-cream/80">Your attendance has been recorded on the library server.</p>
              <button onClick={() => setMode("action")} className="w-full py-4 bg-navy-light text-cream font-bold rounded-2xl border border-gold/30">
                Return to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

const Input = ({ label, type = "text", value, onChange, icon: Icon }: any) => (
  <div className="space-y-1">
    <label className="block text-xs font-body font-semibold text-gold uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />}
      <input 
        required
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-10' : 'px-4'} py-3 rounded-xl bg-navy-light border border-gold/20 text-cream font-body focus:outline-none focus:border-gold transition-colors placeholder:text-cream/20`}
      />
    </div>
  </div>
);

export default AttendancePage;
