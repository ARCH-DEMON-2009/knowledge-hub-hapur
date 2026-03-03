import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { q: "Is the library completely free?", a: "Yes! Janhitkari Library is 100% free for everyone. There are no registration fees, no monthly charges, and no hidden costs." },
  { q: "What are the library timings?", a: "We are open daily from 6:00 AM to 8:00 PM — that's 14 hours every single day." },
  { q: "Is registration required?", a: "No formal registration is needed. Simply walk in and fill your name and entry time in the register placed on the table." },
  { q: "What facilities are available?", a: "We offer peaceful study areas, competitive exam preparation space, free Wi-Fi, computer lab, printing services, newspapers, clean drinking water, CCTV security, comfortable seating, proper lighting, and a silent environment." },
  { q: "Who founded this library?", a: "Janhitkari Library was founded by Bijander Kumar with the mission of providing free and disciplined education to every student in Hapur." },
  { q: "Where is the library located?", a: "We are located in Ramgarhi, Hapur, Uttar Pradesh, India. You can reach us at 9917917437 for directions." },
];

const FAQSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 max-w-3xl" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold-dark font-body text-sm font-semibold tracking-wider uppercase mb-4 block">❓ Have Questions?</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-navy mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-xl overflow-hidden shadow-soft"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-display text-base font-semibold text-navy pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gold-dark shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{ height: openIndex === i ? "auto" : 0, opacity: openIndex === i ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <p className="px-6 pb-5 font-body text-muted-foreground leading-relaxed">{faq.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
