import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Lock, LogOut, ToggleLeft, ToggleRight, Calendar, Megaphone,
  Image, MessageSquare, Trash2, Plus, Save, RefreshCw,
} from "lucide-react";

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const FUNCTION_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/admin`;

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"status" | "closures" | "announcements" | "gallery" | "testimonials">("status");

  const storedPassword = () => sessionStorage.getItem("admin_pw") || "";

  const adminFetch = useCallback(async (body: object) => {
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": storedPassword(),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  }, []);

  const handleLogin = async () => {
    try {
      setError("");
      const res = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify({ action: "verify" }),
      });
      if (res.ok) {
        sessionStorage.setItem("admin_pw", password);
        setAuthed(true);
      } else {
        setError("Invalid password");
      }
    } catch {
      setError("Connection failed");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_pw");
    setAuthed(false);
    setPassword("");
  };

  // Check existing session
  useEffect(() => {
    const pw = sessionStorage.getItem("admin_pw");
    if (pw) {
      fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pw },
        body: JSON.stringify({ action: "verify" }),
      }).then((res) => {
        if (res.ok) setAuthed(true);
        else sessionStorage.removeItem("admin_pw");
      });
    }
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-navy rounded-2xl p-8 w-full max-w-sm"
        >
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-gold mx-auto mb-3" />
            <h1 className="font-display text-2xl font-bold text-cream">Admin Panel</h1>
            <p className="font-body text-cream/60 text-sm mt-1">Janhitkari Library</p>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-lg bg-[hsl(222,60%,14%)] border border-[hsl(var(--gold)/0.3)] text-cream font-body placeholder:text-cream/40 focus:outline-none focus:border-gold mb-3"
          />
          {error && <p className="text-[hsl(0,80%,60%)] text-sm font-body mb-3">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full py-3 rounded-lg bg-gold text-navy font-semibold font-body hover:brightness-110 transition-all"
          >
            Login
          </button>
        </motion.div>
      </div>
    );
  }

  const tabs = [
    { key: "status" as const, label: "Library Status", icon: ToggleLeft },
    { key: "closures" as const, label: "Closures", icon: Calendar },
    { key: "announcements" as const, label: "Announcements", icon: Megaphone },
    { key: "gallery" as const, label: "Gallery", icon: Image },
    { key: "testimonials" as const, label: "Testimonials", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-navy shadow-navy">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-cream">Admin Panel</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-cream/70 hover:text-cream font-body text-sm">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-gold text-navy shadow-gold"
                  : "bg-card text-muted-foreground hover:bg-accent/20"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "status" && <StatusPanel adminFetch={adminFetch} />}
        {tab === "closures" && <CrudPanel adminFetch={adminFetch} table="closure_dates" fields={["date", "reason"]} />}
        {tab === "announcements" && <CrudPanel adminFetch={adminFetch} table="announcements" fields={["title", "content", "is_active"]} />}
        {tab === "gallery" && <GalleryPanel adminFetch={adminFetch} />}
        {tab === "testimonials" && <CrudPanel adminFetch={adminFetch} table="testimonials" fields={["student_name", "message", "course", "rating", "is_visible"]} />}
      </div>
    </div>
  );
};

// Status Panel
const StatusPanel = ({ adminFetch }: { adminFetch: (body: object) => Promise<any> }) => {
  const [status, setStatus] = useState({ is_open: true, opening_time: "6:00 AM", closing_time: "8:00 PM", special_message: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch({ action: "list", table: "library_status" }).then(({ data }) => {
      if (data?.[0]) setStatus(data[0]);
      setLoading(false);
    });
  }, [adminFetch]);

  const save = async () => {
    setSaving(true);
    await adminFetch({ action: "upsert_status", data: status });
    setSaving(false);
  };

  if (loading) return <p className="font-body text-muted-foreground">Loading...</p>;

  return (
    <div className="glass rounded-xl p-6 max-w-lg shadow-soft">
      <h2 className="font-display text-xl font-bold text-navy mb-4">Library Status</h2>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          {status.is_open ? (
            <ToggleRight className="w-8 h-8 text-[hsl(140,60%,45%)]" onClick={() => setStatus({ ...status, is_open: false })} />
          ) : (
            <ToggleLeft className="w-8 h-8 text-muted-foreground" onClick={() => setStatus({ ...status, is_open: true })} />
          )}
          <span className="font-body font-medium text-navy">{status.is_open ? "Open" : "Closed"}</span>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Opening Time</label>
            <input value={status.opening_time} onChange={(e) => setStatus({ ...status, opening_time: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground" />
          </div>
          <div>
            <label className="font-body text-sm text-muted-foreground block mb-1">Closing Time</label>
            <input value={status.closing_time} onChange={(e) => setStatus({ ...status, closing_time: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground" />
          </div>
        </div>

        <div>
          <label className="font-body text-sm text-muted-foreground block mb-1">Special Message</label>
          <input value={status.special_message || ""} onChange={(e) => setStatus({ ...status, special_message: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground" placeholder="e.g. Closed for Holi" />
        </div>

        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-navy font-semibold font-body text-sm hover:brightness-110 disabled:opacity-50">
          <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Status"}
        </button>
      </div>
    </div>
  );
};

// Generic CRUD Panel
const CrudPanel = ({ adminFetch, table, fields }: { adminFetch: (body: object) => Promise<any>; table: string; fields: string[] }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState<Record<string, any>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch({ action: "list", table });
    setItems(data || []);
    setLoading(false);
  }, [adminFetch, table]);

  useEffect(() => { load(); }, [load]);

  const add = async () => {
    await adminFetch({ action: "insert", table, data: newItem });
    setNewItem({});
    load();
  };

  const remove = async (id: string) => {
    await adminFetch({ action: "delete", table, id });
    load();
  };

  const toggleField = async (id: string, field: string, currentValue: boolean) => {
    await adminFetch({ action: "update", table, id, data: { [field]: !currentValue } });
    load();
  };

  return (
    <div className="space-y-6">
      {/* Add form */}
      <div className="glass rounded-xl p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold text-navy mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add New
        </h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field}>
              <label className="font-body text-sm text-muted-foreground block mb-1 capitalize">{field.replace("_", " ")}</label>
              {field === "is_active" || field === "is_visible" ? (
                <select
                  value={newItem[field] !== undefined ? String(newItem[field]) : "true"}
                  onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value === "true" })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              ) : field === "rating" ? (
                <input
                  type="number" min="1" max="5"
                  value={newItem[field] || ""}
                  onChange={(e) => setNewItem({ ...newItem, [field]: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground"
                />
              ) : field === "date" ? (
                <input
                  type="date"
                  value={newItem[field] || ""}
                  onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground"
                />
              ) : (
                <input
                  value={newItem[field] || ""}
                  onChange={(e) => setNewItem({ ...newItem, [field]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground"
                  placeholder={field.replace("_", " ")}
                />
              )}
            </div>
          ))}
        </div>
        <button onClick={add} className="mt-4 flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gold text-navy font-semibold font-body text-sm hover:brightness-110">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* List */}
      <div className="glass rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-navy">Existing Items ({items.length})</h3>
          <button onClick={load} className="text-muted-foreground hover:text-navy">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="font-body text-muted-foreground text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm">No items yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-card border border-border">
                <div className="flex-1 min-w-0">
                  {fields.map((f) => (
                    <div key={f} className="font-body text-sm">
                      <span className="text-muted-foreground capitalize">{f.replace("_", " ")}:</span>{" "}
                      {f === "is_active" || f === "is_visible" ? (
                        <button
                          onClick={() => toggleField(item.id, f, item[f])}
                          className={`font-semibold ${item[f] ? "text-[hsl(140,60%,45%)]" : "text-[hsl(0,60%,50%)]"}`}
                        >
                          {item[f] ? "Yes" : "No"}
                        </button>
                      ) : (
                        <span className="text-foreground font-medium">{String(item[f] ?? "—")}</span>
                      )}
                    </div>
                  ))}
                </div>
                <button onClick={() => remove(item.id)} className="text-[hsl(0,60%,50%)] hover:text-[hsl(0,80%,50%)] shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Gallery Panel with file upload to Supabase Storage
const GalleryPanel = ({ adminFetch }: { adminFetch: (body: object) => Promise<any> }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await adminFetch({ action: "list", table: "gallery" });
    setItems(data || []);
    setLoading(false);
  }, [adminFetch]);

  useEffect(() => { load(); }, [load]);

  const uploadFile = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.readAsDataURL(file);
      });

      await adminFetch({
        action: "upload_gallery_image",
        data: {
          base64,
          fileName: file.name,
          contentType: file.type,
          caption: caption || null,
        },
      });
      setCaption("");
      load();
    } catch (err) {
      console.error("Upload failed:", err);
    }
    setUploading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadFile(file);
  };

  const remove = async (id: string) => {
    await adminFetch({ action: "delete", table: "gallery", id });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-xl p-6 shadow-soft">
        <h3 className="font-display text-lg font-bold text-navy mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5" /> Upload Image
        </h3>
        <div className="space-y-3">
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-border bg-card font-body text-sm text-foreground"
            placeholder="Caption (optional)"
          />
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              dragOver
                ? "border-gold bg-[hsl(var(--gold)/0.08)]"
                : "border-border hover:border-gold/50 hover:bg-[hsl(var(--gold)/0.03)]"
            }`}
          >
            <Image className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-body text-sm text-muted-foreground">
              {uploading ? "Uploading..." : "Drag & drop an image or click to select"}
            </p>
            <p className="font-body text-xs text-muted-foreground/60 mt-1">JPG, PNG, WebP supported</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      <div className="glass rounded-xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-bold text-navy">Gallery ({items.length})</h3>
          <button onClick={load} className="text-muted-foreground hover:text-navy"><RefreshCw className="w-4 h-4" /></button>
        </div>
        {loading ? (
          <p className="font-body text-muted-foreground text-sm">Loading...</p>
        ) : items.length === 0 ? (
          <p className="font-body text-muted-foreground text-sm">No images yet. Upload one above!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((img) => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-soft border border-border">
                <img src={img.image_url} alt={img.caption || "Gallery"} className="w-full h-40 object-cover" />
                <div className="absolute inset-0 bg-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => remove(img.id)} className="p-2 bg-[hsl(0,80%,50%)] rounded-lg text-cream">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {img.caption && <p className="absolute bottom-0 left-0 right-0 bg-navy/70 text-cream text-xs p-2 font-body">{img.caption}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
