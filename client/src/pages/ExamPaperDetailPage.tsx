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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { fetchExamPaperById } from "@/lib/noteQueries";
import { EXAM_TYPES } from "@/data/academicConstants";
import RatingSection from "@/components/RatingSection";
import CommentsSection from "@/components/CommentsSection";
import PdfViewer from "@/components/PdfViewer";
import { toast } from "sonner";

const ExamPaperDetailPage = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const readerRef = useRef<HTMLDivElement>(null);

  const { data: paper, isLoading } = useQuery({
    queryKey: ["exam-paper", id],
    queryFn: () => fetchExamPaperById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">Exam paper not found.</p>
        <Link to="/exam-papers">
          <Button variant="ghost" className="mt-4">
            Back to Exam Papers
          </Button>
        </Link>
      </div>
    );
  }

  const examLabel =
    EXAM_TYPES.find((t) => t.value === paper.exam_type)?.label ||
    paper.exam_type;

  // In-app direct download without opening another tab
  const handleDownload = async () => {
    try {
      toast.info("Downloading exam paper...");

      const response = await fetch(paper.file_url);
      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = paper.file_name || `${paper.title}.${paper.file_type || "pdf"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);

      await supabase
        .from("exam_papers")
        .update({ downloads: paper.downloads + 1 })
        .eq("id", paper.id);

      toast.success("Downloaded successfully!");
    } catch {
      // Direct in-page fallback without target="_blank"
      const a = document.createElement("a");
      a.href = paper.file_url;
      a.download = paper.file_name || `${paper.title}.${paper.file_type || "pdf"}`;
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
    paper.file_type === "image" ||
    ["png", "jpg", "jpeg", "webp", "gif"].some((ext) =>
      paper.file_url.toLowerCase().includes(`.${ext}`)
    );

  const isOfficeDoc = ["doc", "docx", "ppt", "pptx", "xls", "xlsx"].some((ext) =>
    paper.file_url.toLowerCase().includes(`.${ext}`)
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
            {paper.title}
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

      {/* Main Document View (In-app viewer without triggering direct download) */}
      <div
        ref={readerRef}
        className="w-full bg-neutral-900 flex justify-center overflow-auto min-h-[72vh]"
      >
        {isImage ? (
          <div className="w-full flex items-center justify-center p-2 sm:p-4 overflow-auto">
            <img
              src={paper.file_url}
              alt={paper.title}
              className="max-w-full max-h-[85vh] object-contain rounded-md shadow-lg"
            />
          </div>
        ) : isOfficeDoc ? (
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(paper.file_url)}&embedded=true`}
            title={paper.title}
            className="w-full h-[80vh] md:h-[86vh] border-0 bg-neutral-900"
          />
        ) : (
          <PdfViewer
            url={paper.file_url}
            title={paper.title}
            className="min-h-[72vh]"
          />
        )}
      </div>

      {/* Exam Paper Details, Ratings & Comments below document */}
      <div className="container max-w-4xl py-6 space-y-6">
        <div className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xl font-bold">{paper.title}</h2>
              <p className="text-sm text-muted-foreground">{paper.subject}</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              {examLabel}
            </Badge>
          </div>

          {paper.description && (
            <p className="text-sm text-foreground/80 leading-relaxed mb-4">
              {paper.description}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="outline">{paper.department}</Badge>
            <Badge variant="outline">Semester {paper.semester}</Badge>
            <Badge variant="outline">Year {paper.year}</Badge>
            <Badge variant="outline">{paper.exam_year}</Badge>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> {paper.uploader_name}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />{" "}
                {new Date(paper.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1.5">
                <Download className="h-3.5 w-3.5" /> {paper.downloads} downloads
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
                onClick={() => toast.info("Report submitted.")}
              >
                <Flag className="h-3.5 w-3.5 mr-1" /> Report
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <RatingSection contentType="exam_paper" contentId={paper.id} />
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-card">
          <CommentsSection contentType="exam_paper" contentId={paper.id} />
        </div>
      </div>
    </div>
  );
};

export default ExamPaperDetailPage;