import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Upload, User, LogOut, Info, Sparkles, Shield } from "lucide-react";
import collegeLogo from "@/assets/college-logo.jpg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;

    const handleScroll = () => {
      const currentScrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      const delta = currentScrollY - lastScrollY;

      // Always show when near the very top of the page
      if (currentScrollY <= 20) {
        setIsVisible(true);
      } else if (delta > 8 && currentScrollY > 40) {
        // Scrolling DOWN -> hide navbar
        setIsVisible(false);
      } else if (delta < -8) {
        // Scrolling UP -> reveal navbar
        setIsVisible(true);
      }

      lastScrollY = Math.max(0, currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { to: "/", label: "Home" },
    { to: "/tech-news", label: "Tech News", badge: "Daily" },
    { to: "/career-guidance", label: "Career Guide", isSpecial: true },
    { to: "/community", label: "Community" },
    ...(user ? [{ to: "/my-uploads", label: "My Uploads" }] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={collegeLogo}
            alt="College Logo"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="font-display text-xl font-bold">GetMaterial</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-orange relative flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {link.badge && (
                <span className="inline-flex items-center rounded-full bg-orange-500/15 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  {link.badge}
                </span>
              )}
              {link.isSpecial && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/20 text-primary px-1.5 py-0.2 text-[10px] font-semibold">
                  <Sparkles className="h-2.5 w-2.5" />
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Right Action Icons */}
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-hero-gradient text-primary-foreground hover:opacity-90"
                  >
                    <Upload className="mr-1.5 h-4 w-4" /> Upload
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/upload">Upload Notes</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/upload-exam-paper">Upload Exam Paper</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">
                      <User className="mr-2 h-4 w-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="text-primary font-medium flex items-center"
                      >
                        <Shield className="mr-2 h-4 w-4 text-primary" /> Admin
                        Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                to="/about"
                className={`nav-link-orange rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/about") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                <span className="flex items-center gap-1.5">
                  <Info className="h-4 w-4" /> About{" "}
                </span>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="bg-hero-gradient text-primary-foreground hover:opacity-90"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu (sign in button only when logged out; profile is in mobile bottom nav) */}
          {!user && (
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/login">
              <Button
                size="sm"
                className="bg-hero-gradient text-primary-foreground hover:opacity-90"
              >
                Sign in
              </Button>
            </Link>
        </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
