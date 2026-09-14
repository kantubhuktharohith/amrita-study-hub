import React, { useState } from "react";
import { TechVideoItem } from "@/data/techNewsData";
import { Play, Radio, Eye, ExternalLink, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type { TechVideoItem };

export interface TechVideoCardProps {
  video: TechVideoItem;
}

export const TechVideoCard: React.FC<TechVideoCardProps> = ({ video }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <article
        onClick={() => setIsOpen(true)}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg flex flex-col"
      >
        {/* Video Thumbnail Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges on Thumbnail */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            {video.isLive ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-md animate-pulse">
                <Radio className="h-3 w-3" /> LIVE STREAM
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                <Sparkles className="h-3 w-3 text-primary" /> Keynote / Video
              </span>
            )}
          </div>

          {video.duration && (
            <div className="absolute bottom-2.5 right-2.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[10px] font-mono font-medium text-white">
              {video.duration}
            </div>
          )}

          {/* Centered Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-115 group-hover:bg-primary">
              <Play className="h-5 w-5 fill-current translate-x-0.5" />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
              <span className="font-semibold text-foreground/90">{video.channel}</span>
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3 text-muted-foreground" /> {video.views}
              </span>
            </div>

            <h3 className="font-display font-bold text-sm sm:text-base leading-snug text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {video.title}
            </h3>

            <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {video.description}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-primary flex items-center gap-1">
              <Play className="h-3 w-3 fill-current" /> Watch Video
            </span>
            <span className="text-[11px] text-muted-foreground">{video.publishedAt}</span>
          </div>
        </div>
      </article>

      {/* Video Theater Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-border/40 text-white rounded-2xl">
          <DialogHeader className="p-4 bg-card/95 border-b flex flex-row items-center justify-between space-y-0">
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
                {video.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Channel: <strong className="text-foreground">{video.channel}</strong> • {video.views}
              </DialogDescription>
            </div>
          </DialogHeader>

          {/* Responsive 16:9 YouTube Embed */}
          <div className="relative aspect-video w-full bg-black">
            {isOpen && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
          </div>

          <div className="p-4 bg-card text-foreground text-xs leading-relaxed space-y-2">
            <p className="text-muted-foreground">{video.description}</p>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-muted-foreground">
                Live stream hosted via YouTube
              </span>
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                Open in YouTube <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TechVideoCard;
