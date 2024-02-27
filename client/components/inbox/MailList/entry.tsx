import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Mail } from "@/lib/api/useMails";
import { cn } from "@/lib/utils";
import { forwardRef, useMemo, type HTMLAttributes } from "react";

type Props = {
  data: Mail | null;
  selected?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

export const MailEntry = forwardRef<HTMLButtonElement, Props>(
  ({ className, data, selected = false, ...props }: Props, ref) => {
    const shortDate = useMemo(() => {
      if (!data) return null;
      const parsed = new Date(data.received_at);

      // check if the mail is from today
      if (parsed.toDateString() === new Date().toDateString()) {
        return parsed.toLocaleTimeString([], {
          timeStyle: "short",
        });
      }

      return parsed.toLocaleDateString();
    }, [data]);

    if (!data) {
      return (
        <div className="flex w-full flex-col gap-2 border-b p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/6" />
          </div>

          <Skeleton className="h-3 w-2/5" />

          <div className="flex gap-1">
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/5" />
          </div>
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full cursor-pointer flex-col break-words border-b px-6 py-4 text-left hover:bg-muted",
          selected && "bg-muted",
          className
        )}
        {...props}
      >
        <div className="flex w-full justify-between">
          <Tooltip>
            <TooltipTrigger>
              <span className="flex items-center gap-2 pr-3 text-left font-semibold">
                {[2, 3, 30].includes(data.id) && (
                  <div className="min-h-1.5 min-w-1.5 rounded-full bg-blue-500 motion-safe:animate-pulse" />
                )}

                {data.from_name || data.from_address}
              </span>
            </TooltipTrigger>
            <TooltipContent>{data.from_address}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger className="min-w-fit">
              <span className="text-sm text-muted-foreground">{shortDate}</span>
            </TooltipTrigger>
            <TooltipContent>
              {new Date(data.received_at).toLocaleString()}
            </TooltipContent>
          </Tooltip>
        </div>

        <span className="line-clamp-2 text-sm">
          {data.subject || "No subject"}
        </span>

        <span className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {data.text?.substring(0, 300)}
        </span>
      </button>
    );
  }
);

MailEntry.displayName = "MailEntry";
