import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CommentsSectionProps {
  contentType: "note" | "exam_paper";
  contentId: string;
}

interface CommentWithProfile {
  id: string;
  user_id: string;
  body: string;
  created_at: string;
  profile_name: string;
}

const CommentsSection = ({ contentType, contentId }: CommentsSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [body, setBody] = useState("");

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      if (!data || data.length === 0) return [];

      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);
      const profileMap = new Map(profiles?.map((p) => [p.user_id, p.full_name]) || []);

      return data.map((c) => ({
        ...c,
        profile_name: profileMap.get(c.user_id) || "Unknown",
      })) as CommentWithProfile[];
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Must be logged in");
      const trimmed = body.trim();
      if (!trimmed || trimmed.length > 1000) throw new Error("Invalid comment");
      const { error } = await supabase.from("comments").insert({
        user_id: user.id,
        content_type: contentType,
        content_id: contentId,
        body: trimmed,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setBody("");
      queryClient.invalidateQueries({ queryKey: ["comments", contentType, contentId] });
    },
    onError: () => toast.error("Failed to post comment"),
  });

  const deleteComment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("comments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", contentType, contentId] });
      toast.success("Comment deleted");
    },
  });

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
        <MessageSquare className="h-5 w-5 text-primary" />
        Comments ({comments.length})
      </h3>

      {user && (
        <div className="flex gap-3">
          <Textarea
            placeholder="Add a comment…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={1000}
            className="min-h-[60px] resize-none"
          />
          <Button
            size="sm"
            className="self-end bg-hero-gradient text-primary-foreground hover:opacity-90"
            disabled={!body.trim() || addComment.isPending}
            onClick={() => addComment.mutate()}
          >
            {addComment.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
      )}

      <div className="space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 rounded-lg border bg-card p-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {c.profile_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{c.profile_name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </span>
                  {user?.id === c.user_id && (
                    <button
                      onClick={() => deleteComment.mutate(c.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 text-sm text-foreground/80 whitespace-pre-wrap break-words">{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentsSection;
