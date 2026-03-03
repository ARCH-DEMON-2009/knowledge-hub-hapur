import { Heart, MapPin, Phone, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-navy-dark py-16 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold),0.3)] to-transparent" />
      
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="Janhitkari Library Logo" className="w-10 h-10 object-contain" />
              <div>
                <span className="font-display font-bold text-lg text-cream block">Janhitkari Library</span>
                <span className="font-body text-xs text-gold-light">Empowering Knowledge for Everyone</span>
              </div>
            </div>
            <p className="font-body text-cream/50 text-sm leading-relaxed">
              Founded by Bijander Kumar. A completely free and disciplined study library for every student in Hapur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "About", "Facilities", "Rules", "FAQ", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="font-body text-cream/50 text-sm hover:text-gold transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-cream font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0" />
                <span className="font-body text-cream/50 text-sm">Ramgarhi, Hapur, UP, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:9917917437" className="font-body text-cream/50 text-sm hover:text-gold transition-colors">9917917437</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:bijanderk3@gmail.com" className="font-body text-cream/50 text-sm hover:text-gold transition-colors">bijanderk3@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[hsl(var(--gold),0.1)] pt-8 text-center">
          <p className="font-body text-cream/40 text-sm">
            © {new Date().getFullYear()} Janhitkari Library. All rights reserved. Made with{" "}
            <Heart className="w-3 h-3 inline text-[hsl(0,80%,60%)]" /> for education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
