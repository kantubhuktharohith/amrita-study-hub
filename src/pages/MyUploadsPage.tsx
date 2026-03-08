import { Navigate, Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import NoteCard from "@/components/NoteCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { fetchNotesWithProfiles } from "@/lib/noteQueries";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MyUploadsPage = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  if (!user) return <Navigate to="/login" replace />;

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["my-notes", user.id],
    queryFn: () => fetchNotesWithProfiles({ userId: user.id }),
  });

  const handleDelete = async (noteId: string, fileUrl: string) => {
    try {
      // Extract file path from URL
      const urlParts = fileUrl.split("/notes/");
      if (urlParts[1]) {
        await supabase.storage.from("notes").remove([decodeURIComponent(urlParts[1])]);
      }
      const { error } = await supabase.from("notes").delete().eq("id", noteId);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["my-notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["top-notes"] });
      toast.success("Note deleted successfully.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete note.");
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">My Uploads</h1>
          <p className="text-sm text-muted-foreground">Manage your uploaded notes</p>
        </div>
        <Link to="/upload">
          <Button className="bg-hero-gradient text-primary-foreground hover:opacity-90">
            <Upload className="mr-2 h-4 w-4" /> Upload Notes
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="py-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : notes.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">You haven't uploaded any notes yet.</p>
          <Link to="/upload"><Button variant="outline">Upload your first notes</Button></Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <div key={note.id} className="relative group">
              <NoteCard note={note} />
              {note.status === "pending" && (
                <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground text-[10px]">Pending Review</Badge>
              )}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this note?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete "{note.title}" and its file. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(note.id, note.file_url)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploadsPage;
