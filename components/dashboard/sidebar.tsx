"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, FileText, Video, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";

interface Audit {
  id: string;
  fileName: string;
  fileType: string;
  impactScore: number | null;
  createdAt: string;
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const [audits, setAudits] = useState<Audit[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchAudits();
  }, []);

  async function fetchAudits() {
    try {
      const res = await fetch("/api/audits");
      if (res.ok) {
        const data = await res.json();
        setAudits(data);
      }
    } catch (error) {
      console.error("Failed to fetch audits:", error);
    }
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "VIDEO":
        return Video;
      case "IMAGE":
        return ImageIcon;
      case "TEXT":
        return FileText;
      default:
        return FileText;
    }
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {!isCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-semibold">Viral Labs</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* New Audit Button */}
      <div className="p-3">
        <Button
          asChild
          className="w-full"
          size={isCollapsed ? "icon" : "default"}
        >
          <Link href="/dashboard">
            <Plus className="h-4 w-4" />
            {!isCollapsed && <span>New Audit</span>}
          </Link>
        </Button>
      </div>

      {/* Audit History */}
      <ScrollArea className="flex-1 sidebar-scroll">
        <div className="p-3 space-y-1">
          {!isCollapsed && (
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Recent Audits
            </div>
          )}

          {audits.length === 0 && !isCollapsed && (
            <div className="px-3 py-8 text-center text-sm text-muted-foreground">
              No audits yet. Upload your first content to get started.
            </div>
          )}

          {audits.map((audit) => {
            const Icon = getFileIcon(audit.fileType);
            const isActive = pathname === `/dashboard/audit/${audit.id}`;

            return (
              <Link key={audit.id} href={`/dashboard/audit/${audit.id}`}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors cursor-pointer",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "hover:bg-secondary/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {audit.fileName}
                      </div>
                      {audit.impactScore !== null && (
                        <div className="text-xs text-muted-foreground font-data">
                          Score: {audit.impactScore}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDate(new Date(audit.createdAt))}
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-3 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            © 2026 Viral Labs
          </div>
        </div>
      )}
    </div>
  );
}
