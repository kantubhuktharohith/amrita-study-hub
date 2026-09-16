import React, { useState, useEffect } from "react";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { DEPARTMENTS, SEMESTERS } from "@/data/academicConstants";
import { SUB_COMMUNITIES } from "@/data/communityData";
import { createQuestion, CreateQuestionInput } from "@/lib/communityQueries";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { MessageSquarePlus, Code2, Sparkles, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface AskQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuestionCreated: () => void;
  initialSubCommunity?: string;
}

const getDepartmentShort = (dept: string): string => {
  if (!dept) return "Eng";
  if (dept.includes("Cyber Security")) return "CyberSec";
  if (dept.includes("AI & ML") || dept.includes("AIML")) return "AI/ML";
  if (dept.includes("Data Science")) return "DataSci";
  if (dept.includes("Big Data")) return "BigData";
  if (dept.includes("AIDS")) return "AIDS";
  if (dept.includes("Computer Science")) return "CSE";
  if (dept.includes("Electronics & Communication")) return "ECE";
  if (dept.includes("Electrical & Electronics")) return "EEE";
  if (dept.includes("Mechanical")) return "MECH";
  if (dept.includes("Civil")) return "CIVIL";
  return dept.slice(0, 4);
};

export const AskQuestionModal: React.FC<AskQuestionModalProps> = ({
  isOpen,
  onClose,
  onQuestionCreated,
  initialSubCommunity = "r/all",
}) => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) {
        console.warn("Could not fetch profile:", error.message);
        return null;
      }
      return data;
    },
    enabled: !!user,
  });

  const [title, setTitle] = useState("");
  const [subCommunity, setSubCommunity] = useState<string>(
    initialSubCommunity || "r/all",
  );
  const [department, setDepartment] = useState<string>(DEPARTMENTS[0]);
  const [semester, setSemester] = useState<string>("3");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [showCodeField, setShowCodeField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialSubCommunity) {
      setSubCommunity(initialSubCommunity);
    }
  }, [initialSubCommunity]);

  useEffect(() => {
    if (profile?.department) {
      const match = DEPARTMENTS.find(
        (d) =>
          d.toLowerCase() === profile.department?.toLowerCase() ||
          d.toLowerCase().includes(profile.department?.toLowerCase() || ""),
      );
      if (match) {
        setDepartment(match);
      }
    }
  }, [profile]);

  const rawAuthorName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split("@")[0] : "student");
  const authorName = (rawAuthorName || "student").trim() || "student";
  const authorYear = profile?.year ? Number(profile.year) : 2;
  const authorDepartment = profile?.department || department || DEPARTMENTS[0];
  const deptShort = getDepartmentShort(authorDepartment);
  const authorFlair =
    authorYear >= 3
      ? `${deptShort} • Senior Mentor ⭐`
      : `${deptShort} • Year ${authorYear}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Please provide a Title and question details");
      return;
    }

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim().replace(/^#/, ""))
        .filter((t) => t.length > 0);

      const cleanUname = authorName.replace(/^u\//, "").trim() || "student";

      const input: CreateQuestionInput = {
        title: title.trim(),
        content: content.trim(),
        codeSnippet: codeSnippet.trim() ? codeSnippet.trim() : undefined,
        subCommunity: subCommunity || "r/all",
        department,
        subject:
          subject.trim() ||
          (semester === "none" ? "General Programming" : department),
        semester: semester === "none" ? 0 : Number(semester) || 1,
        tags: tags.length > 0 ? tags : ["general"],
        authorUsername: `u/${cleanUname}`,
        authorDepartment,
        authorYear: Number(authorYear) || 2,
        authorFlair,
        authorId: user?.id,
      };

      const res = await createQuestion(input);
      if (!res.success) {
        toast.error(res.error || "Failed to publish post to database");
        return;
      }

      toast.success(`Post published to ${subCommunity || "r/all"}!`);

      setTitle("");
      setContent("");
      setCodeSnippet("");
      setSubject("");
      setTagsInput("");
      setShowCodeField(false);

      onQuestionCreated();
      onClose();
    } catch (err: any) {
      console.error("Failed to publish post:", err);
      toast.error(err.message || "Failed to publish post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="mb-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border bg-primary/10 px-3 py-1 text-xs font-semibold text-primary w-fit mb-1">
            <MessageSquarePlus className="h-3.5 w-3.5" /> Create a Post / Ask a
            Doubt
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Post to Amrita Sai Student Community
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Share code questions, exam prep doubts, or placement advice with
            fellow students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          {!user && (
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 shrink-0" />
                <span className="text-xs">
                  Please sign in to publish your post so it stores in the community database.
                </span>
              </div>
              <Link to="/login" onClick={onClose}>
                <Button size="sm" type="button" className="h-7 text-xs bg-amber-600 hover:bg-amber-700 text-white shrink-0">
                  Sign In
                </Button>
              </Link>
            </div>
          )}

          {/* Title */}
          <div>
            <Label htmlFor="post-title" className="text-xs font-semibold">
              Post Title *
            </Label>
            <Input
              id="post-title"
              placeholder="e.g. How to resolve segmentation fault in binary tree deletion?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 text-xs sm:text-sm"
            />
          </div>

          {/* Author Identity Badge */}
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-muted/60 border text-xs">
            <div className="h-6 w-6 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs shrink-0">
              {authorName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              <span className="text-muted-foreground">Posting as:</span>
              <span className="font-semibold text-foreground truncate">
                u/{authorName.replace(/^u\//, "")}
              </span>
              <span className="bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full text-[10px]">
                Year {authorYear}
              </span>
              {authorDepartment && (
                <span className="hidden sm:inline text-muted-foreground text-[11px]">
                  • {authorDepartment}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Flair: {authorFlair}
              </span>
            </div>
          </div>

          {/* Subcommunity & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">
                Community Channel *
              </Label>
              <Select value={subCommunity} onValueChange={setSubCommunity}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue placeholder="Select Channel" />
                </SelectTrigger>
                <SelectContent>
                  {SUB_COMMUNITIES.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id} className="text-xs">
                      <span className="mr-1.5">{sub.icon}</span> {sub.label} —{" "}
                      {sub.desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept} className="text-xs">
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Semester & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Semester</Label>
              <Select value={semester} onValueChange={setSemester}>
                <SelectTrigger className="mt-1 text-xs">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    value="none"
                    className="text-xs font-semibold text-primary"
                  >
                    None (Coding / Programs / General)
                  </SelectItem>
                  {SEMESTERS.map((sem) => (
                    <SelectItem
                      key={sem}
                      value={String(sem)}
                      className="text-xs"
                    >
                      Semester {sem}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="post-subject" className="text-xs font-semibold">
                Subject / Topic
              </Label>
              <Input
                id="post-subject"
                placeholder={
                  semester === "none"
                    ? "e.g. Python, Java, LeetCode, DSA, React"
                    : "e.g. Data Structures, DBMS, Operating Systems"
                }
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 text-xs"
              />
            </div>
          </div>

          {/* Post Content */}
          <div>
            <Label htmlFor="post-content" className="text-xs font-semibold">
              Post Body / Question Details *
            </Label>
            <Textarea
              id="post-content"
              placeholder="Provide background context, equations, steps you took, or what you'd like to understand..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="mt-1 text-xs sm:text-sm"
            />
          </div>

          {/* Code Snippet Attachment */}
          <div>
            {!showCodeField ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCodeField(true)}
                className="text-xs gap-1.5"
              >
                <Code2 className="h-3.5 w-3.5" /> Attach Code / Logs
              </Button>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label
                    htmlFor="post-code"
                    className="text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Code2 className="h-3.5 w-3.5 text-primary" /> Code Snippet
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCodeField(false);
                      setCodeSnippet("");
                    }}
                    className="h-6 text-[11px] text-muted-foreground"
                  >
                    Remove Code
                  </Button>
                </div>
                <Textarea
                  id="post-code"
                  placeholder="Paste your code or console error log here..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  rows={4}
                  className="font-mono text-xs mt-1"
                />
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="post-tags" className="text-xs font-semibold">
              Tags (comma separated)
            </Label>
            <Input
              id="post-tags"
              placeholder="e.g. C++, LeetCode, MidExam, Algorithms"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="mt-1 text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              size="sm"
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              size="sm"
              className="bg-hero-gradient text-white text-xs gap-1.5"
            >
              <Sparkles className="h-3.5 w-3.5" />{" "}
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
