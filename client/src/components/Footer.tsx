import collegeLogo from "@/assets/college-logo.jpg";
import { Link } from "react-router-dom";
import { Github,Linkedin,Instagram,Twitter,Mail,Info } from "lucide-react";

const DiscordIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className={className}
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  hoverClass: string;
}

const socialLinks: SocialLink[] = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/rohith-kantubhuktha-a3830b365",
    icon: Linkedin,
    hoverClass: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
  },
  {
    name: "GitHub",
    href: "https://github.com/kantubhuktharohith",
    icon: Github,
    hoverClass:
      "hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 hover:border-neutral-900 dark:hover:border-white",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/rohith__kantubhuktha_?stkn=MXEzaHY0NTk3am5peg==",
    icon: Instagram,
    hoverClass:
      "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white hover:border-transparent",
  },
  {
    name: "X (Twitter)",
    href: "https://x.com/Rohith_05_19",
    icon: Twitter,
    hoverClass:
      "hover:bg-neutral-900 hover:text-white dark:hover:bg-neutral-100 dark:hover:text-black hover:border-neutral-900 dark:hover:border-neutral-100",
  },
  {
    name: "Discord",
    href: "https://discord.com/users/rohith07956",
    icon: DiscordIcon,
    hoverClass: "hover:bg-[#7289DA] hover:text-white hover:border-[#7289DA]",
  },
  {
    name: "Email",
    href: "kantubhuktharohith@gmail.com",
    icon: Mail,
    hoverClass:
      "hover:bg-primary hover:text-primary-foreground hover:border-primary",
  },
];



const Footer = () => {
  return (
    <footer className="border-t bg-card/80 backdrop-blur-sm mt-auto pb-20 md:pb-6">
      <div className="container py-8 md:py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center">
          {/* Brand and Description */}
          <div className="space-y-3 md:col-span-4 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <img
                src={collegeLogo}
                alt="College Logo"
                className="h-9 w-9 rounded-lg object-cover ring-1 ring-border shadow-sm group-hover:scale-105 transition-transform"
              />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Get<span className="text-primary">Material</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
              Built for Amrita Sai Institute of Science and Technology. Your
              premier academic hub for notes, previous papers, and career
              resources.
            </p>
          </div>

          {/* Navigation Links including prominent About Us */}
          <div className="md:col-span-5 flex flex-col items-center md:items-center space-y-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              About the Developer
            </span>
            <div className="flex flex-wrap justify-center gap-2 text-xs">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold transition-all border border-primary/30 shadow-xs active:scale-95"
              >
                <Info className="h-3.5 w-3.5" />
                About Us
              </Link>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="md:col-span-3 flex flex-col items-center md:items-end gap-2.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
              Connect With Us
            </span>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    title={social.name}
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-muted/40 text-muted-foreground shadow-xs transition-all duration-200 hover:scale-110 active:scale-95 ${social.hoverClass}`}
                  >
                    <Icon className="h-4 w-4 transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom divider and copyright */}
        <div className="mt-8 border-t border-border/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>@ {new Date().getFullYear()} GetMaterial · All rights reserved Tripura Veni Students.</p>
          <p className="flex items-center gap-1">
            Built For ASIST Students.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
