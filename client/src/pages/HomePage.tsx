import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Upload,
  Search,
  Users,
  Compass,
  Sparkles,
  TrendingUp,
  GraduationCap,
  Award,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NoteCard from "@/components/NoteCard";
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

const featuredCareers = CAREER_PATHS.slice(0, 4);

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
              <Link to="/career-guidance">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-primary/30 hover:bg-primary/5"
                >
                  <Compass className="h-4 w-4 text-primary" /> Career Roadmaps
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

      {/* Featured Career Guidance Section */}
      <section className="py-16 bg-card border-y">
        <div className="container">
          <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-2">
                <Sparkles className="h-3.5 w-3.5" /> For All Engineering
                Branches
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold">
                Career Guidance & Roadmaps
              </h2>
              <p className="text-sm text-muted-foreground">
                In-demand roles, 4-year milestones, high-value certifications &
                interview prep for every department.
              </p>
            </div>
            <Link to="/career-guidance">
              <Button className="bg-hero-gradient text-white text-xs sm:text-sm">
                Explore All Courses Guidance{" "}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredCareers.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i, duration: 0.4 }}
                className="group flex flex-col justify-between rounded-xl border bg-background p-5 shadow-card hover:border-primary/50 transition-all"
              >
                <div>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-primary/20 bg-primary/5 text-primary mb-2"
                  >
                    {c.department}
                  </Badge>
                  <h3 className="font-display font-bold text-base text-foreground group-hover:text-primary transition-colors mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
                    {c.summary}
                  </p>
                  <div className="text-xs font-medium text-foreground bg-muted/40 p-2 rounded-md mb-3 flex items-center justify-between">
                    <span className="text-muted-foreground">Avg Package:</span>
                    <span className="font-bold text-primary">
                      {c.avgSalary}
                    </span>
                  </div>
                </div>

                <Link to="/career-guidance">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-primary justify-between p-0 hover:bg-transparent"
                  >
                    View Full Roadmap{" "}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Banner inside Career Section */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Compass className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-sm sm:text-base text-foreground">
                  Unsure which career track fits your strengths?
                </h4>
                <p className="text-xs text-muted-foreground">
                  Take our interactive 3-step Career Path Finder Quiz tailored
                  for CSE, ECE, EEE, Mech, and Civil students.
                </p>
              </div>
            </div>
            <Link to="/career-guidance">
              <Button size="sm" variant="outline" className="text-xs shrink-0">
                Take Career Quiz <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {topNotes.length > 0 && (
        <section className="py-16 bg-secondary/30">
          <div className="container">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold">
                  Popular Notes
                </h2>
                <p className="text-sm text-muted-foreground">
                  Most downloaded by students
                </p>
              </div>
              <Link to="/browse">
                <Button variant="ghost" size="sm">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
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
