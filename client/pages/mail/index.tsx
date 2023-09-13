import { useMail } from "@/lib/api/useMail";
import { useRouter } from "next/router";

const MailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const mailId = parseInt(id as string);
  const { data, isLoading, error } = useMail(mailId);

  if ((router.isReady && !id) || error) {
    return <span>nono</span>;
  }

  if (isLoading || !data) {
    return <span>loading...</span>;
  }

  return <div className="container my-12 flex flex-col">
    <h1 className="text-3xl font-bold">{data?.subject}</h1>
    <h3 className="text-xl">{data?.fromName} <span className="text-gray-500">({data?.from.address})</span></h3>

    <div className="my-5 border p-2 rounded-xl">
      <iframe className="w-full h-full" sandbox="allow-top-navigation-by-user-activation" srcDoc={`<base target="_parent" />${data?.html}`}></iframe>

    </div>

  </div>;
};

export default MailPage;
