import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DEPARTMENTS,
  SEMESTERS,
  EXAM_TYPES,
  EXAM_YEARS,
} from "@/data/academicConstants";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const UploadExamPaperPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState<string>("Computer Science & Engineering");
  const [semester, setSemester] = useState<string>("1");
  const [examType, setExamType] = useState<string>("semester");
  const [examYear, setExamYear] = useState<string>("2025");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const getFileType = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || ""))
      return "image";
    return "doc";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for the exam paper.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter the subject name.");
      return;
    }
    if (!semester) {
      toast.error("Please select a semester.");
      return;
    }
    if (!examYear) {
      toast.error("Please select an exam year.");
      return;
    }
    if (!file) {
      toast.error("Please select a PDF, image, or document file to upload.");
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop() || "pdf";
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to storage bucket (try 'exam-papers', fallback to 'notes' if bucket missing)
      let bucketName = "exam-papers";
      let uploadResult = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadResult.error && uploadResult.error.message?.toLowerCase().includes("bucket")) {
        console.warn("'exam-papers' bucket failed, falling back to 'notes' bucket:", uploadResult.error);
        bucketName = "notes";
        uploadResult = await supabase.storage
          .from(bucketName)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });
      }

      if (uploadResult.error) {
        throw uploadResult.error;
      }

      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const semNum = Number(semester) || 1;
      const academicYear = Math.ceil(semNum / 2) || 1;

      // Insert record into exam_papers table
      const { error: insertError } = await supabase.from("exam_papers").insert({
        user_id: user.id,
        title: title.trim(),
        subject: subject.trim(),
        department,
        semester: semNum,
        year: academicYear,
        exam_type: examType,
        exam_year: Number(examYear) || new Date().getFullYear(),
        description: description.trim() || null,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: getFileType(file.name),
        status: "approved",
      });

      if (insertError) throw insertError;

      // Invalidate relevant queries so new paper appears everywhere immediately
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] });
      queryClient.invalidateQueries({ queryKey: ["my-exam-papers"] });

      toast.success("Exam paper uploaded successfully!");
      navigate("/my-uploads");
    } catch (err: unknown) {
      console.error("Exam paper upload error:", err);
      const error = err as any;
      toast.error(error?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8 px-4">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1 text-foreground">
          Upload Exam Paper
        </h1>
        <p className="text-sm text-muted-foreground">
          Share previous mid, semester, or supplementary question papers with juniors.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border bg-card p-5 sm:p-6 shadow-card"
      >
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title *
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-sm font-medium">
            Subject *
          </Label>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        

        {/* Academic Details: Semester, Exam Type, Exam Year */}
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Semester */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Semester *</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    Semester {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          

          
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description / Notes (optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* File Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Question Paper File *</Label>
          {file ? (
            <div className="flex items-center justify-between p-4 rounded-lg border bg-primary/5 border-primary/20">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate text-foreground">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)} • {getFileType(file.name).toUpperCase()}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => setFile(null)}
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-background p-8 transition-colors hover:border-primary/50">
              <div className="p-3 rounded-full bg-muted/60 text-muted-foreground">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-foreground">
                  Click to select Question Paper
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  Supported formats: PDF, PNG, JPG, JPEG, DOC, DOCX
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90 h-11 text-sm font-semibold"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading Exam Paper...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload Exam Paper
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadExamPaperPage;

