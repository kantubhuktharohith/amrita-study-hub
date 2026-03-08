import { mockNotes } from "@/data/mockData";
import NoteCard from "@/components/NoteCard";
import { Badge } from "@/components/ui/badge";

const MyUploadsPage = () => {
  // Mock: show all notes as "my uploads"
  const myNotes = mockNotes;

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold mb-1">My Uploads</h1>
        <p className="text-sm text-muted-foreground">
          Manage your uploaded notes
        </p>
      </div>

      {myNotes.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">You haven't uploaded any notes yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myNotes.map((note) => (
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
