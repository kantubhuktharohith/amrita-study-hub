import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, BookOpen, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

const MobileUploadFAB = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 md:hidden">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="mb-3 flex flex-col gap-2"
          >
            <Link to="/upload" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full gap-2 bg-card text-foreground shadow-lg border hover:bg-accent">
                <BookOpen className="h-4 w-4 text-primary" /> Upload Notes
              </Button>
            </Link>
            <Link to="/upload-exam-paper" onClick={() => setOpen(false)}>
              <Button size="sm" className="w-full gap-2 bg-card text-foreground shadow-lg border hover:bg-accent">
                <FileText className="h-4 w-4 text-primary" /> Upload Paper
              </Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-hero-gradient text-primary-foreground shadow-lg hover:opacity-90"
        onClick={() => setOpen(!open)}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
        </motion.div>
      </Button>
    </div>
  );
};

export default MobileUploadFAB;
