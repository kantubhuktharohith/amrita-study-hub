import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Upload, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import NoteCard from "@/components/NoteCard";
import { supabase } from "@/integrations/supabase/client";

const features = [
  { icon: Upload, title: "Upload Notes", desc: "Share your notes with juniors. PDFs, images, or documents." },
  { icon: Search, title: "Find Quickly", desc: "Search by subject, semester, department, or keyword." },
  { icon: Users, title: "Collaborative", desc: "Seniors help juniors. A shared academic culture." },
  { icon: BookOpen, title: "Quality First", desc: "Admin-reviewed uploads ensure only good content." },
];

const HomePage = () => {
  const { data: topNotes = [] } = useQuery({
    queryKey: ["top-notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*, profiles(full_name)")
        .eq("status", "approved")
        .order("downloads", { ascending: false })
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-hero-gradient opacity-5" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-primary" />
              Amrita Sai Institute of Science & Technology
            </div>

            <h1 className="mb-4 font-display text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Get the <span className="text-gradient">material</span> you need
            </h1>

            <p className="mb-8 text-lg text-muted-foreground">
              A collaborative notes-sharing platform. Seniors upload. Juniors access. Everyone benefits.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/browse">
                <Button size="lg" className="bg-hero-gradient text-primary-foreground hover:opacity-90">
                  Browse Notes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline">Upload Notes</Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i, duration: 0.4 }} className="rounded-lg border bg-card p-5 shadow-card">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-display text-sm font-semibold">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Notes */}
      {topNotes.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">Popular Notes</h2>
                <p className="text-sm text-muted-foreground">Most downloaded by students</p>
              </div>
              <Link to="/browse">
                <Button variant="ghost" size="sm">View all <ArrowRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {topNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
