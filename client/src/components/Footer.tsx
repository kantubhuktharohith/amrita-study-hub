import collegeLogo from "@/assets/college-logo.jpg";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <img
              src={collegeLogo}
              alt="College Logo"
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="font-display text-lg font-bold">GetMaterial</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Built for Amrita Sai Institute of Science and Technology
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link
              to="/browse"
              className="hover:text-foreground transition-colors"
            >
              Browse Notes
            </Link>
            <Link
              to="/exam-papers"
              className="hover:text-foreground transition-colors"
            >
              Exam Papers
            </Link>
            <Link
              to="/career-guidance"
              className="hover:text-foreground text-primary font-medium transition-colors"
            >
              Career Guide
            </Link>
            <Link
              to="/upload"
              className="hover:text-foreground transition-colors"
            >
              Upload
            </Link>
            <Link
              to="/about"
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
