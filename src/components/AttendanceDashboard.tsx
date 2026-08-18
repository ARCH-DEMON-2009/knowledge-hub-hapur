import { useState, useEffect } from "react";
import { 
  Users, Clock, LogIn, LogOut, BookOpen, UserCheck, 
  FileDown, QrCode, ShieldAlert, History, Activity, FileSpreadsheet, FileText, Search, Filter, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import QRCode from "react-qr-code";
import { formatTime, formatDate } from "@/lib/attendance-utils";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area
} from 'recharts';

interface AttendanceStats {
  totalMembers: number;
  currentlyInsideCount: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  todayStudyHours: number;
  currentlyInsideList: any[];
  dailyTrends?: any[];
}

const AttendanceDashboard = ({ adminFetch }: { adminFetch: (body: object) => Promise<any> }) => {
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "inside" | "history" | "qr" | "audit">("overview");

  const exportToExcel = async (customData?: any[], fileName?: string) => {
    try {
      const dataToExport = customData || (await adminFetch({ action: "list", table: "attendance" })).data;
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
      XLSX.writeFile(workbook, `${fileName || 'Janhitkari_Attendance'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      await logAudit("excel_export", customData ? "Filtered export" : "Full export");
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const exportToCSV = async (customData?: any[], fileName?: string) => {
    try {
      const dataToExport = customData || (await adminFetch({ action: "list", table: "attendance" })).data;
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${fileName || 'Janhitkari_Attendance'}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      await logAudit("csv_export", customData ? "Filtered export" : "Full export");
    } catch (error) {
      console.error("CSV Export failed", error);
    }
  };

  const exportToPDF = async (customData?: any[], fileName?: string) => {
    try {
      const dataToExport = customData || (await adminFetch({ action: "list", table: "attendance" })).data;
      const doc = new jsPDF() as any;
      
      // Branding
      doc.setFillColor(28, 43, 72); // Navy
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("JANHITKARI PUBLIC LIBRARY", 105, 20, { align: "center" });
      doc.setFontSize(10);
      doc.text("Elite Study Center & Knowledge Hub", 105, 28, { align: "center" });
      
      doc.setTextColor(28, 43, 72);
      doc.setFontSize(14);
      doc.text(`Attendance Report: ${fileName || 'Full History'}`, 15, 50);
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 15, 57);

      const tableData = dataToExport.map((row: any) => [
        row.member_id.substring(0, 8),
        formatDate(row.check_in_time),
        formatTime(row.check_in_time),
        row.check_out_time ? formatTime(row.check_out_time) : "-",
        row.duration_minutes ? `${row.duration_minutes}m` : "-",
        row.status.toUpperCase()
      ]);

      doc.autoTable({
        startY: 65,
        head: [['Member ID', 'Date', 'In Time', 'Out Time', 'Duration', 'Status']],
        body: tableData,
        headStyles: { fillColor: [28, 43, 72] },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 65 }
      });

      doc.save(`${fileName || 'Janhitkari_Report'}_${new Date().toISOString().split('T')[0]}.pdf`);
      
      await logAudit("pdf_export", customData ? "Filtered export" : "Full export");
    } catch (error) {
      console.error("PDF Export failed", error);
    }
  };

  const logAudit = async (action: string, reason: string) => {
    await adminFetch({ 
      action: "insert", 
      table: "audit_logs", 
      data: { 
        actor_type: "admin", 
        action, 
        entity_type: "attendance",
        reason
      } 
    });
  };

  const loadStats = async () => {
    try {
      const data = await adminFetch({ action: "get_attendance_stats" });
      setStats(data);
    } catch (error) {
      console.error("Failed to load stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground font-body">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Members" value={stats?.totalMembers || 0} icon={Users} color="bg-blue-500" />
        <StatCard title="Inside Now" value={stats?.currentlyInsideCount || 0} icon={UserCheck} color="bg-green-500" />
        <StatCard title="Today's Check-ins" value={stats?.todayCheckIns || 0} icon={LogIn} color="bg-[hsl(45,80%,55%)]" />
        <StatCard title="Today's Study Hours" value={stats?.todayStudyHours || 0} icon={BookOpen} color="bg-purple-500" />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2">
        <div className="flex flex-wrap gap-2">
          <TabButton active={activeTab === "overview"} onClick={() => setActiveTab("overview")} label="Overview" icon={Activity} />
          <TabButton active={activeTab === "inside"} onClick={() => setActiveTab("inside")} label="Currently Inside" icon={UserCheck} />
          <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")} label="History" icon={History} />
          <TabButton active={activeTab === "qr"} onClick={() => setActiveTab("qr")} label="QR Management" icon={QrCode} />
          <TabButton active={activeTab === "audit"} onClick={() => setActiveTab("audit")} label="Audit Logs" icon={ShieldAlert} />
        </div>
        
        <div className="flex gap-2">
          <div className="flex bg-white rounded-lg shadow-sm border border-border p-1">
            <button 
              onClick={() => exportToExcel()}
              title="Export to Excel"
              className="p-1.5 hover:bg-green-50 text-green-700 rounded transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
            <button 
              onClick={() => exportToCSV()}
              title="Export to CSV"
              className="p-1.5 hover:bg-blue-50 text-blue-700 rounded transition-colors"
            >
              <FileDown className="w-4 h-4" />
            </button>
            <button 
              onClick={() => exportToPDF()}
              title="Export to PDF"
              className="p-1.5 hover:bg-red-50 text-red-700 rounded transition-colors"
            >
              <FileText className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === "overview" && (
            <div className="space-y-6">
                {/* Analytics Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                    <GlassCard variant="light" className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-display font-bold text-navy flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-gold-dark" /> Attendance Trends (7 Days)
                            </h3>
                        </div>
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.dailyTrends || []}>
                                    <defs>
                                        <linearGradient id="colorCheckIns" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#1C2B48" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#1C2B48" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorCheckOuts" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#C5A059" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Legend iconType="circle" />
                                    <Area type="monotone" dataKey="checkIns" name="Check-ins" stroke="#1C2B48" fillOpacity={1} fill="url(#colorCheckIns)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="checkOuts" name="Check-outs" stroke="#C5A059" fillOpacity={1} fill="url(#colorCheckOuts)" strokeWidth={2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-2xl shadow-soft border border-white/20">
                        <h3 className="font-display font-bold text-navy mb-4 flex items-center gap-2">
                            <FileDown className="w-5 h-5 text-gold-dark" /> Export Data Hub
                        </h3>
                        <p className="text-sm text-muted-foreground font-body mb-6">
                            Download full attendance records in professional, branded formats for archival and reporting.
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => exportToExcel()} className="flex flex-col items-center gap-2 py-4 bg-white border border-green-200 text-green-700 font-bold rounded-xl hover:bg-green-50 transition-all shadow-sm">
                                <FileSpreadsheet className="w-6 h-6" />
                                <span className="text-[10px] uppercase">Excel</span>
                            </button>
                            <button onClick={() => exportToCSV()} className="flex flex-col items-center gap-2 py-4 bg-white border border-blue-200 text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-sm">
                                <FileDown className="w-6 h-6" />
                                <span className="text-[10px] uppercase">CSV</span>
                            </button>
                            <button onClick={() => exportToPDF()} className="flex flex-col items-center gap-2 py-4 bg-white border border-red-200 text-red-700 font-bold rounded-xl hover:bg-red-50 transition-all shadow-sm">
                                <FileText className="w-6 h-6" />
                                <span className="text-[10px] uppercase">PDF</span>
                            </button>
                        </div>
                        
                        <div className="mt-8 p-4 bg-navy/5 rounded-xl border border-navy/10">
                            <h4 className="text-xs font-bold text-navy uppercase tracking-widest mb-2">Live Occupancy</h4>
                            <div className="w-full bg-navy/10 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, ((stats?.currentlyInsideCount || 0) / 50) * 100)}%` }}
                                    className="bg-navy h-full"
                                />
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-muted-foreground">{stats?.currentlyInsideCount || 0} active</span>
                                <span className="text-[10px] text-muted-foreground">Capacity: 50</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === "inside" && (
            <div className="glass rounded-xl overflow-hidden shadow-soft">
                <table className="w-full text-left font-body text-sm">
                    <thead className="bg-navy text-cream">
                        <tr>
                            <th className="px-4 py-3">Member</th>
                            <th className="px-4 py-3">Check-in</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3">Device</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {stats?.currentlyInsideList.map((a: any) => (
                            <tr key={a.id} className="bg-card">
                                <td className="px-4 py-3 font-medium text-navy">{a.members?.full_name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{formatTime(a.check_in_time)}</td>
                                <td className="px-4 py-3"><DurationCounter startTime={a.check_in_time} /></td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">{a.device_fingerprint?.substring(0, 8)}...</td>
                            </tr>
                        ))}
                        {stats?.currentlyInsideCount === 0 && (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">No members currently inside.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        )}

        {activeTab === "qr" && <QRManager adminFetch={adminFetch} />}
        {activeTab === "history" && <AttendanceHistory adminFetch={adminFetch} exportToExcel={exportToExcel} exportToCSV={exportToCSV} exportToPDF={exportToPDF} />}
        {activeTab === "audit" && <AuditLogs adminFetch={adminFetch} />}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="glass p-5 rounded-2xl shadow-soft flex items-center gap-4">
    <div className={`p-3 rounded-xl ${color} text-white`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-display font-bold text-navy">{value}</p>
    </div>
  </div>
);

const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
      active ? "bg-navy text-cream shadow-navy" : "text-muted-foreground hover:bg-accent/20"
    }`}
  >
    <Icon className="w-4 h-4" />
    {label}
  </button>
);

const DurationCounter = ({ startTime }: { startTime: string }) => {
  const [duration, setDuration] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date().getTime() - new Date(startTime).getTime();
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      setDuration(`${hours}h ${mins}m`);
    };
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [startTime]);

  return <span className="font-semibold text-gold-dark">{duration}</span>;
};

const QRManager = ({ adminFetch }: { adminFetch: (body: object) => Promise<any> }) => {
  const [qrs, setQrs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await adminFetch({ action: "list", table: "qr_codes" });
    setQrs(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const generateNew = async () => {
      const name = prompt("Enter a name for this QR code (e.g. Main Entrance)");
      if (!name) return;
      
      const token = crypto.randomUUID();
      await adminFetch({ 
          action: "insert", 
          table: "qr_codes", 
          data: { 
              name, 
              token_hash: token,
              status: "active" 
          } 
      });
      load();
  };

  const revoke = async (id: string) => {
      if (!confirm("Are you sure you want to revoke this QR code? Old prints will stop working.")) return;
      await adminFetch({ 
          action: "update", 
          table: "qr_codes", 
          id, 
          data: { status: "revoked", revoked_at: new Date().toISOString() } 
      });
      load();
  };

  return (
      <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h3 className="font-display text-xl font-bold text-navy">QR Access Control</h3>
              <button onClick={generateNew} className="flex items-center gap-2 px-4 py-2 bg-[hsl(45,80%,55%)] text-navy font-bold rounded-lg shadow-gold">
                  <Plus className="w-4 h-4" /> Generate New QR
              </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrs.map((qr) => (
                  <div key={qr.id} className={`glass p-6 rounded-2xl shadow-soft relative overflow-hidden ${qr.status === 'revoked' ? 'opacity-60' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <h4 className="font-display font-bold text-navy">{qr.name}</h4>
                              <p className="text-xs text-muted-foreground font-body">ID: {qr.id.substring(0, 8)}</p>
                          </div>
                          <span className={`text-[10px] px-2 py-1 rounded-full uppercase font-bold ${qr.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {qr.status}
                          </span>
                      </div>
                      
                      {qr.status === 'active' && (
                          <div className="flex flex-col items-center bg-white p-4 rounded-xl mb-4">
                              <QRCode 
                                value={`https://janhitkari-library.shashanksv.com/library/attendance?token=${qr.token_hash}`} 
                                size={150}
                                viewBox={`0 0 256 256`}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                              />
                              <p className="mt-3 text-[10px] text-muted-foreground font-body text-center break-all">
                                Token: {qr.token_hash}
                              </p>
                          </div>
                      )}

                      <div className="flex gap-2">
                          {qr.status === 'active' && (
                            <button onClick={() => window.print()} className="flex-1 py-2 text-xs font-body font-semibold border border-navy rounded-lg hover:bg-navy hover:text-white transition-all">
                                Print QR
                            </button>
                          )}
                          <button onClick={() => revoke(qr.id)} disabled={qr.status === 'revoked'} className="flex-1 py-2 text-xs font-body font-semibold border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:border-gray-300 disabled:text-gray-300">
                              Revoke
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );
};

const AttendanceHistory = ({ adminFetch, exportToExcel, exportToCSV, exportToPDF }: { 
    adminFetch: (body: object) => Promise<any>, 
    exportToExcel: (data?: any[], name?: string) => Promise<void>,
    exportToCSV: (data?: any[], name?: string) => Promise<void>,
    exportToPDF: (data?: any[], name?: string) => Promise<void>
}) => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminFetch({ action: "list", table: "attendance" }).then(({ data }) => {
            setHistory(data || []);
            setLoading(false);
        });
    }, []);

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-display text-xl font-bold text-navy">Attendance History</h3>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <input 
                    type="date" 
                    id="history-date-filter"
                    className="px-3 py-1.5 rounded-lg border border-border text-sm font-body bg-white"
                />
                <div className="flex bg-white rounded-lg shadow-sm border border-border p-1">
                    <button 
                        onClick={() => {
                            const date = (document.getElementById('history-date-filter') as HTMLInputElement).value;
                            if (!date) return;
                            const filtered = history.filter(h => new Date(h.check_in_time).toISOString().split('T')[0] === date);
                            exportToExcel(filtered, `Attendance_${date}`);
                        }}
                        title="Excel Export"
                        className="p-1.5 hover:bg-green-50 text-green-700 rounded transition-colors"
                    >
                        <FileSpreadsheet className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => {
                            const date = (document.getElementById('history-date-filter') as HTMLInputElement).value;
                            if (!date) return;
                            const filtered = history.filter(h => new Date(h.check_in_time).toISOString().split('T')[0] === date);
                            exportToCSV(filtered, `Attendance_${date}`);
                        }}
                        title="CSV Export"
                        className="p-1.5 hover:bg-blue-50 text-blue-700 rounded transition-colors"
                    >
                        <FileDown className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => {
                            const date = (document.getElementById('history-date-filter') as HTMLInputElement).value;
                            if (!date) return;
                            const filtered = history.filter(h => new Date(h.check_in_time).toISOString().split('T')[0] === date);
                            exportToPDF(filtered, `Attendance_${date}`);
                        }}
                        title="PDF Export"
                        className="p-1.5 hover:bg-red-50 text-red-700 rounded transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
        <div className="glass rounded-xl overflow-hidden shadow-soft">
            <table className="w-full text-left font-body text-sm">
                <thead className="bg-navy text-cream">
                    <tr>
                        <th className="px-4 py-3">Member</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Check-in</th>
                        <th className="px-4 py-3">Check-out</th>
                        <th className="px-4 py-3">Duration</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {history.map((h) => (
                        <tr key={h.id} className="bg-card hover:bg-accent/5">
                                <td className="px-4 py-3 font-medium text-navy cursor-pointer hover:underline" onClick={() => {
                                    const filtered = history.filter(item => item.member_id === h.member_id);
                                    exportToExcel(filtered, `History_Member_${h.member_id.substring(0,8)}`);
                                }}>{h.member_id.substring(0,8)}...</td>
                                <td className="px-4 py-3">{formatDate(h.check_in_time)}</td>
                            <td className="px-4 py-3">{formatTime(h.check_in_time)}</td>
                            <td className="px-4 py-3">{h.check_out_time ? formatTime(h.check_out_time) : "—"}</td>
                            <td className="px-4 py-3 font-semibold">{h.duration_minutes ? `${h.duration_minutes}m` : "—"}</td>
                            <td className="px-4 py-3">
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                                    h.status === 'inside' ? 'bg-green-100 text-green-700' : 
                                    h.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {h.status.replace('_', ' ')}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    );
};

const AuditLogs = ({ adminFetch }: { adminFetch: (body: object) => Promise<any> }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterAction, setFilterAction] = useState("all");

    useEffect(() => {
        adminFetch({ action: "list", table: "audit_logs" }).then(({ data }) => setLogs(data || []));
    }, []);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (log.reason && log.reason.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (log.actor_type && log.actor_type.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesAction = filterAction === "all" || log.action === filterAction;
        
        return matchesSearch && matchesAction;
    });

    const uniqueActions = Array.from(new Set(logs.map(l => l.action)));

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-3 rounded-xl border border-border">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                        type="text"
                        placeholder="Search audit logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm font-body border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <select 
                        value={filterAction}
                        onChange={(e) => setFilterAction(e.target.value)}
                        className="pl-9 pr-8 py-2 text-sm font-body border border-border rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-navy/5 focus:border-navy"
                    >
                        <option value="all">All Actions</option>
                        {uniqueActions.map(action => (
                            <option key={action} value={action}>{action.replace('_', ' ').toUpperCase()}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredLogs.map(log => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={log.id} 
                            className="glass p-4 rounded-xl border-l-4 border-navy shadow-soft flex justify-between items-center"
                        >
                            <div>
                                <p className="text-sm font-bold text-navy font-body uppercase">{log.action.replace('_', ' ')}</p>
                                <p className="text-xs text-muted-foreground font-body">{log.reason || "System action"}</p>
                                {log.actor_type && (
                                    <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mt-1 inline-block uppercase font-bold">Actor: {log.actor_type}</span>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground font-body">{formatTime(log.timestamp)}</p>
                                <p className="text-[10px] text-muted-foreground font-body font-bold">{formatDate(log.timestamp)}</p>
                            </div>
                        </motion.div>
                    ))}
                    {filteredLogs.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground italic font-body">No matching audit logs found.</div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Plus = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
);

export default AttendanceDashboard;
