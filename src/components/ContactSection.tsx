import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-24 bg-navy relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(45,80%,55%,0.06),transparent_60%)]" />
      
      <div className="container mx-auto px-4 relative z-10" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-gold font-body text-sm font-semibold tracking-wider uppercase mb-4 block">📍 Visit Us</span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-cream mb-4">
            Get in Touch
          </h2>
          <p className="font-body text-cream text-lg opacity-85">Take the first step toward your success. Your seat is waiting.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-gold h-[350px] lg:h-auto"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56003.23!2d77.74!3d28.73!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cf5b7c0000001%3A0x1234567890abcdef!2sRamgarhi%2C%20Hapur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Janhitkari Library location on Google Maps"
            />
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-navy rounded-2xl p-8">
              <h3 className="font-display text-2xl font-bold text-cream mb-6">Janhitkari Library</h3>
              
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(45,80%,55%,0.1)] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-cream font-medium">Address</p>
                    <p className="font-body text-cream/75 text-sm">Ramgarhi, Hapur, Uttar Pradesh, India</p>
                    <a
                      href="https://share.google/zTAHnakvLx83Ms3PY"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-body text-gold text-sm mt-1 hover:underline"
                    >
                      Open in Maps <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(45,80%,55%,0.1)] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-cream font-medium">Phone</p>
                    <a href="tel:9917917437" className="font-body text-gold text-lg hover:underline">
                      9917917437
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(45,80%,55%,0.1)] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <p className="font-body text-cream font-medium">Email</p>
                    <a href="mailto:bijanderk3@gmail.com" className="font-body text-gold hover:underline">
                      bijanderk3@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-navy rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[hsl(140,60%,45%)] animate-pulse" />
                <span className="font-body text-[hsl(140,60%,70%)] font-medium">Open Now</span>
              </div>
              <p className="font-display text-2xl font-bold text-cream">6:00 AM – 8:00 PM</p>
              <p className="font-body text-cream/70 text-sm mt-1">Open Daily · 365 Days a Year</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
