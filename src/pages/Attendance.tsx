import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  QrCode, UserPlus, LogIn, LogOut, ArrowRight, ArrowLeft, 
  CheckCircle2, Clock, Smartphone, ShieldCheck, AlertCircle, RefreshCw,
  History, Calendar
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
  const [successData, setSuccessData] = useState<any>(null);

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
        // If they already scanned "inside" TODAY, prevent duplicate check-in if somehow triggered,
        // but here we automate check-out.
        const checkInTime = new Date(active.check_in_time);
        const now = new Date();
        
        // Automation: If scanned again on same day, it's a check-out
        const checkOut = new Date();
        const duration = Math.round((checkOut.getTime() - checkInTime.getTime()) / 60000);

        await supabase.from("attendance").update({
          check_out_time: checkOut.toISOString(),
          duration_minutes: duration,
          status: "completed"
        }).eq("id", active.id);

        setSuccessData({
          name: member.full_name,
          status: "LEFT LIBRARY",
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        });
        toast({ title: "Check-out Recorded", description: "You have left the library. Goodbye!" });
        setMode("success");
      } else {
        // Outside: Check-in
        await supabase.from("attendance").insert([{
          member_id: member.id,
          qr_code_id: qrId,
          device_fingerprint: fingerprint,
          status: "inside"
        }]);

        setSuccessData({
          name: member.full_name,
          status: "CHECKED IN",
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
        });
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
            const lastCheckIn = new Date(active.check_in_time);
            const today = new Date();
            if (lastCheckIn.toDateString() === today.toDateString()) {
               throw new Error("You are already checked in for today.");
            }
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
      
      // Update local state with session info for confirmation screen
      const statusLabel = type === "in" ? "CHECKED IN" : "LEFT LIBRARY";
      setSuccessData({
        name: user.full_name,
        status: statusLabel,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
      });
      
      setMode("success");
      // Log audit
      await supabase.from("audit_logs").insert([{
        actor_id: user.id,
        actor_type: "member",
        action: type === "in" ? "check_in" : "check_out",
        entity_type: "attendance",
        reason: `Manual scan: ${type}`
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
    <div className="min-h-screen bg-navy flex flex-col selection:bg-gold selection:text-navy">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 py-24 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/5 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-navy w-full max-w-lg rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gold/20 relative z-10"
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
                <Input label="Mobile Number" type="tel" value={mobile} onChange={setMobile} icon={Smartphone} placeholder="Enter mobile" />
                <Input label="Password" type="password" value={password} onChange={setPassword} icon={ShieldCheck} placeholder="Enter password" />
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
                <p className="font-body text-xs text-cream/70">Fill details to start tracking your study hours</p>
              </div>

              <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-3 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Input label="Full Name" value={fullName} onChange={setFullName} placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div className="md:col-span-2">
                    <Input label="Father's Name" value={fatherName} onChange={setFatherName} placeholder="e.g. Suresh Sharma" />
                  </div>
                  <Input label="Mobile Number" type="tel" value={mobile} onChange={setMobile} placeholder="10-digit number" icon={Smartphone} />
                  <Input label="Address" value={address} onChange={setAddress} placeholder="Colony, City" />
                  
                  <Input label="Password" type="password" value={password} onChange={setPassword} icon={ShieldCheck} />
                  <Input label="Confirm" type="password" value={password} onChange={setPassword} />
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
                <div className="mt-4 p-3 bg-gold/10 border border-gold/20 rounded-xl">
                  <p className="text-gold text-xs font-body font-bold uppercase tracking-tighter">Automatic Mode Active</p>
                  <p className="text-cream/60 text-[10px] mt-1">Scan a library QR code to automatically check in or leave.</p>
                </div>
                <button 
                  onClick={() => navigate("/library/profile")}
                  className="mt-4 text-gold text-xs font-bold font-body flex items-center justify-center gap-1 hover:underline mx-auto"
                >
                  <History className="w-3 h-3" /> View My History
                </button>
              </div>

              <div className="grid gap-4 opacity-50 pointer-events-none select-none">
                <div className="text-[10px] text-cream/40 uppercase font-bold tracking-widest text-center mb-[-12px]">Manual Override</div>
                <button 
                  className="group relative flex items-center justify-between p-6 bg-green-600/20 border-2 border-green-500/50 rounded-2xl text-left"
                >
                  <div>
                    <span className="block font-display font-bold text-green-400 text-xl">CHECK IN</span>
                    <span className="text-xs text-green-400/70 font-body">Starting study session</span>
                  </div>
                  <LogIn className="w-8 h-8 text-green-500" />
                </button>

                <button 
                  className="group relative flex items-center justify-between p-6 bg-red-600/20 border-2 border-red-500/50 rounded-2xl text-left"
                >
                  <div>
                    <span className="block font-display font-bold text-red-400 text-xl">LEAVE LIBRARY</span>
                    <span className="text-xs text-red-400/70 font-body">Ending study session</span>
                  </div>
                  <LogOut className="w-8 h-8 text-red-500" />
                </button>
              </div>

              <div className="pt-4 border-t border-cream/10 flex flex-col gap-3">
                {!qrCodeId && (
                  <div className="bg-red-500/10 p-2 rounded-lg border border-red-500/30">
                    <p className="text-[10px] text-red-400 font-bold uppercase">Scan Required</p>
                    <p className="text-[9px] text-red-400/70">Please scan the library's official QR code to track attendance.</p>
                  </div>
                )}
                <button onClick={logout} className="text-cream/40 hover:text-cream text-xs font-body transition-colors underline">Not you? Switch Account</button>
              </div>
            </div>
          )}

          {mode === "success" && (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
              </motion.div>
              
              <div className="space-y-2">
                <h2 className="font-display text-3xl font-bold text-cream">Success!</h2>
                <p className="font-body text-cream/80">Your attendance has been recorded.</p>
              </div>

              {successData && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-navy/40 border border-gold/20 rounded-2xl p-6 text-left space-y-4"
                >
                  <div className="flex justify-between items-start border-b border-gold/10 pb-3">
                    <div>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Member</p>
                      <p className="text-cream font-display text-lg font-bold">{successData.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Status</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${successData.status === 'CHECKED IN' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {successData.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest flex items-center gap-1"><Clock className="w-3 h-3"/> Time</p>
                      <p className="text-cream font-body text-sm">{successData.time}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gold font-bold uppercase tracking-widest flex items-center gap-1"><Calendar className="w-3 h-3"/> Date</p>
                      <p className="text-cream font-body text-sm">{successData.date}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button onClick={() => setMode("action")} className="w-full py-4 bg-navy-light text-cream font-bold rounded-2xl border border-gold/30 hover:bg-navy transition-colors">
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
        className={`w-full ${Icon ? 'pl-11' : 'px-4'} py-4 rounded-2xl bg-navy/40 border border-gold/30 text-cream font-body text-sm focus:outline-none focus:border-gold focus:bg-navy/80 focus:ring-1 focus:ring-gold/20 transition-all placeholder:text-cream/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]`}
      />
    </div>
  </div>
);

export default AttendancePage;
