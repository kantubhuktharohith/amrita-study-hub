import { FileText, Image, File, Download, User, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type NoteWithProfile = Tables<"notes"> & { uploader_name?: string };

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  image: Image,
  doc: File,
};

const NoteCard = ({ note }: { note: NoteWithProfile }) => {
  const Icon = fileIcons[note.file_type] || FileText;

  const { data: avgData } = useQuery({
    queryKey: ["avg-rating", "note", note.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_average_rating", {
        _content_type: "note",
        _content_id: note.id,
      });
      return data?.[0] ?? { average_rating: 0, total_ratings: 0 };
    },
  });

  const avgRating = Number(avgData?.average_rating ?? 0);

  return (
    <Link
      to={`/note/${note.id}`}
      className="group block rounded-lg border bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <Badge variant="secondary" className="text-xs">
          {note.file_type.toUpperCase()}
        </Badge>
      </div>

      <h3 className="mb-1 font-display text-sm font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
        {note.title}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">{note.subject}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Sem {note.semester}</Badge>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{note.department.split(" ")[0]}</Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {note.uploader_name || "Unknown"}
        </span>
        <div className="flex items-center gap-2">
          {avgRating > 0 && (
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-warning text-warning" />
              {avgRating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {note.downloads}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;
