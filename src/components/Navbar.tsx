import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Facilities", href: "#facilities" },
  { label: "Rules", href: "#rules" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "glass shadow-soft py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-3">
          <img src={logo} alt="Janhitkari Library Logo" className="h-10 w-10 object-contain" />
          <div>
            <span className={`font-display font-bold text-lg leading-tight block ${scrolled ? "text-navy" : "text-cream"}`}>
              Janhitkari Library
            </span>
            <span className={`text-xs font-body ${scrolled ? "text-gold-dark" : "text-gold-light"}`}>
              Empowering Knowledge
            </span>
          </div>
        </a>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium font-body transition-all duration-300 hover:bg-accent/20 ${
                  scrolled ? "text-navy hover:text-gold-dark" : "text-cream hover:text-gold-light"
                }`}
              >
                {item.label}
              </a>
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

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className={`md:hidden p-2 rounded-lg ${scrolled ? "text-navy" : "text-cream"}`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
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
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 rounded-lg text-navy font-medium font-body hover:bg-accent/30 transition-colors"
                  >
                    {item.label}
                  </a>
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
  );
};

export default Navbar;
