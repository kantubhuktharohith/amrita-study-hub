import React, { useEffect, useRef, useState, useCallback } from "react";
import * as pdfjsLib from "pdfjs-dist";
import { ChevronLeft,ChevronRight,ZoomIn,ZoomOut,RotateCw,Loader2,AlertCircle,ExternalLink,Layers,ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";

// Polyfill Promise.withResolvers for browsers that don't support it yet
if (typeof (Promise as any).withResolvers === "undefined") {
  (Promise as any).withResolvers = function <T>() {
    let resolve!: (value: T | PromiseLike<T>) => void;
    let reject!: (reason?: any) => void;
    const promise = new Promise<T>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// Configure PDF.js worker using unpkg CDN matching the installed version
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || "6.3.289"}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn("Could not set PDF worker URL", e);
}

interface PdfViewerProps {
  url: string;
  title?: string;
  className?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({
  url,
  title = "Document",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<string>("Loading document...");
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"continuous" | "single">("continuous");
  const [useGoogleDocs, setUseGoogleDocs] = useState<boolean>(false);

  // Single page canvas ref
  const singleCanvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);

  // Continuous pages canvas refs
  const continuousCanvasesRef = useRef<Map<number, HTMLCanvasElement>>(new Map());

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);
    setLoadingProgress("Fetching document...");

    const loadPdf = async () => {
      try {
        let pdfData: any = null;

        // Try standard fetch first to get arrayBuffer
        try {
          const response = await fetch(url);
          if (response.ok) {
            const buffer = await response.arrayBuffer();
            pdfData = { data: buffer };
          }
        } catch (fetchErr) {
          console.warn("Direct fetch failed, falling back to URL loading", fetchErr);
        }

        const taskOptions: any = {
          cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || "6.3.289"}/cmaps/`,
          cMapPacked: true,
        };

        if (pdfData) {
          taskOptions.data = pdfData.data;
        } else {
          taskOptions.url = url;
          taskOptions.withCredentials = false;
        }

        const loadingTask = pdfjsLib.getDocument(taskOptions);

        loadingTask.onProgress = ({ loaded, total }: { loaded: number; total: number }) => {
          if (total > 0) {
            const percent = Math.round((loaded / total) * 100);
            setLoadingProgress(`Loading PDF... ${percent}%`);
          }
        };

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        console.error("PDF loading error:", err);
        if (!isCancelled) {
          setError(err.message || "Failed to load PDF preview directly.");
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [url]);

  // Render a specific page to a canvas
  const renderPageToCanvas = useCallback(
    async (pageNumber: number, canvas: HTMLCanvasElement) => {
      if (!pdfDoc || !canvas) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);
        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
        
        // Calculate appropriate scale based on container width
        const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
        
        // On mobile, default scale to fit the screen nicely with some padding
        const targetWidth = Math.min(containerWidth - 32, 900);
        const baseScale = targetWidth > 0 ? targetWidth / unscaledViewport.width : 1.0;
        const finalScale = baseScale * scale;

        const viewport = page.getViewport({ scale: finalScale, rotation });
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        const transform = pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          transform: transform,
        };

        await page.render(renderContext).promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn(`Error rendering page ${pageNumber}:`, err);
        }
      }
    },
    [pdfDoc, scale, rotation]
  );

  // Render Single Page View
  useEffect(() => {
    if (viewMode !== "single" || !pdfDoc || !singleCanvasRef.current) return;

    let cancelled = false;

    const render = async () => {
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // ignore
        }
      }

      const canvas = singleCanvasRef.current;
      if (!canvas || cancelled) return;

      try {
        const page = await pdfDoc.getPage(currentPage);
        if (cancelled) return;

        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
        const unscaledViewport = page.getViewport({ scale: 1.0, rotation });
        const targetWidth = Math.min(containerWidth - 32, 900);
        const baseScale = targetWidth > 0 ? targetWidth / unscaledViewport.width : 1.0;
        const finalScale = baseScale * scale;

        const viewport = page.getViewport({ scale: finalScale, rotation });
        const pixelRatio = window.devicePixelRatio || 1;

        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const transform = pixelRatio !== 1 ? [pixelRatio, 0, 0, pixelRatio, 0, 0] : undefined;

        const task = page.render({
          canvasContext: ctx,
          viewport,
          transform,
        });

        renderTaskRef.current = task;
        await task.promise;
      } catch (err: any) {
        if (err?.name !== "RenderingCancelledException") {
          console.warn("Single page render error:", err);
        }
      }
    };

    render();

    return () => {
      cancelled = true;
    };
  }, [viewMode, pdfDoc, currentPage, scale, rotation]);

  // Render Continuous Scroll View
  useEffect(() => {
    if (viewMode !== "continuous" || !pdfDoc || numPages === 0) return;

    for (let p = 1; p <= numPages; p++) {
      const canvas = continuousCanvasesRef.current.get(p);
      if (canvas) {
        renderPageToCanvas(p, canvas);
      }
    }
  }, [viewMode, pdfDoc, numPages, scale, rotation, renderPageToCanvas]);

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.2, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.2, 0.6));
  const handleResetZoom = () => setScale(1.0);
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  // If user chooses Google Docs Viewer or if direct PDF.js rendering failed
  if (useGoogleDocs) {
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
      url
    )}&embedded=true`;

    return (
      <div className={`w-full flex flex-col bg-neutral-900 ${className}`}>
        {/* Toggle bar back to native reader */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-800 border-b border-neutral-700 text-xs text-neutral-300">
          <span>Google Docs Cloud Viewer</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-primary hover:text-primary hover:bg-neutral-700"
            onClick={() => setUseGoogleDocs(false)}
          >
            Switch to In-App Reader
          </Button>
        </div>
        <iframe
          src={googleViewerUrl}
          title={title}
          className="w-full h-[78vh] md:h-[84vh] border-0 bg-neutral-900"
          allow="fullscreen"
        />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full bg-neutral-950 flex flex-col items-center select-none ${className}`}
    >
      {/* Viewer Controls Toolbar */}
      <div className="sticky top-0 z-20 w-full bg-neutral-900/95 backdrop-blur border-b border-neutral-800 px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-white shadow-md">
        {/* Left: View Mode & Page Info */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs text-neutral-300 hover:text-white hover:bg-neutral-800 gap-1.5"
            onClick={() =>
              setViewMode((m) => (m === "continuous" ? "single" : "continuous"))
            }
            title={
              viewMode === "continuous"
                ? "Switch to Single Page"
                : "Switch to Continuous Scroll"
            }
          >
            {viewMode === "continuous" ? (
              <>
                <ScrollText className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">All Pages</span>
              </>
            ) : (
              <>
                <Layers className="h-3.5 w-3.5 text-primary" />
                <span className="hidden sm:inline">Single Page</span>
              </>
            )}
          </Button>

          {numPages > 0 && (
            <span className="text-xs text-neutral-400 font-mono bg-neutral-800/80 px-2 py-1 rounded">
              {viewMode === "single" ? `${currentPage} / ${numPages}` : `${numPages} Pages`}
            </span>
          )}
        </div>

        {/* Center: Pagination (single mode only) */}
        {viewMode === "single" && numPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs text-neutral-300 min-w-[50px] text-center font-medium">
              {currentPage} of {numPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, numPages))}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Right: Zoom & Rotate Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
            onClick={handleZoomOut}
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs font-mono text-neutral-300 hover:text-white hover:bg-neutral-800"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            {Math.round(scale * 100)}%
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
            onClick={handleZoomIn}
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-300 hover:text-white hover:bg-neutral-800"
            onClick={handleRotate}
            title="Rotate 90 degrees"
            aria-label="Rotate"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div className="w-full flex-1 overflow-auto flex flex-col items-center py-4 px-2 sm:px-4 min-h-[72vh] max-h-[86vh]">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm font-medium">{loadingProgress}</p>
            <span className="text-xs text-neutral-500">Preparing in-browser preview...</span>
          </div>
        )}

        {/* Error Fallback State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-md">
            <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">
              Direct Preview Unavailable
            </h3>
            <p className="text-xs text-neutral-400 mb-5 leading-relaxed">
              Direct streaming is restricted on this browser. You can view this document seamlessly via Google Docs Cloud Viewer without downloading.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
              <Button
                variant="default"
                size="sm"
                className="bg-primary text-primary-foreground gap-1.5"
                onClick={() => setUseGoogleDocs(true)}
              >
                <ExternalLink className="h-4 w-4" /> Open in Cloud Viewer
              </Button>
            </div>
          </div>
        )}

        {/* Single Page View */}
        {!loading && !error && viewMode === "single" && (
          <div className="flex flex-col items-center justify-center w-full my-auto">
            <div className="bg-white rounded shadow-2xl overflow-hidden border border-neutral-800">
              <canvas ref={singleCanvasRef} className="block" />
            </div>
          </div>
        )}

        {/* Continuous Scroll View (All Pages) */}
        {!loading && !error && viewMode === "continuous" && (
          <div className="flex flex-col items-center gap-4 w-full max-w-4xl">
            {Array.from({ length: numPages }, (_, i) => i + 1).map((pageNum) => (
              <div
                key={pageNum}
                className="flex flex-col items-center relative group"
              >
                {/* Page Number Badge */}
                <div className="text-[11px] text-neutral-400 font-medium mb-1 self-start px-1">
                  Page {pageNum}
                </div>
                {/* Canvas card */}
                <div className="bg-white rounded shadow-xl overflow-hidden border border-neutral-800">
                  <canvas
                    ref={(el) => {
                      if (el) {
                        continuousCanvasesRef.current.set(pageNum, el);
                      } else {
                        continuousCanvasesRef.current.delete(pageNum);
                      }
                    }}
                    className="block"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Google Docs toggle option in footer */}
      {!loading && !error && (
        <div className="w-full bg-neutral-900/60 border-t border-neutral-800/80 px-3 py-1.5 text-center">
          <button
            type="button"
            onClick={() => setUseGoogleDocs(true)}
            className="text-[11px] text-neutral-400 hover:text-primary transition-colors underline underline-offset-2 inline-flex items-center gap-1"
          >
            <span>Having trouble with rendering? Open with Google Cloud Viewer</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;
