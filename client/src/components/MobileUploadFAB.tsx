import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, FileText, BookOpen, FolderUp, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";

const MobileUploadFAB = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-20 right-4 z-50 md:hidden">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-col gap-2 min-w-[180px]"
            >
              <Link to="/upload" onClick={() => setOpen(false)}>
                <Button
                  size="sm"
                  className="w-full gap-2.5 bg-card/95 text-foreground shadow-lg border hover:bg-accent justify-start text-xs font-medium backdrop-blur-md h-10 px-3"
                >
                  <BookOpen className="h-4 w-4 text-primary shrink-0" />
                  <span>Upload Notes</span>
                </Button>
              </Link>

              <Link to="/upload-exam-paper" onClick={() => setOpen(false)}>
                <Button
                  size="sm"
                  className="w-full gap-2.5 bg-card/95 text-foreground shadow-lg border hover:bg-accent justify-start text-xs font-medium backdrop-blur-md h-10 px-3"
                >
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span>Upload Exam Papers</span>
                </Button>
              </Link>

              {user && (
                <Link to="/my-uploads" onClick={() => setOpen(false)}>
                  <Button
                    size="sm"
                    className="w-full gap-2.5 bg-card/95 text-foreground shadow-lg border hover:bg-accent justify-start text-xs font-medium backdrop-blur-md h-10 px-3"
                  >
                    <FolderUp className="h-4 w-4 text-primary shrink-0" />
                    <span>My Uploads</span>
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="icon"
          className="h-12 w-12 rounded-full bg-hero-gradient text-primary-foreground shadow-xl hover:opacity-90 active:scale-95 transition-transform flex items-center justify-center relative z-50"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close upload menu" : "Open upload options"}
        >
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {open ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </motion.div>
        </Button>
      </div>
    </>
  );
};

export default MobileUploadFAB;

