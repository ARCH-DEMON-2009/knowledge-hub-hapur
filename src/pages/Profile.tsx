import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Calendar, Clock, BookOpen, ArrowLeft, 
  LogOut, ShieldCheck, History, TrendingUp, Award
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatTime, formatDate } from "@/lib/attendance-utils";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCurrentlyInside, setIsCurrentlyInside] = useState(false);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    avgDuration: 0,
    streak: 0
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("library_member");
    if (!storedUser) {
      navigate("/library/attendance");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
    loadData(userData.id);
  }, []);

  const loadData = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from("attendance")
        .select("*")
        .eq("member_id", memberId)
        .order("check_in_time", { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
      calculateStats(data || []);
      setIsCurrentlyInside((data || []).some(a => a.status === 'inside'));
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: any[]) => {
    const totalSessions = data.length;
    const totalMinutes = data.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0);
    const avgDuration = totalSessions > 0 ? Math.round(totalMinutes / totalSessions) : 0;
    
    // Simple streak calculation
    let streak = 0;
    const today = new Date().toDateString();
    const sortedDates = [...new Set(data.map(a => new Date(a.check_in_time).toDateString()))];
    
    // This is a simplified streak
    setStats({ totalSessions, totalMinutes, avgDuration, streak: sortedDates.length });
  };

  const logout = () => {
    localStorage.removeItem("library_member");
    navigate("/library/attendance");
  };

  if (loading) return (
    <div className="min-h-screen bg-navy flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-gold"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Profile Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="glass-navy rounded-3xl p-8 border border-gold/20 text-center">
              <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gold/30">
                <User className="w-12 h-12 text-gold" />
              </div>
              <h1 className="font-display text-2xl font-bold text-cream">{user?.full_name}</h1>
              <p className="font-body text-cream/60 text-sm mb-2">{user?.mobile}</p>
              
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-6 ${
                isCurrentlyInside 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-slate-500/20 text-slate-400 border border-slate-500/30'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isCurrentlyInside ? 'bg-green-400 animate-pulse' : 'bg-slate-400'}`} />
                {isCurrentlyInside ? 'Currently Inside' : 'Currently Outside'}
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate("/library/attendance")}
                  className="flex-1 py-3 bg-gold text-navy font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> Attendance
                </button>
                <button 
                  onClick={logout}
                  className="px-4 py-3 bg-red-500/10 text-red-400 border border-red-500/30 font-bold rounded-xl text-sm"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="glass-navy rounded-3xl p-8 border border-gold/20">
              <h3 className="font-display font-bold text-cream mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-gold" /> Member Details
              </h3>
              <div className="space-y-4 text-left font-body text-sm">
                <div>
                  <span className="text-cream/40 block">Father's Name</span>
                  <span className="text-cream">{user?.father_name}</span>
                </div>
                <div>
                  <span className="text-cream/40 block">Address</span>
                  <span className="text-cream">{user?.address}</span>
                </div>
                <div>
                  <span className="text-cream/40 block">Joined Date</span>
                  <span className="text-cream">{formatDate(user?.created_at)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Stats & History */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Sessions" value={stats.totalSessions} icon={History} />
              <StatItem label="Study Hours" value={Math.round(stats.totalMinutes / 60)} icon={BookOpen} />
              <StatItem label="Avg Session" value={`${stats.avgDuration}m`} icon={Clock} />
              <StatItem label="Days Active" value={stats.streak} icon={TrendingUp} />
            </div>

            {/* Attendance History */}
            <div className="glass-navy rounded-3xl border border-gold/20 overflow-hidden">
              <div className="p-6 border-b border-gold/10 flex items-center justify-between">
                <h3 className="font-display font-bold text-cream flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gold" /> Attendance History
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-sm">
                  <thead className="bg-gold/5 text-gold/80 uppercase tracking-wider text-[10px] font-bold">
                    <tr>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">In</th>
                      <th className="px-6 py-4">Out</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold/10">
                    {attendance.map((row) => (
                      <tr key={row.id} className="hover:bg-gold/5 transition-colors">
                        <td className="px-6 py-4 text-cream">{formatDate(row.check_in_time)}</td>
                        <td className="px-6 py-4 text-cream/70">{formatTime(row.check_in_time)}</td>
                        <td className="px-6 py-4 text-cream/70">{row.check_out_time ? formatTime(row.check_out_time) : "—"}</td>
                        <td className="px-6 py-4 font-bold text-gold">{row.duration_minutes ? `${row.duration_minutes}m` : "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            row.status === 'inside' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {attendance.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-cream/40 italic">
                          No attendance records found yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const StatItem = ({ label, value, icon: Icon }: any) => (
  <div className="glass-navy p-6 rounded-2xl border border-gold/10 text-center">
    <Icon className="w-5 h-5 text-gold mx-auto mb-2 opacity-50" />
    <div className="text-2xl font-display font-bold text-cream">{value}</div>
    <div className="text-[10px] font-body text-cream/40 uppercase tracking-widest">{label}</div>
  </div>
);

export default ProfilePage;
