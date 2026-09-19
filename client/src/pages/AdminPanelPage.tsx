import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchNotesWithProfiles,
  fetchExamPapersWithProfiles,
} from "@/lib/noteQueries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Shield,
  FileText,
  Users,
  Clock,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Admin credentials strictly from environment variables
const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

const AdminPanelPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("campusorbit_admin_auth") === "true";
  });
  const [adminId, setAdminId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const queryClient = useQueryClient();

  const { data: allNotes = [], isLoading: notesLoading } = useQuery({
    queryKey: ["admin-all-notes"],
    queryFn: () => fetchNotesWithProfiles(),
    enabled: isAuthenticated,
  });

  const { data: allPapers = [], isLoading: papersLoading } = useQuery({
    queryKey: ["admin-all-papers"],
    queryFn: () => fetchExamPapersWithProfiles(),
    enabled: isAuthenticated,
  });

  const { data: allProfiles = [], isLoading: profilesLoading } = useQuery({
    queryKey: ["admin-all-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: isAuthenticated,
  });

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (adminId === ADMIN_ID && adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem("campusorbit_admin_auth", "true");
      toast.success("Welcome, Admin!");
    } else {
      setLoginError("Invalid admin ID or password. Please try again.");
    }
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("campusorbit_admin_auth");
    setAdminId("");
    setAdminPassword("");
  };

  // Show login gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-xl space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Admin Login
              </h2>
              <p className="text-xs text-muted-foreground">
                Enter your admin credentials to access the panel
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-id" className="text-sm font-medium">
                  Admin ID
                </Label>
                <Input
                  id="admin-id"
                  type="text"
                  placeholder="Enter admin ID"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="h-10"
                  autoFocus
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-xs text-destructive font-medium bg-destructive/10 rounded-lg px-3 py-2">
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-hero-gradient text-white font-semibold h-10"
              >
                <Shield className="h-4 w-4 mr-2" />
                Login to Admin Panel
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/"
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDeleteNote = async (noteId: string, fileUrl: string) => {
    try {
      if (fileUrl) {
        try {
          const urlParts = fileUrl.split("/notes/");
          if (urlParts.length > 1) {
            const filePath = decodeURIComponent(urlParts[1]);
            await supabase.storage.from("notes").remove([filePath]);
          }
        } catch (storageErr) {
          console.error("Failed to delete file from storage:", storageErr);
        }
      }

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
      if (fileUrl) {
        try {
          const urlParts = fileUrl.split("/exam-papers/");
          if (urlParts.length > 1) {
            const filePath = decodeURIComponent(urlParts[1]);
            await supabase.storage.from("exam-papers").remove([filePath]);
          }
        } catch (storageErr) {
          console.error("Failed to delete file from storage:", storageErr);
        }
      }

      const { error } = await supabase
        .from("exam_papers")
        .delete()
        .eq("id", paperId);
      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["admin-all-papers"] });
      queryClient.invalidateQueries({ queryKey: ["exam-papers"] });
      toast.success("Exam paper deleted.");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-7 w-7 text-primary" />
          <div>
            <h1 className="font-display text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Manage uploads, users, and pending content
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleAdminLogout}>
          Logout
        </Button>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <FileText className="h-4 w-4" /> Total Notes
          </div>
          <p className="mt-1 text-2xl font-bold">{allNotes.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <FileText className="h-4 w-4" /> Total Papers
          </div>
          <p className="mt-1 text-2xl font-bold">{allPapers.length}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Users className="h-4 w-4" /> Users
          </div>
          <p className="mt-1 text-2xl font-bold">{allProfiles.length}</p>
        </div>
      </div>

      <Tabs defaultValue="notes">
        <TabsList className="mb-6 flex-wrap">
          <TabsTrigger value="notes">All Notes ({allNotes.length})</TabsTrigger>
          <TabsTrigger value="papers">
            All Papers ({allPapers.length})
          </TabsTrigger>
          <TabsTrigger value="users">Users ({allProfiles.length})</TabsTrigger>
        </TabsList>

        {/* All Notes tab */}
        <TabsContent value="notes">
          {notesLoading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          ) : (
            <ContentTable
              items={allNotes}
              type="notes"
              onDelete={handleDeleteNote}
            />
          )}
        </TabsContent>

        {/* All Papers tab */}
        <TabsContent value="papers">
          {papersLoading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          ) : (
            <ContentTable
              items={allPapers}
              type="papers"
              onDelete={handleDeletePaper}
            />
          )}
        </TabsContent>

        {/* Users tab */}
        <TabsContent value="users">
          {profilesLoading ? (
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          ) : (
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
                      <TableCell className="font-medium">
                        {p.full_name || "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {p.department || "—"}
                      </TableCell>
                      <TableCell>{p.year || "—"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(p.created_at), "dd MMM yyyy")}
                      </TableCell>
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
function ContentTable({
  items,
  type,
  onDelete,
}: {
  items: any[];
  type: "notes" | "papers";
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
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium max-w-[200px] truncate">
                {item.title}
              </TableCell>
              <TableCell className="text-sm">{item.subject}</TableCell>
              <TableCell className="text-sm max-w-[150px] truncate">
                {item.department}
              </TableCell>
              <TableCell className="text-sm">
                {item.uploader_name || "Unknown"}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(item.created_at), "dd MMM yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete "{item.title}"?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this{" "}
                          {type === "notes" ? "note" : "exam paper"} and its
                          file. This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(item.id, item.file_url)}
                        >
                          Delete
                        </AlertDialogAction>
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
