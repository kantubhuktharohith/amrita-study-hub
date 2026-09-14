import { useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Download,
  Calendar,
  User,
  Flag,
  Loader2,
  Maximize2,
  Minimize2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fetchNoteById } from "@/lib/noteQueries";
import RatingSection from "@/components/RatingSection";
import CommentsSection from "@/components/CommentsSection";
import { toast } from "sonner";

const NoteDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  const { data: note, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Note not found.</p>
        <Link to="/browse">
          <Button variant="ghost" className="mt-4">
            Back to Browse
          </Button>
        </Link>
      </div>
    );
  }

  // In-app direct download without opening another tab
  const handleDownload = async () => {
    try {
      toast.info("Downloading document...");

      const response = await fetch(note.file_url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = note.file_name || `${note.title}.${note.file_type || "pdf"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      await supabase
        .from("notes")
        .update({ downloads: note.downloads + 1 })
        .eq("id", note.id);

      toast.success("Downloaded successfully!");
    } catch {
      // Direct in-page fallback without target="_blank"
      const a = document.createElement("a");
      a.href = note.file_url;
      a.download = note.file_name || `${note.title}.${note.file_type || "pdf"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const isImage =
    note.file_type === "image" ||
    ["png", "jpg", "jpeg", "webp", "gif"].some((ext) =>
      note.file_url.toLowerCase().includes(`.${ext}`)
    );

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Top Document Header Bar - matching user screenshot */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-white shadow-sm">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-neutral-800 hover:text-white rounded-full h-9 w-9 shrink-0"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Center Title */}
        <div className="flex-1 text-center px-2 sm:px-4 min-w-0">
          <h1 className="text-sm sm:text-base font-semibold text-neutral-100 truncate">
            {note.title}
          </h1>
        </div>

        {/* Right Actions: Download, Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-neutral-800 rounded-md border border-neutral-700 h-9 w-9"
            onClick={handleDownload}
            title="Download in application"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-neutral-800 rounded-md h-9 w-9"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Document View (Page 1, Page 2 scrollable inside application) */}
      <div
        ref={readerRef}
        className="w-full bg-neutral-900 flex justify-center overflow-auto min-h-[72vh]"
      >
        {isImage ? (
          <div className="w-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
            <img
              src={note.file_url}
              alt={note.title}
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-lg"
            />
          </div>
        ) : (
          <iframe
            src={`${note.file_url}#toolbar=0&navpanes=0`}
            title={note.title}
            className="w-full h-[80vh] md:h-[86vh] border-0 bg-neutral-900"
          />
        )}
      </div>

      {/* Note Details, Ratings & Comments below document */}
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold">{note.title}</h2>
              <p className="text-sm text-muted-foreground">{note.subject}</p>
            </div>
            <Badge variant="secondary" className="uppercase text-xs">
              {note.file_type}
            </Badge>
          </div>

          {note.description && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              {note.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{note.department}</Badge>
            {note.semester && note.semester > 0 ? (
              <Badge variant="outline">Semester {note.semester}</Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary font-medium"
              >
                Skill / Tech
              </Badge>
            )}
            {note.year && note.year > 0 && (
              <Badge variant="outline">Year {note.year}</Badge>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {note.uploader_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />{" "}
                {new Date(note.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> {note.downloads} downloads
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-hero-gradient text-primary-foreground hover:opacity-90 gap-1.5"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" /> Download
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  toast.info("Report submitted. An admin will review it.")
                }
              >
                <Flag className="h-3.5 w-3.5 mr-1" /> Report
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <RatingSection contentType="note" contentId={note.id} />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <CommentsSection contentType="note" contentId={note.id} />
        </div>
      </div>
    </div>
  );
};

export default NoteDetailPage;
