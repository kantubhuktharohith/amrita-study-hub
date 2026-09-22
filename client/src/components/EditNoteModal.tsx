import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { DEPARTMENTS, SEMESTERS } from "@/data/academicConstants";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { NoteWithProfile } from "@/components/NoteCard";

interface EditNoteModalProps {
  note: NoteWithProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EditNoteModal = ({ note, open, onOpenChange }: EditNoteModalProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState<string>("0");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setSubject(note.subject || "");
      setDepartment(note.department || "Computer Science & Engineering");
      setSemester(note.semester !== undefined && note.semester !== null ? String(note.semester) : "0");
      setDescription(note.description || "");
    }
  }, [note, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!note) return;

    if (!title.trim()) {
      toast.error("Please enter a title for the note.");
      return;
    }
    if (!subject.trim()) {
      toast.error("Please enter a subject or course name.");
      return;
    }

    setSaving(true);
    try {
      const semNum = Number(semester) || 0;
      const academicYear = semNum > 0 ? Math.ceil(semNum / 2) : 0;

      const { data, error } = await supabase
        .from("notes")
        .update({
          title: title.trim(),
          subject: subject.trim(),
          department: department.trim() || "Programming & Tech",
          semester: semNum,
          year: academicYear,
          description: description.trim() || null,
        })
        .eq("id", note.id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Could not update note. You may need permission to update this note.");
      }

      // Invalidate queries so changes reflect everywhere immediately
      queryClient.invalidateQueries({ queryKey: ["my-notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["top-notes"] });
      queryClient.invalidateQueries({ queryKey: ["note", note.id] });

      toast.success("Note updated successfully!");
      onOpenChange(false);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to update note.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Note Details</DialogTitle>
          <DialogDescription>
            Update the title, subject, or academic details of your uploaded note.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="edit-note-title">Title / Name *</Label>
            <Input
              id="edit-note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Data Structures Complete Notes"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-note-subject">Subject / Course *</Label>
            <Input
              id="edit-note-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Data Structures & Algorithms, Python"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="edit-note-department">Department / Branch</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger id="edit-note-department">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-note-semester">Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger id="edit-note-semester">
                  <SelectValue placeholder="Select Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Skill / Tech / All</SelectItem>
                  {SEMESTERS.map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="edit-note-description">Description (Optional)</Label>
            <Textarea
              id="edit-note-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add brief details about modules, topics covered, or source..."
              rows={3}
            />
          </div>

          <DialogFooter className="pt-3 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteModal;
