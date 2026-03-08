import { FileText, Image, File, Download, User, Calendar, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ExamPaperWithProfile } from "@/lib/noteQueries";
import { EXAM_TYPES } from "@/data/mockData";

const fileIcons: Record<string, typeof FileText> = {
  pdf: FileText,
  image: Image,
  doc: File,
};

const ExamPaperCard = ({ paper }: { paper: ExamPaperWithProfile }) => {
  const Icon = fileIcons[paper.file_type] || FileText;
  const examLabel = EXAM_TYPES.find((t) => t.value === paper.exam_type)?.label || paper.exam_type;

  const { data: avgData } = useQuery({
    queryKey: ["avg-rating", "exam_paper", paper.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("get_average_rating", {
        _content_type: "exam_paper",
        _content_id: paper.id,
      });
      return data?.[0] ?? { average_rating: 0, total_ratings: 0 };
    },
  });

  const avgRating = Number(avgData?.average_rating ?? 0);
    <Link
      to={`/exam-paper/${paper.id}`}
      className="group block rounded-lg border bg-card p-4 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10">
          <Icon className="h-5 w-5 text-accent" />
        </div>
        <Badge variant="secondary" className="text-xs">{examLabel}</Badge>
      </div>

      <h3 className="mb-1 font-display text-sm font-semibold leading-tight group-hover:text-accent transition-colors line-clamp-2">
        {paper.title}
      </h3>
      <p className="mb-3 text-xs text-muted-foreground">{paper.subject}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">Sem {paper.semester}</Badge>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{paper.department.split(" ")[0]}</Badge>
        <Badge variant="outline" className="text-[10px] px-1.5 py-0">{paper.exam_year}</Badge>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {paper.uploader_name || "Unknown"}
        </span>
        <span className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          {paper.downloads}
        </span>
      </div>
    </Link>
  );
};

export default ExamPaperCard;
