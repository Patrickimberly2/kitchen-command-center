import React from "react";
import { AuditIssue } from "@/ai/rulesEngine";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";

interface AuditPanelProps {
  issues: AuditIssue[];
}

export default function AuditPanel({ issues }: AuditPanelProps) {
  const errors = issues.filter(i => i.level === "error");
  const warnings = issues.filter(i => i.level === "warning");
  const infos = issues.filter(i => i.level === "info");

  const getIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const hasIssues = errors.length > 0 || warnings.length > 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant={hasIssues ? "outline" : "ghost"} 
          className={`gap-2 ${hasIssues ? "border-amber-500/50 text-amber-600" : ""}`}
        >
          {hasIssues ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          )}
          <span className="hidden sm:inline">
            {hasIssues ? `${errors.length + warnings.length} Issues` : "All Good"}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="mb-3 font-semibold text-foreground">Audit Report</div>
        {issues.length === 0 ? (
          <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
            <CheckCircle2 className="h-4 w-4" />
            Everything looks great!
          </div>
        ) : (
          <ul className="space-y-2">
            {[...errors, ...warnings, ...infos].map((issue, idx) => (
              <li 
                key={idx} 
                className={`flex items-start gap-2 rounded-lg p-2 text-sm ${
                  issue.level === "error" 
                    ? "bg-destructive/10" 
                    : issue.level === "warning"
                    ? "bg-amber-500/10"
                    : "bg-muted"
                }`}
              >
                {getIcon(issue.level)}
                <span>{issue.message}</span>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
