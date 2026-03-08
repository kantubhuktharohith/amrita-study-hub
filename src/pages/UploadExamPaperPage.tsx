import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Upload, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS, SEMESTERS, EXAM_TYPES, EXAM_YEARS } from "@/data/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const UploadExamPaperPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [examType, setExamType] = useState("");
  const [examYear, setExamYear] = useState("");
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
    if (!title || !subject || !department || !semester || !examType || !examYear || !file) {
      toast.error("Please fill all required fields and select a file.");
      return;
    }
    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("exam-papers").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("exam-papers").getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("exam_papers").insert({
        user_id: user.id,
        title,
        subject,
        department,
        semester: Number(semester),
        exam_type: examType,
        exam_year: Number(examYear),
        description: description || null,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: getFileType(file.name),
      });
      if (insertError) throw insertError;

      toast.success("Exam paper uploaded successfully!");
      navigate("/my-uploads");
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Upload Exam Paper</h1>
        <p className="text-sm text-muted-foreground">Share previous exam papers with fellow students.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 shadow-card">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. DBMS Mid-1 2025" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Database Management Systems" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Department *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>{DEPARTMENTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Semester *</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Select semester" /></SelectTrigger>
              <SelectContent>{SEMESTERS.map((s) => <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Exam Type *</Label>
            <Select value={examType} onValueChange={setExamType}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Select exam type" /></SelectTrigger>
              <SelectContent>{EXAM_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Exam Year *</Label>
            <Select value={examYear} onValueChange={setExamYear}>
              <SelectTrigger className="bg-background"><SelectValue placeholder="Select year" /></SelectTrigger>
              <SelectContent>{EXAM_YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Any additional details..." rows={3} />
        </div>

        <div className="space-y-2">
          <Label>File *</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-background p-8 transition-colors hover:border-primary/50">
            {file ? (
              <div className="flex items-center gap-2 text-sm"><FileText className="h-5 w-5 text-primary" /><span>{file.name}</span></div>
            ) : (
              <><Upload className="h-8 w-8 text-muted-foreground" /><span className="text-sm text-muted-foreground">Click to upload PDF, image, or document</span></>
            )}
            <input type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={uploading}>
          {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</> : <><Upload className="mr-2 h-4 w-4" /> Upload Exam Paper</>}
        </Button>
      </form>
    </div>
  );
};

export default UploadExamPaperPage;
