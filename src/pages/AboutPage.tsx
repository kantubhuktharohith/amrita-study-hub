import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, Mail, Globe, Code, GraduationCap, MapPin } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="container max-w-3xl py-10">
      <h1 className="font-display text-3xl font-bold mb-8">About the Developer</h1>

      <Card className="shadow-card overflow-hidden">
        <div className="h-32 bg-hero-gradient" />
        <CardContent className="relative pt-0 -mt-12 pb-8">
          <Avatar className="h-24 w-24 border-4 border-card shadow-card-hover">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-3xl font-bold text-primary">JD</AvatarFallback>
          </Avatar>

          <div className="mt-4 space-y-1">
            <h2 className="font-display text-2xl font-bold text-secondary-foreground bg-secondary">​Rohith Kantubhuktha </h2>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4" /> B.Tech, Computer Science & Engineering (Big Data Analytics)
            </p>
            <p className="text-muted-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4" /> Amrita Sai Institute of Science and Technology
            </p>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-foreground/80">
            Passionate full-stack developer and student who built GetMaterial to help fellow students
            easily share and access study notes, exam papers, and learning resources. I believe in
            making education accessible and collaborative.
          </p>

          <div className="mt-6">
            <h3 className="font-display text-sm font-semibold mb-3 flex items-center gap-1.5">
              <Code className="h-4 w-4 text-primary" /> Skills & Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {["React", "Tailwind CSS", "Node.js", "Python", "Git", "REST APIs"].map((skill) =>
              <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-display text-sm font-semibold mb-3">Connect with me</h3>
            <div className="flex flex-wrap gap-3">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors" href="https://linkedin.com/in/rohith-kantubhuktha-a3830b365">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              <a href="mailto:your@email.com" className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                <Mail className="h-4 w-4" /> Email
              </a>
              <a href="https://yourwebsite.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                <Globe className="h-4 w-4" /> Portfolio
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>);

};

export default AboutPage;