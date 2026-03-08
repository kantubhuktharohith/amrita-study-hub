import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import StarRating from "./StarRating";
import { toast } from "sonner";

interface RatingSectionProps {
  contentType: "note" | "exam_paper";
  contentId: string;
}

const RatingSection = ({ contentType, contentId }: RatingSectionProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: avgData } = useQuery({
    queryKey: ["avg-rating", contentType, contentId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_average_rating", {
        _content_type: contentType,
        _content_id: contentId,
      });
      if (error) throw error;
      return data?.[0] ?? { average_rating: 0, total_ratings: 0 };
    },
  });

  const { data: userRating } = useQuery({
    queryKey: ["user-rating", contentType, contentId, user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from("ratings")
        .select("rating")
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .eq("user_id", user.id)
        .maybeSingle();
      return data?.rating ?? 0;
    },
    enabled: !!user,
  });

  const rateMutation = useMutation({
    mutationFn: async (rating: number) => {
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("ratings").upsert(
        { user_id: user.id, content_type: contentType, content_id: contentId, rating },
        { onConflict: "user_id,content_type,content_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["avg-rating", contentType, contentId] });
      queryClient.invalidateQueries({ queryKey: ["user-rating", contentType, contentId] });
      toast.success("Rating saved!");
    },
    onError: () => toast.error("Failed to save rating"),
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        <StarRating rating={Math.round(avgData?.average_rating ?? 0)} size="md" />
        <span className="text-sm font-medium text-foreground">
          {Number(avgData?.average_rating ?? 0).toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground">
          ({avgData?.total_ratings ?? 0} {Number(avgData?.total_ratings) === 1 ? "rating" : "ratings"})
        </span>
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Your rating:</span>
          <StarRating rating={userRating ?? 0} interactive onRate={(r) => rateMutation.mutate(r)} size="md" />
        </div>
      )}
    </div>
  );
};

export default RatingSection;
