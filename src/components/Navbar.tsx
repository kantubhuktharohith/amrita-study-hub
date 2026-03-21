import { Link, useLocation } from "react-router-dom";
import { Upload, User, LogOut, Info, Sun, Moon, Shield } from "lucide-react";
import collegeLogo from "@/assets/college-logo.jpg";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const { isAdmin } = useIsAdmin();
  const links = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Notes" },
    { to: "/exam-papers", label: "Exam Papers" },
    ...(user ? [
      { to: "/my-uploads", label: "My Uploads" },
    ] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={collegeLogo} alt="College Logo" className="h-9 w-9 rounded-lg object-cover" />
          <span className="font-display text-xl font-bold">GetMaterial</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className={`nav-link-orange rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(link.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-primary" />}
          </Button>
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                    <Upload className="mr-1.5 h-4 w-4" /> Upload
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild><Link to="/upload">Upload Notes</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/upload-exam-paper">Upload Exam Paper</Link></DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                   <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
                   {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Admin Panel</Link></DropdownMenuItem>}
                  <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link to="/about" className={`nav-link-orange rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive("/about") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                <span className="flex items-center gap-1.5"><Info className="h-4 w-4" /> About Me</span>
              </Link>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/signup"><Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">Sign up</Button></Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggle} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5 text-primary" />}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full"><User className="h-5 w-5" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/upload">Upload Notes</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/upload-exam-paper">Upload Exam Paper</Link></DropdownMenuItem>
                 <DropdownMenuItem asChild><Link to="/my-uploads">My Uploads</Link></DropdownMenuItem>
                 {isAdmin && <DropdownMenuItem asChild><Link to="/admin"><Shield className="mr-2 h-4 w-4" /> Admin Panel</Link></DropdownMenuItem>}
                 <DropdownMenuItem asChild><Link to="/about"><Info className="mr-2 h-4 w-4" /> About Me</Link></DropdownMenuItem>
                 <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/login"><Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">Sign in</Button></Link>
          )}
        </div>
      </div>

    </nav>
  );
};

export default Navbar;
