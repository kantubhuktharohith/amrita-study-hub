import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, FileText, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/browse", icon: BookOpen, label: "Notes" },
  { to: "/exam-papers", icon: FileText, label: "Papers" },
  { to: "/profile", icon: User, label: "Profile" },
];

const MobileBottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  // Get the profile link - redirect to login if not authenticated
  const getProfileLink = () => (user ? "/profile" : "/login");

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card/95 backdrop-blur-md md:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const to = tab.to === "/profile" ? getProfileLink() : tab.to;
          const active = isActive(tab.to === "/profile" ? (user ? "/profile" : "/login") : tab.to);
          return (
            <Link
              key={tab.label}
              to={to}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[10px] font-medium transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className={`h-5 w-5 ${active ? "text-primary" : ""}`} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
