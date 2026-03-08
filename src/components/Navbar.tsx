import { Link, useLocation } from "react-router-dom";
import { BookOpen, Upload, Menu, X, User, LogOut, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero-gradient">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">GetMaterial</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link key={link.to} to={link.to} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive(link.to) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
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
              <Link to="/about">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <Info className="mr-1.5 h-4 w-4" /> About Me
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full"><User className="h-5 w-5" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="text-xs text-muted-foreground">{user.email}</DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={signOut}><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/signup"><Button size="sm" className="bg-hero-gradient text-primary-foreground hover:opacity-90">Sign up</Button></Link>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${isActive(link.to) ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground">Profile</Link>
                <Link to="/upload-exam-paper" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground">Upload Exam Paper</Link>
                <button onClick={() => { signOut(); setMobileOpen(false); }} className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground">Sign in</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="rounded-md px-3 py-2.5 text-sm font-medium text-primary">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
