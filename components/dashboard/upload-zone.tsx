"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from "next/navigation";
import { FileVideo, FileImage, FileText, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function UploadZone() {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pastedText, setPastedText] = useState("");

  // Handle file upload
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Check file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        throw new Error("File size must be less than 100MB");
      }

      // Create form data
      const formData = new FormData();
      formData.append("file", file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Upload file
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await response.json();

      // Redirect to audit page
      router.push(`/dashboard/audit/${data.auditId}`);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
      setProgress(0);
    }
  }, [router]);

  // Handle pasted text submission
  const handleTextSubmit = async () => {
    if (!pastedText.trim()) return;

    setError(null);
    setUploading(true);
    setProgress(0);

    try {
      // Create form data with text
      const formData = new FormData();
      formData.append("text", pastedText.trim());

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // Submit text
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Submission failed");
      }

      const data = await response.json();

      // Redirect to audit page
      router.push(`/dashboard/audit/${data.auditId}`);
    } catch (err) {
      console.error("Text submission error:", err);
      setError(err instanceof Error ? err.message : "Submission failed");
      setUploading(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      "text/*": [".txt", ".md"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: uploading,
    noClick: false,
    noKeyboard: false,
  });

  if (uploading) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-12 space-y-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-slate-900" />
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <p className="text-center text-sm text-muted-foreground">
              {progress < 30 ? "Uploading your content..." :
               progress < 60 ? "Content uploaded. Starting AI analysis..." :
               progress < 95 ? "AI is analyzing your content..." :
               "Finalizing results..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={cn(
          "bg-white rounded-lg shadow-quiet-lg border-2 border-dashed transition-all cursor-pointer",
          "hover:shadow-quiet-lg hover:border-slate-400",
          "p-12 text-center space-y-4",
          isDragActive && !isDragReject && "border-slate-900 bg-slate-50",
          isDragReject && "border-red-500 bg-red-50"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex justify-center gap-4">
          <div className="w-16 h-16 bg-card rounded-lg shadow-quiet flex items-center justify-center">
            <FileVideo className="w-8 h-8 text-slate-900" />
          </div>
          <div className="w-16 h-16 bg-card rounded-lg shadow-quiet flex items-center justify-center">
            <FileImage className="w-8 h-8 text-slate-900" />
          </div>
          <div className="w-16 h-16 bg-card rounded-lg shadow-quiet flex items-center justify-center">
            <FileText className="w-8 h-8 text-slate-900" />
          </div>
        </div>

        <div className="space-y-2">
          {isDragActive ? (
            <p className="text-lg font-medium">Drop your content here</p>
          ) : (
            <>
              <p className="text-lg font-medium">
                Drop your content here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground">
                Supports MP4, MOV, PNG, JPG, TXT, PDF (max 100MB)
              </p>
            </>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-muted-foreground">or paste your text</span>
        </div>
      </div>

      {/* Text Input Area */}
      <div className="bg-white rounded-lg shadow-quiet-lg border border-border p-6 space-y-4">
        <textarea
          value={pastedText}
          onChange={(e) => setPastedText(e.target.value)}
          placeholder="Paste your tweet, caption, or any text content here..."
          className={cn(
            "w-full min-h-[120px] p-4 rounded-lg border border-border",
            "focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent",
            "resize-none font-sans text-base",
            "placeholder:text-muted-foreground"
          )}
          disabled={uploading}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {pastedText.length} characters
            {pastedText.length <= 280 && pastedText.length > 0 && (
              <span className="ml-2 text-blue-600">• Detected as X/Twitter post</span>
            )}
          </p>
          <Button
            onClick={handleTextSubmit}
            disabled={!pastedText.trim() || uploading}
            className="gap-2"
          >
            Analyze Text
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
}
