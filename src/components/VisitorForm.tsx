import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, User, Send, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VisitorForm = () => {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from("visitor_logs" as any).insert([
        {
          student_name: name,
          purpose: purpose,
          entry_time: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: "Entry Recorded",
        description: "Your entry time has been logged successfully.",
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setName("");
        setPurpose("");
      }, 3000);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to record entry.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-cream/50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 shadow-soft border-gold/20"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gold" />
              </div>
              <h2 className="font-display text-2xl font-bold text-navy">Visitor Entry</h2>
              <p className="font-body text-muted-foreground mt-2">Record your entry to the library</p>
            </div>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-display text-xl font-bold text-navy">Thank You!</h3>
                <p className="font-body text-muted-foreground">Your entry has been recorded.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-2">
                    Student Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 font-body bg-white text-navy placeholder:text-muted-foreground"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-body text-sm font-medium text-navy mb-2">
                    Purpose of Visit (Optional)
                  </label>
                  <input
                    type="text"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-gold/50 font-body bg-white text-navy placeholder:text-muted-foreground"
                    placeholder="e.g. Exam Prep, Self Study"
                  />
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-4 bg-navy text-gold-light rounded-xl font-semibold font-body text-lg shadow-navy hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Recording..." : (
                    <>
                      <Send className="w-5 h-5" />
                      Log Entry
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VisitorForm;
