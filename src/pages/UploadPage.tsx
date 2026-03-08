import { useState } from "react";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DEPARTMENTS, SEMESTERS } from "@/data/mockData";
import { toast } from "sonner";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !department || !semester || !file) {
      toast.error("Please fill all required fields and select a file.");
      return;
    }
    toast.success("Notes uploaded successfully! They will be reviewed by an admin.");
    setTitle("");
    setSubject("");
    setDepartment("");
    setSemester("");
    setDescription("");
    setFile(null);
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">Upload Notes</h1>
        <p className="text-sm text-muted-foreground">
          Share your notes with fellow students. Uploads are reviewed before publishing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border bg-card p-6 shadow-card">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Data Structures Complete Notes" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Data Structures & Algorithms" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Department *</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Semester *</Label>
            <Select value={semester} onValueChange={setSemester}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {SEMESTERS.map((s) => (
                  <SelectItem key={s} value={String(s)}>Semester {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of what the notes cover..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>File *</Label>
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-background p-8 transition-colors hover:border-primary/50">
            {file ? (
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-5 w-5 text-primary" />
                <span>{file.name}</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload PDF, image, or document
                </span>
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

        <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90">
          <Upload className="mr-2 h-4 w-4" />
          Upload Notes
        </Button>
      </form>
    </div>
  );
};

export default UploadPage;
