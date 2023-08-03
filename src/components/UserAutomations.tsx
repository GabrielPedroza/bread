import { useSession } from "next-auth/react";
import { type AutomationType } from "~/server/types/automation";
import { api } from "~/utils/api";
import { AiFillDelete, AiOutlineLoading } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { useState } from "react";

const UserAutomations = () => {
  const userAutomations = api.automation.getUserAutomations.useQuery();
  const deleteAutomation = api.automation.deleteAutomation.useMutation();
  const deleteWebHook = api.webhook.deleteWebhook.useMutation();
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();

  const handleDelete = async (
    automation: AutomationType,
    e: React.FormEvent
  ) => {
    e.preventDefault();
    setLoading(true);
    if (loading) {
      toast.dismiss();
      toast.error("Stop spamming 😡");
    } else {
      toast.dismiss();
      toast.loading("Deleting Automation");
      const deleteWebHookResultObject = await deleteWebHook.mutateAsync({
        hookID: Number(automation.webhookID),
        accessToken: session?.user.accessToken,
      });

      if (deleteWebHookResultObject.error) {
        if (deleteWebHookResultObject.status === 404) {
          toast.dismiss();
          toast.error("Cannot find your WebHook");
          setLoading(false);
          return;
        } else {
          toast.dismiss();
          toast.error("Log Out and Log Back In");
          setLoading(false);
          return;
        }
      } else {
        await deleteAutomation.mutateAsync({ hookID: automation.webhookID });
      }

      toast.dismiss();
      toast.success("Automation Deleted", {
        style: {
          border: "1px solid #713200",
          padding: "16px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
      await userAutomations.refetch();
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto mt-5 h-[45%] w-11/12">
      <h2 className="relative left-8 top-4 mb-10 text-3xl font-bold text-amber-900">
        My Automations
      </h2>
      <div className="mb-6 mt-5 flex justify-around text-xl text-amber-950">
        <h3>Name</h3>
        <h3>Description</h3>
        <h3>Status</h3>
      </div>
      {(() => {
        if (userAutomations.data) {
          if (userAutomations.data.length > 0) {
            return userAutomations.data.map((automation, i) => (
              <div
                className="relative mx-auto mb-4 flex w-[95%] justify-around rounded-lg border-2 border-amber-950 py-3 transition-all hover:scale-[101%]"
                key={i}
              >
                <div className="relative top-[0.15rem] -ml-10 w-40 truncate text-amber-950">
                  {automation.name}
                </div>
                <div className="hover: relative top-[0.15rem] -ml-10 w-44 truncate text-amber-950">
                  {automation.desc}
                </div>
                <div>
                  {automation.status === "active" ? (
                    <p className="relative top-[0.05rem] text-lg">🟢</p>
                  ) : (
                    <p>🔴</p>
                  )}
                </div>
                <button
                  className="absolute right-4 top-[0.65rem] p-2 text-lg"
                  onClick={(e) => {
                    // eslint-disable-next-line @typescript-eslint/no-floating-promises
                    handleDelete(automation, e);
                  }}
                >
                  <AiFillDelete />
                </button>
              </div>
            ));
          } else {
            return (
              <div className="relative top-24 text-center text-4xl text-amber-950">
                Waiting for your first creation!
              </div>
            );
          }
        } else {
          return (
            <div className="absolute bottom-36 right-[37rem] animate-spin text-6xl">
              <AiOutlineLoading />
            </div>
          );
        }
      })()}
    </div>
  );
};

export default UserAutomations;
