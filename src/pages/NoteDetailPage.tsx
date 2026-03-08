import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, Calendar, User, FileText, Flag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fetchNoteById } from "@/lib/noteQueries";
import RatingSection from "@/components/RatingSection";
import CommentsSection from "@/components/CommentsSection";
import { toast } from "sonner";

const NoteDetailPage = () => {
  const { id } = useParams();

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="container py-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!note) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Note not found.</p>
        <Link to="/browse"><Button variant="ghost" className="mt-4">Back to Browse</Button></Link>
      </div>
    );
  }

  const handleDownload = async () => {
    await supabase.from("notes").update({ downloads: note.downloads + 1 }).eq("id", note.id);
    window.open(note.file_url, "_blank");
    toast.success("Download started!");
  };

  return (
    <div className="container max-w-3xl py-8">
      <Link to="/browse" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Browse
      </Link>
      <div className="rounded-lg border bg-card p-6 shadow-card">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><FileText className="h-6 w-6 text-primary" /></div>
          <Badge variant="secondary">{note.file_type.toUpperCase()}</Badge>
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">{note.title}</h1>
        <p className="text-base text-muted-foreground mb-4">{note.subject}</p>
        {note.description && <p className="mb-6 text-sm text-foreground/80 leading-relaxed">{note.description}</p>}
        <div className="mb-6 flex flex-wrap gap-2">
          <Badge variant="outline">{note.department}</Badge>
          <Badge variant="outline">Semester {note.semester}</Badge>
          <Badge variant="outline">Year {note.year}</Badge>
        </div>
        <div className="mb-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {note.uploader_name}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(note.created_at).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Download className="h-4 w-4" /> {note.downloads} downloads</span>
        </div>
        <div className="flex gap-3">
          <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="outline" onClick={() => toast.info("Report submitted. An admin will review it.")}>
            <Flag className="mr-2 h-4 w-4" /> Report
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
