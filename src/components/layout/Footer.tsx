import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import asacLogo from "@/assets/asac-logo.jpg";

const sdgColors = [
  "bg-sdg-red",
  "bg-sdg-orange",
  "bg-sdg-gold",
  "bg-sdg-green",
  "bg-sdg-teal",
  "bg-sdg-blue",
  "bg-sdg-navy",
  "bg-sdg-purple",
  "bg-sdg-pink",
];

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      {/* SDG Color Bar */}
      <div className="flex h-2">
        {sdgColors.map((color, index) => (
          <div key={index} className={`flex-1 ${color}`} />
        ))}
      </div>

      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src={asacLogo}
                alt="AHSAC Logo"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <p className="font-display font-bold text-lg">AHSAC</p>
                <p className="text-sm text-background/60">SDG Advocacy Club</p>
              </div>
            </Link>
            <p className="text-background/70 text-sm leading-relaxed">
              Al-Hikmah University SDG Advocacy Club - Championing the 17 Sustainable Development Goals for a better tomorrow.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/sdgs", label: "The SDGs" },
                { href: "/register", label: "Join AHSAC" },
                { href: "/feedback", label: "Feedback" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-background/70 hover:text-background transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Al-Hikmah University, Ilorin, Kwara State, Nigeria</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Mail className="h-4 w-4 shrink-0" />
                <span>ahsac@alhikmah.edu.ng</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/70">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+234 XXX XXX XXXX</span>
              </li>
            </ul>
          </div>

          {/* SDGs */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Our Focus</h4>
            <p className="text-background/70 text-sm mb-4">
              We advocate for all 17 Sustainable Development Goals as defined by the United Nations.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 17 }, (_, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.2 }}
                  className="w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `hsl(${(i * 21) % 360}, 70%, 50%)`,
                    color: "white",
                  }}
                >
                  {i + 1}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-background/60 text-sm">
              © {new Date().getFullYear()} AHSAC - Al-Hikmah University. All rights reserved.
            </p>
            <p className="text-background/60 text-sm flex items-center gap-1">
              Made with <Heart className="h-4 w-4 text-sdg-red fill-sdg-red" /> for a sustainable future
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
