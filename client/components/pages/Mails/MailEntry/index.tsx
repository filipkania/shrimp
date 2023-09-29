import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail } from "@/lib/api/useMails";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Ref, forwardRef, useMemo } from "react";

type Props = {
  className?: string;

  data: Mail | null;
};

export const MailEntry = forwardRef<HTMLAnchorElement, Props>(
  ({ className, data }, ref) => {
    const date = useMemo(() => {
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

    return (
      <Link
        ref={ref}
        href={{
          pathname: "/mail",
          query: {
            id: data?.id,
          },
        }}
        className={cn(
          "flex cursor-pointer items-center justify-center gap-4 px-5 py-3",
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger>
            <b className="whitespace-nowrap">
              {!!data ? (
                data?.from_name.slice(0, 64) || "Unknown Author"
              ) : (
                <Skeleton className="h-[20px] w-[5rem] rounded" />
              )}
            </b>
          </TooltipTrigger>

          {data && (
            <TooltipContent>
              <span>{data.from_address}</span>
            </TooltipContent>
          )}
        </Tooltip>

        <div className="flex w-full items-center gap-1">
          {!data && (
            <Skeleton className="h-[20px] w-full max-w-[15rem] rounded" />
          )}

          {!!data && (
            <div className="overflow-hidden text-sm">
              <span>{data?.subject?.slice(0, 120)}</span>
              <span className="ml-1 hidden text-gray-500 dark:text-gray-400 md:inline-block">
                {!!data.text && ` - ${data.text.slice(0, 100)}`}
              </span>
            </div>
          )}
        </div>

        <Tooltip>
          <TooltipTrigger>
            <span className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
              {date || <Skeleton className="h-[15px] w-[3rem] rounded" />}
            </span>
          </TooltipTrigger>

          {data && (
            <TooltipContent>
              <span>{new Date(data.received_at).toLocaleString()}</span>
            </TooltipContent>
          )}
        </Tooltip>
      </Link>
    );
  }
);

MailEntry.displayName = "MailEntry";
