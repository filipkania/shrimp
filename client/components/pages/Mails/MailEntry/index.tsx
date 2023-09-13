import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  className?: string;

  data: {
    author: string;
    title: string;
    description: string;
    created_at: string;
  } | null;
};

export const MailEntry = ({ className, data }: Props) => {
  const date = useMemo(() => {
    if (!data) return null;
    const parsed = new Date(data.created_at);

    // check if the mails is from today
    if (parsed.toDateString() === new Date().toDateString()) {
      return parsed.toLocaleTimeString([], {
        timeStyle: "short",
      });
    }

    return parsed.toLocaleDateString();
  }, [data]);

  return (
    <Link
      href="/"
      className={cn(
        "flex cursor-pointer items-center justify-center gap-4 px-5 py-3 hover:bg-blend-darken",
        className
      )}
    >
      <b>
        {data?.author || <Skeleton className="h-[20px] w-[5rem] rounded" />}
      </b>

      <div className="flex w-full items-center gap-1">
        {!data && (
          <Skeleton className="h-[20px] w-full max-w-[15rem] rounded" />
        )}

        {!!data && (
          <div className="text-sm flex gap-1">
            <span>{data?.title}</span>
            <span className="hidden text-gray-500 md:block">
             {data && ` - ${data.description}`}
            </span>
          </div>
        )}
      </div>

      <Tooltip>
        <TooltipTrigger>
          <span className="whitespace-nowrap text-sm text-gray-600">
            {date || <Skeleton className="h-[15px] w-[3rem] rounded" />}
          </span>
        </TooltipTrigger>

        {data && (
          <TooltipContent>
            <span>{new Date(data.created_at).toLocaleString()}</span>
          </TooltipContent>
        )}
      </Tooltip>
    </Link>
  );
};
