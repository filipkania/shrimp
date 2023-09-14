import { useMail } from "@/lib/api/useMail";
import { useRouter } from "next/router";
import { sanitize } from "dompurify";
import { useMemo } from "react";

const MailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const mailId = parseInt(id as string);
  const { data, isLoading, error } = useMail(mailId);

  const emailHtml = useMemo(() => {
    if (!data?.html) return null;
    return sanitize(data.html);
  }, [data?.html]);

  if ((router.isReady && !id) || error) {
    return <span>nono</span>;
  }

  if (isLoading || !data) {
    return <span>loading...</span>;
  }

  return (
    <div className="container my-12 flex flex-col">
      <h1 className="text-3xl font-bold">{data?.subject}</h1>
      <h3 className="text-xl">
        {data?.fromName}{" "}
        <span className="text-gray-500">({data?.from.address})</span>
      </h3>

      <div className="my-5 overflow-scroll rounded-xl border p-4">
        {emailHtml && (
          <div
            className="h-full w-full"
            dangerouslySetInnerHTML={{ __html: `<base target="_blank"/>${emailHtml}` }}
          />
        )}

        {!emailHtml && (
          <div className="h-full w-full">
            {data.text || (
              <span className="text-gray-500">
                There&apos;s no content in this message :((
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MailPage;
