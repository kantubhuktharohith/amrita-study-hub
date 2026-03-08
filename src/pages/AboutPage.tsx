import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Globe, Code, GraduationCap, MapPin, Sparkles, Heart, Rocket } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

const skills = [
  { name: "React", color: "bg-primary/15 text-primary border-primary/20" },
  { name: "Tailwind CSS", color: "bg-accent/15 text-accent border-accent/20" },
  { name: "Node.js", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
  { name: "Python", color: "bg-yellow-500/15 text-yellow-600 border-yellow-500/20" },
  { name: "Git", color: "bg-orange-500/15 text-orange-600 border-orange-500/20" },
  { name: "REST APIs", color: "bg-violet-500/15 text-violet-600 border-violet-500/20" },
];

const socials = [
  { href: "https://github.com", icon: Github, label: "GitHub", hoverColor: "hover:bg-foreground hover:text-background" },
  { href: "https://linkedin.com/in/rohith-kantubhuktha-a3830b365", icon: Linkedin, label: "LinkedIn", hoverColor: "hover:bg-accent hover:text-accent-foreground" },
  { href: "mailto:your@email.com", icon: Mail, label: "Email", hoverColor: "hover:bg-primary hover:text-primary-foreground" },
  { href: "https://yourwebsite.com", icon: Globe, label: "Portfolio", hoverColor: "hover:bg-emerald-500 hover:text-white" },
];

const AboutPage = () => {
  return (
    <div className="container max-w-3xl py-10 px-4">
      <motion.div initial="hidden" animate="visible" className="space-y-8">

        {/* Header */}
        <motion.div variants={fadeUp} custom={0} className="text-center space-y-2">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="inline-block"
          >
            <Sparkles className="h-8 w-8 text-primary mx-auto" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold tracking-tight">About the Developer</h1>
          <p className="text-muted-foreground text-sm">The person behind GetMaterial</p>
        </motion.div>

        {/* Main Card */}
        <motion.div variants={fadeUp} custom={1}>
          <Card className="shadow-card overflow-hidden border-0 ring-1 ring-border/50">
            {/* Gradient Banner */}
            <div className="h-36 relative overflow-hidden" style={{ background: "var(--hero-gradient)" }}>
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--primary-foreground) / 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--primary-foreground) / 0.2) 0%, transparent 50%)",
                }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              />
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent" />
            </div>

            <CardContent className="relative -mt-16 pb-10 px-8">
              {/* Avatar */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Avatar className="h-28 w-28 border-4 border-card shadow-lg ring-2 ring-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-3xl font-bold text-primary-foreground">
                    RK
                  </AvatarFallback>
                </Avatar>
              </motion.div>

              {/* Name & Info */}
              <motion.div variants={fadeUp} custom={2} className="mt-5 space-y-1.5">
                <h2 className="font-display text-2xl font-bold text-foreground">
                  Rohith Kantubhuktha
                </h2>
                <div className="flex flex-col gap-1">
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary shrink-0" />
                    B.Tech, Computer Science & Engineering (Big Data Analytics)
                  </p>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary shrink-0" />
                    Amrita Sai Institute of Science and Technology
                  </p>
                </div>
              </motion.div>

              {/* Bio */}
              <motion.div variants={fadeUp} custom={3} className="mt-6">
                <div className="rounded-xl bg-muted/50 border border-border/50 p-5">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm leading-relaxed text-foreground/80">
                      Passionate full-stack developer and student who built <strong className="text-primary">GetMaterial</strong> to help fellow students
                      easily share and access study notes, exam papers, and learning resources. I believe in
                      making education accessible and collaborative.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Skills */}
              <motion.div variants={fadeUp} custom={4} className="mt-8">
                <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, i) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.3 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <Badge variant="outline" className={`text-xs px-3 py-1 font-medium ${skill.color}`}>
                        {skill.name}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Connect */}
              <motion.div variants={fadeUp} custom={5} className="mt-8">
                <h3 className="font-display text-sm font-semibold mb-4 flex items-center gap-2">
                  <Rocket className="h-4 w-4 text-primary" />
                  Connect with me
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {socials.map((social, i) => (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      target={social.href.startsWith("mailto") ? undefined : "_blank"}
                      rel="noopener noreferrer"
                      className={`flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card p-4 text-muted-foreground transition-all duration-300 ${social.hoverColor} hover:border-transparent hover:shadow-md`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <social.icon className="h-5 w-5" />
                      <span className="text-xs font-medium">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer tagline */}
        <motion.p
          variants={fadeUp}
          custom={6}
          className="text-center text-xs text-muted-foreground"
        >
          Built with <span className="text-primary">♥</span> for students, by a student
        </motion.p>

      </motion.div>
    </div>
  );
};

export default AboutPage;
