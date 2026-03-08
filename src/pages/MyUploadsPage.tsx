import { Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import NoteCard from "@/components/NoteCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";

const MyUploadsPage = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["my-notes", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*, profiles(full_name)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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
        <div className="py-16 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : notes.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground mb-4">You haven't uploaded any notes yet.</p>
          <Link to="/upload">
            <Button variant="outline">Upload your first notes</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <div key={note.id} className="relative">
              <NoteCard note={note} />
              {note.status === "pending" && (
                <Badge className="absolute top-2 right-2 bg-warning text-warning-foreground text-[10px]">
                  Pending Review
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyUploadsPage;
