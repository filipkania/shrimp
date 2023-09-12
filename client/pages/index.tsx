import { Header } from "@/components/shared/Header";
import { useMails } from "@/lib/api/useMails";

export default function Home() {
  const mails = useMails();
  console.log(mails);

  return (
    <>
      <Header />
      <div className="h-screen">hlelo</div>
      <div>wow</div>
    </>
  );
}
