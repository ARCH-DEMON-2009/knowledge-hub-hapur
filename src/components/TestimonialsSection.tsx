import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Testimonial {
  id: string;
  student_name: string;
  message: string;
  course: string | null;
  rating: number;
}

const TestimonialsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    supabase
      .from("testimonials")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setTestimonials(data);
      });
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section className="py-24 bg-navy relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(45,80%,55%,0.05),transparent_60%)]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold font-body text-sm font-semibold tracking-wider uppercase mb-4 block">💬 Student Voices</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4">
            What Students Say
          </h2>
        </motion.div>

        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="max-w-2xl mx-auto text-center"
        >
          <Quote className="w-10 h-10 text-gold/30 mx-auto mb-6" />
          <p className="font-body text-cream/80 text-lg md:text-xl leading-relaxed mb-6">
            "{t.message}"
          </p>
          <div className="flex items-center justify-center gap-1 mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < t.rating ? "text-gold fill-gold" : "text-cream/20"}`}
              />
            ))}
          </div>
          <p className="font-display text-lg font-semibold text-cream">{t.student_name}</p>
          {t.course && (
            <p className="font-body text-cream/50 text-sm mt-1">{t.course}</p>
          )}

          {testimonials.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i === current ? "bg-gold w-6" : "bg-cream/30"
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
