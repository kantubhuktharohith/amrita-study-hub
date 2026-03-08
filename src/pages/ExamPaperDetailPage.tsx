import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Calendar, User, FileText, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fetchExamPaperById } from "@/lib/noteQueries";
import { EXAM_TYPES } from "@/data/mockData";
import RatingSection from "@/components/RatingSection";
import CommentsSection from "@/components/CommentsSection";
import { toast } from "sonner";

const ExamPaperDetailPage = () => {
  const { id } = useParams();

  const { data: paper, isLoading } = useQuery({
    queryKey: ["exam-paper", id],
    queryFn: () => fetchExamPaperById(id!),
    enabled: !!id,
  });

  if (isLoading) return <div className="container py-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!paper) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Exam paper not found.</p>
        <Link to="/exam-papers"><Button variant="ghost" className="mt-4">Back to Exam Papers</Button></Link>
      </div>
    );
  }

  const examLabel = EXAM_TYPES.find((t) => t.value === paper.exam_type)?.label || paper.exam_type;

  const handleDownload = async () => {
    await supabase.from("exam_papers").update({ downloads: paper.downloads + 1 }).eq("id", paper.id);
    window.open(paper.file_url, "_blank");
    toast.success("Download started!");
  };

  return (
    <div className="container max-w-3xl py-8">
      <Link to="/exam-papers" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Exam Papers
      </Link>
      <div className="rounded-lg border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10"><FileText className="h-6 w-6 text-accent" /></div>
          <Badge variant="secondary">{examLabel}</Badge>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">{paper.title}</h1>
        <p className="text-base text-muted-foreground mb-4">{paper.subject}</p>
        {paper.description && <p className="mb-6 text-sm text-foreground/80 leading-relaxed">{paper.description}</p>}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="outline">{paper.department}</Badge>
          <Badge variant="outline">Semester {paper.semester}</Badge>
          <Badge variant="outline">Year {paper.year}</Badge>
          <Badge variant="outline">{paper.exam_year}</Badge>
        </div>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {paper.uploader_name}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(paper.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Download className="h-4 w-4" /> {paper.downloads} downloads</span>
        </div>
        <div className="flex gap-3">
          <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="outline" onClick={() => toast.info("Report submitted.")}>
            <Flag className="mr-2 h-4 w-4" /> Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExamPaperDetailPage;
