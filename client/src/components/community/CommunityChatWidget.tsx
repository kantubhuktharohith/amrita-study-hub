import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Sparkles } from "lucide-react";

export const CommunityChatWidget: React.FC = () => {
  const location = useLocation();

  // Hide the floating button when already on the community page
  if (
    location.pathname.startsWith("/community") ||
    location.pathname === "/discuss"
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-36 md:bottom-6 right-4 md:right-6 z-50 select-none">
      <Link to="/community" aria-label="Open Community Page">
        <motion.div
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          className="group relative flex items-center gap-2.5 rounded-full bg-hero-gradient p-3.5 md:px-4 md:py-3 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all border border-white/20 cursor-pointer"
        >
          {/* Pulsing online badge indicator */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-background"></span>
          </span>

          <Users className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          <span className="hidden md:inline-block font-display font-semibold text-xs tracking-wide">
            Ask Doubt & Community
          </span>
          <span className="hidden md:inline-flex items-center rounded-full bg-white/20 px-1.5 py-0.5 text-[9px] font-bold">
            r/all
          </span>
        </motion.div>
      </Link>
    </div>
  );
};
