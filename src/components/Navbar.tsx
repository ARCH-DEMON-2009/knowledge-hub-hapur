import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Facilities", href: "/facilities" },
  
  { label: "Rules", href: "/rules" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [announcement, setAnnouncement] = useState<{ title: string; content: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Fetch latest announcement
    supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setAnnouncement(data);
      });

    const onScroll = () => setScrolled(window.scrollY > 50);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = location.pathname === "/";
  const showTransparent = isHome && !scrolled;

  return (
    <div className="contents">
      {announcement && (
        <div className="bg-gold text-navy py-2 text-center text-sm font-medium z-[60] relative">
          <strong>{announcement.title}:</strong> {announcement.content}
        </div>
      )}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showTransparent ? (announcement ? "mt-9 bg-transparent py-4" : "bg-transparent py-4") : "bg-white/98 backdrop-blur-xl shadow-lg py-2 border-b border-gold/10"
        }`}
      >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Janhitkari Library Logo" className="h-10 w-10 object-contain" />
          <div>
            <span className={`font-display font-bold text-lg leading-tight block ${showTransparent ? "text-cream" : "text-navy drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"}`}>
              Janhitkari Library
            </span>
            <span className={`text-xs font-body ${showTransparent ? "text-gold-light" : "text-gold-dark"}`}>
              Empowering Knowledge
            </span>
          </div>
        </Link>

        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                to={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-300 hover:bg-accent/20 ${
                  location.pathname === item.href
                    ? showTransparent ? "text-gold-light" : "text-gold-dark font-bold bg-gold/5"
                    : showTransparent ? "text-cream hover:text-gold-light" : "text-navy hover:text-gold-dark font-medium"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <a
              href="tel:9917917437"
              className="ml-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gold text-navy font-semibold text-sm font-body shadow-gold transition-all duration-300 hover:brightness-110"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </a>
          </li>
        </ul>

        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg ${showTransparent ? "text-cream" : "text-navy"}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden glass shadow-soft mx-4 mt-2 rounded-xl overflow-hidden"
          >
            <ul className="p-4 space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-medium font-body hover:bg-accent/30 transition-colors ${
                      location.pathname === item.href ? "text-gold-dark bg-accent/20" : "text-navy"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="tel:9917917437"
                  className="flex items-center justify-center gap-2 mt-2 px-5 py-3 rounded-lg bg-gold text-navy font-semibold font-body shadow-gold"
                >
                  <Phone className="w-4 h-4" />
                  Call Now – 9917917437
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
