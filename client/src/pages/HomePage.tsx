import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight,BookOpen,Upload,Search,Compass,FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchNotesWithProfiles } from "@/lib/noteQueries";
import { CAREER_PATHS } from "@/data/careerData";

const features = [
  {
    icon: Upload,
    title: "Upload Notes",
    desc: "Share your notes with juniors. PDFs, images, or documents.",
  },
  {
    icon: Search,
    title: "Find Quickly",
    desc: "Search by subject, semester, department, or keyword.",
  },
  {
    icon: Compass,
    title: "Career Guidance",
    desc: "4-Year milestones, skills, project ideas & placement roadmaps for all branches.",
  },
  {
    icon: BookOpen,
    title: "Quality First",
    desc: "Admin-reviewed uploads ensure only good content.",
  },
];



const HomePage = () => {
  const { data: topNotes = [] } = useQuery({
    queryKey: ["top-notes"],
    queryFn: () =>
      fetchNotesWithProfiles({
        status: "approved",
        orderBy: "downloads",
        limit: 4,
      }),
  });

  return (
    <div>
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
              A collaborative notes-sharing platform & career guidance hub.
              Seniors upload. Juniors access. Everyone succeeds.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to="/browse">
                <Button
                  size="lg"
                  className="bg-hero-gradient text-primary-foreground hover:opacity-90"
                >
                  Browse Notes <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/exam-papers">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/5"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  Exam Papers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="rounded-lg border bg-card p-5 shadow-card hover:border-primary/40 transition-colors"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-1 font-display text-sm font-semibold">
                  {f.title}
                </h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
