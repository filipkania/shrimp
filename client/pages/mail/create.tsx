import dynamic from "next/dynamic";

const Editor = dynamic(
  () => import("../../components/pages/Mails/MailEditor"),
  { ssr: false }
);

const CreateMailPage = () => {
  return (
    <div className="container my-11 flex flex-col">
      <div className="my-5 overflow-scroll rounded-xl border p-4">
        <Editor />
      </div>
    </div>
  );
};

export default CreateMailPage;
