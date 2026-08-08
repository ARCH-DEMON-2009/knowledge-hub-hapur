import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, UserPlus, LogIn, LogOut, ArrowRight, ArrowLeft, 
  CheckCircle2, Clock, Smartphone, ShieldCheck, AlertCircle, RefreshCw,
  History
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

    // Handle token and auto-attendance
    const processToken = async (activeToken: string, currentUser: any) => {
      try {
        setLoading(true);
        // Validate QR Token
        const { data: qrData, error: qrError } = await supabase
          .from("qr_codes")
          .select("id")
          .eq("token_hash", activeToken)
          .eq("status", "active")
          .single();

        if (qrError || !qrData) {
          toast({ variant: "destructive", title: "Invalid QR", description: "This QR code is invalid or revoked." });
          return;
        }

        setQrCodeId(qrData.id);

        // If user is logged in, automate attendance
        if (currentUser) {
          await automateAttendance(qrData.id, currentUser);
        }
      } catch (err) {
        console.error("Token processing error:", err);
      } finally {
        setLoading(false);
      }
    };

    // Check existing session
    const storedUserStr = localStorage.getItem("library_member");
    const currentUser = storedUserStr ? JSON.parse(storedUserStr) : null;
    
    if (currentUser) {
      setUser(currentUser);
      setMode("action");
    }

    if (token) {
      processToken(token, currentUser);
    }
  }, [token]);

  const automateAttendance = async (qrId: string, member: any) => {
    try {
      // Check for today's active visit
      const { data: active } = await supabase
        .from("attendance")
        .select("*")
        .eq("member_id", member.id)
        .eq("status", "inside")
        .single();

      if (active) {
        // Already inside: Check-out
        const checkIn = new Date(active.check_in_time);
        const checkOut = new Date();
        const duration = Math.round((checkOut.getTime() - checkIn.getTime()) / 60000);

        await supabase.from("attendance").update({
          check_out_time: checkOut.toISOString(),
          duration_minutes: duration,
          status: "completed"
        }).eq("id", active.id);

        toast({ title: "Auto Check-out", description: "You have left the library. Goodbye!" });
        setMode("success");
      } else {
        // Outside: Check-in
        await supabase.from("attendance").insert([{
          member_id: member.id,
          qr_code_id: qrId,
          device_fingerprint: fingerprint,
          status: "inside"
        }]);

        toast({ title: "Auto Check-in", description: "Welcome to Janhitkari Library!" });
        setMode("success");
      }

      // Log audit
      await supabase.from("audit_logs").insert([{
        actor_id: member.id,
        actor_type: "member",
        action: active ? "check_out" : "check_in",
        entity_type: "attendance",
        reason: `Automated QR Scan`
      }]);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Automation Failed", description: err.message });
    }
  };

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
        if (active) {
            // Check if it's the same day. If so, don't allow double check-in
            const lastCheckIn = new Date(active.check_in_time);
            const today = new Date();
            if (lastCheckIn.toDateString() === today.toDateString()) {
               throw new Error("You are already checked in for today.");
            }
            // If it's another day but somehow still 'inside', we should probably auto-close it 
            // but for now just block it to maintain data integrity
            throw new Error("You have an open session from a previous day. Please contact admin.");
        }

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
      // Log audit
      await supabase.from("audit_logs").insert([{
        actor_id: user.id,
        actor_type: "member",
        action: type === "in" ? "check_in" : "check_out",
        entity_type: "attendance",
        reason: `Mobile scan: ${type}`
      }]);
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
              <div className="flex items-center justify-between mb-4">
                <button type="button" onClick={() => setMode("choice")} className="text-gold flex items-center gap-2 text-sm font-body hover:text-gold-light transition-colors">
                  <ArrowLeft className="w-4 h-4"/> Back
                </button>
                <span className="text-[10px] font-body text-cream/40 uppercase tracking-widest">Step 1/1</span>
              </div>
              
              <div className="space-y-2">
                <h2 className="font-display text-2xl font-bold text-cream">Create Account</h2>
                <p className="font-body text-xs text-cream/60">Fill details to start tracking your study hours</p>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                  <Input label="Full Name" value={fullName} onChange={setFullName} placeholder="e.g. Rahul Sharma" />
                  <Input label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="e.g. Suresh Sharma" />
                  <Input label="Mobile Number" type="tel" value={mobile} onChange={setMobile} placeholder="10-digit number" icon={Smartphone} />
                  <Input label="Address" value={address} onChange={setAddress} placeholder="Street, Colony, City" />
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Input label="Password" type="password" value={password} onChange={setPassword} icon={ShieldCheck} />
                    <Input label="Confirm" type="password" value={password} onChange={setPassword} />
                  </div>
                </div>
              </div>

              <button disabled={loading} className="w-full py-4 bg-gold text-navy font-bold rounded-2xl disabled:opacity-50 hover:brightness-110 shadow-gold transition-all flex items-center justify-center gap-2">
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>Complete Registration <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </form>
          )}

          {mode === "action" && user && (
            <div className="text-center space-y-8">
              <div>
                <h2 className="font-display text-2xl font-bold text-cream">Hello, {user.full_name}</h2>
                <p className="font-body text-cream/60 text-sm">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</p>
                <button 
                  onClick={() => navigate("/library/profile")}
                  className="mt-2 text-gold text-xs font-bold font-body flex items-center justify-center gap-1 hover:underline mx-auto"
                >
                  <History className="w-3 h-3" /> View My History
                </button>
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

const Input = ({ label, type = "text", value, onChange, icon: Icon, placeholder }: any) => (
  <div className="space-y-1.5 group">
    <label className="block text-[10px] font-body font-bold text-gold/80 uppercase tracking-widest ml-1 group-focus-within:text-gold transition-colors">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 group-focus-within:text-gold/70 transition-colors" />}
      <input 
        required
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-3.5 rounded-xl bg-navy/60 border border-gold/30 text-cream font-body text-sm focus:outline-none focus:border-gold focus:bg-navy/80 transition-all placeholder:text-cream/30`}
      />
    </div>
  </div>
);

export default AttendancePage;
