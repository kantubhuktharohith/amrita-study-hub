import { Navigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { fetchNotesWithProfiles, fetchExamPapersWithProfiles } from "@/lib/noteQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Trash2, CheckCircle, XCircle, Shield, FileText, Users, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminPanelPage = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useIsAdmin();
  const queryClient = useQueryClient();

  const { data: allNotes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["admin-all-notes"],
    queryFn: () => fetchNotesWithProfiles(),
    enabled: isAdmin,
  });

  const { data: allPapers = [], isLoading: papersLoading } = useQuery({
    queryKey: ["admin-all-papers"],
    queryFn: () => fetchExamPapersWithProfiles(),
    enabled: isAdmin,
  });

  const { data: allProfiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isAdmin,
  });

  if (!user) return <Navigate to="/login" replace />;
  if (adminLoading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;

  const pendingNotes = allNotes.filter((n) => n.status === "pending");
  const pendingPapers = allPapers.filter((p) => p.status === "pending");

  const handleApprove = async (table: "notes" | "exam_papers", id: string) => {
    const { error } = await supabase.from(table).update({ status: "approved" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Approved!");
    queryClient.invalidateQueries({ queryKey: ["admin-all-notes"] });
    queryClient.invalidateQueries({ queryKey: ["admin-all-papers"] });
    queryClient.invalidateQueries({ queryKey: ["notes"] });
    queryClient.invalidateQueries({ queryKey: ["exam-papers"] });
  };

  const handleReject = async (table: "notes" | "exam_papers", id: string) => {
    const { error } = await supabase.from(table).update({ status: "rejected" }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Rejected.");
    queryClient.invalidateQueries({ queryKey: ["admin-all-notes"] });
    queryClient.invalidateQueries({ queryKey: ["admin-all-papers"] });
  };

  const handleDeleteNote = async (noteId: string, fileUrl: string) => {
    try {
      const urlParts = fileUrl.split("/notes/");
      if (urlParts[1]) await supabase.storage.from("notes").remove([decodeURIComponent(urlParts[1])]);
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-all-notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["top-notes"] });
      toast.success("Note deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  const handleDeletePaper = async (paperId: string, fileUrl: string) => {
    try {
      const urlParts = fileUrl.split("/exam-papers/");
      if (urlParts[1]) await supabase.storage.from("exam-papers").remove([decodeURIComponent(urlParts[1])]);
      const { error } = await supabase.from("exam_papers").delete().eq("id", paperId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["admin-all-papers"] });
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] });
      toast.success("Exam paper deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  const statusBadge = (status: string) => {
    if (status === "approved") return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30">Approved</Badge>;
    if (status === "pending") return <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">Pending</Badge>;
    return <Badge className="bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30">Rejected</Badge>;
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center gap-3">
        <Shield className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Manage uploads, users, and pending content</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><FileText className="h-4 w-4" /> Total Notes</div>
          <p className="mt-1 text-2xl font-bold">{allNotes.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><FileText className="h-4 w-4" /> Total Papers</div>
          <p className="mt-1 text-2xl font-bold">{allPapers.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Users className="h-4 w-4" /> Users</div>
          <p className="mt-1 text-2xl font-bold">{allProfiles.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm"><Clock className="h-4 w-4" /> Pending</div>
          <p className="mt-1 text-2xl font-bold text-yellow-600">{pendingNotes.length + pendingPapers.length}</p>
        </div>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="pending">Pending ({pendingNotes.length + pendingPapers.length})</TabsTrigger>
          <TabsTrigger value="notes">All Notes ({allNotes.length})</TabsTrigger>
          <TabsTrigger value="papers">All Papers ({allPapers.length})</TabsTrigger>
          <TabsTrigger value="users">Users ({allProfiles.length})</TabsTrigger>
        </TabsList>

        {/* Pending tab */}
        <TabsContent value="pending">
          {pendingNotes.length + pendingPapers.length === 0 ? (
            <p className="py-12 text-center text-muted-foreground">No pending content 🎉</p>
          ) : (
            <div className="space-y-6">
              {pendingNotes.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">Pending Notes</h3>
                  <ContentTable
                    items={pendingNotes}
                    type="notes"
                    statusBadge={statusBadge}
                    onApprove={(id) => handleApprove("notes", id)}
                    onReject={(id) => handleReject("notes", id)}
                    onDelete={handleDeleteNote}
                  />
                </div>
              )}
              {pendingPapers.length > 0 && (
                <div>
                  <h3 className="mb-3 font-semibold">Pending Exam Papers</h3>
                  <ContentTable
                    items={pendingPapers}
                    type="papers"
                    statusBadge={statusBadge}
                    onApprove={(id) => handleApprove("exam_papers", id)}
                    onReject={(id) => handleReject("exam_papers", id)}
                    onDelete={handleDeletePaper}
                  />
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* All Notes tab */}
        <TabsContent value="notes">
          {notesLoading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> : (
            <ContentTable
              items={allNotes}
              type="notes"
              statusBadge={statusBadge}
              onApprove={(id) => handleApprove("notes", id)}
              onReject={(id) => handleReject("notes", id)}
              onDelete={handleDeleteNote}
            />
          )}
        </TabsContent>

        {/* All Papers tab */}
        <TabsContent value="papers">
          {papersLoading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> : (
            <ContentTable
              items={allPapers}
              type="papers"
              statusBadge={statusBadge}
              onApprove={(id) => handleApprove("exam_papers", id)}
              onReject={(id) => handleReject("exam_papers", id)}
              onDelete={handleDeletePaper}
            />
          )}
        </TabsContent>

        {/* Users tab */}
        <TabsContent value="users">
          {profilesLoading ? <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> : (
            <div className="overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProfiles.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name || "—"}</TableCell>
                      <TableCell className="text-sm">{p.department || "—"}</TableCell>
                      <TableCell>{p.year || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{format(new Date(p.created_at), "dd MMM yyyy")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* Reusable table for notes/papers */
function ContentTable({ items, type, statusBadge, onApprove, onReject, onDelete }: {
  items: any[];
  type: "notes" | "papers";
  statusBadge: (s: string) => JSX.Element;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string, fileUrl: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Uploader</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[200px] truncate">{item.title}</TableCell>
              <TableCell className="text-sm">{item.subject}</TableCell>
              <TableCell className="text-sm max-w-[150px] truncate">{item.department}</TableCell>
              <TableCell className="text-sm">{item.uploader_name || "Unknown"}</TableCell>
              <TableCell>{statusBadge(item.status)}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{format(new Date(item.created_at), "dd MMM yyyy")}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {item.status === "pending" && (
                    <>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-500/10" onClick={() => onApprove(item.id)} title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-500/10" onClick={() => onReject(item.id)} title="Reject">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{item.title}"?</AlertDialogTitle>
                        <AlertDialogDescription>This will permanently delete this {type === "notes" ? "note" : "exam paper"} and its file. This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(item.id, item.file_url)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default AdminPanelPage;
