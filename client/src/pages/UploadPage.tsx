import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2, Code2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS, SEMESTERS } from "@/data/academicConstants";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";



const UploadPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  const getFileType = (fileName: string): string => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return "pdf";
    if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) return "image";
    return "doc";
  };

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !file) {
      toast.error("Please enter Title, Subject/Language, and select a file.");
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("notes")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("notes")
        .getPublicUrl(filePath);

      // Default to "Programming & Tech" if department is left blank
      const finalDepartment = department.trim() || "Programming & Tech";
      // Default to 0 (Skill / Non-Syllabus) if semester is left blank or set to 0
      const finalSemester = semester && semester !== "all" ? Number(semester) : 0;

      // Insert note record
      const { error: insertError } = await supabase.from("notes").insert({
        user_id: user.id,
        title: title.trim(),
        subject: subject.trim(),
        department: finalDepartment,
        semester: finalSemester,
        description: description.trim() || null,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: getFileType(file.name),
      });

      if (insertError) throw insertError;

      toast.success("Notes uploaded successfully!");
      navigate("/my-uploads");
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Upload Notes & Study Materials</h1>
        <p className="text-sm text-muted-foreground">
          Share college syllabus notes, programming language guides (Golang, Rust, Ruby, etc.), or non-syllabus skills.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 shadow-card">
      

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Golang Concurrency & Microservices Guide"
            required
          />
        </div>

        {/* Subject / Language */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="subject">Subject / Programming Language *</Label>
            <span className="text-xs text-muted-foreground">e.g. Golang, Rust, Ruby, DSA</span>
          </div>
          <Input
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Golang, Rust, Ruby, Web Dev, Compiler Design"
            required
          />
        </div>

        {/* Semester - Optional for Non-syllabus/programming */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Semester</Label>
            <span className="text-[11px] text-muted-foreground">Optional</span>
          </div>
          <Select value={semester} onValueChange={setSemester}>
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Optional (Non-Syllabus)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Skill / Non-Syllabus (None)</SelectItem>
              {SEMESTERS.map((s) => (
                <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief overview of the material, covered topics, or installation guide..."
            rows={3}
          />
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label>File *</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-background p-8 transition-colors hover:border-primary/50">
            {file ? (
              <div className="flex items-center gap-2 text-sm font-medium text-primary">
                <FileText className="h-5 w-5 text-primary" />
                <span>{file.name}</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Click to upload PDF, image, or document</span>
                <span className="text-xs text-muted-foreground/70">Supported formats: PDF, DOC, DOCX, PNG, JPG</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90 font-medium py-2.5" disabled={uploading}>
          {uploading ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
          ) : (
            <><Upload className="mr-2 h-4 w-4" /> Upload Notes</>
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadPage;
