import collegeLogo from "@/assets/college-logo.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-hero-gradient">
              <BookOpen className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold">GetMaterial</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Built for Amrita Sai Institute of Science and Technology
          </p>

          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link to="/browse" className="hover:text-foreground transition-colors">Browse</Link>
            <Link to="/upload" className="hover:text-foreground transition-colors">Upload</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
