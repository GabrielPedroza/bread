import { useSession } from "next-auth/react";
import { type AutomationType } from "~/server/types/automation";
import { api } from "~/utils/api";

const UserAutomations = () => {
  const userAutomations = api.automation.getUserAutomations.useQuery();
  const deleteAutomation = api.automation.deleteAutomation.useMutation();
  const deleteWebHook = api.webhook.deleteWebhook.useMutation();

  const { data: session } = useSession();

  const handleDelete = async (automation: AutomationType) => {
    const deleteWebHookAndReturnHookID = await deleteWebHook.mutateAsync({
      hookID: Number(automation.webhookID),
      accessToken: session?.user.accessToken,
    });
    if (deleteWebHookAndReturnHookID) {
      deleteAutomation.mutate({ hookID: automation.webhookID });
    } else {
      console.log("log out and log back in");
    }
  };

  return (
    <div className="mx-auto mt-5 h-[45%] w-11/12 border-4 border-blue-600">
      {(() => {
        if (userAutomations.data) {
          if (userAutomations.data.length > 0) {
            return userAutomations.data.map((automation, i) => (
              <div className="flex justify-evenly" key={i}>
                <div>{automation.name}</div>
                <div>{automation.desc}</div>
                <div>{automation.status}</div>
                <button
                  onClick={() => {
                    deleteAutomation.mutate({ hookID: automation.webhookID });
                  }}
                >
                  delete
                </button>
              </div>
            ));
          } else {
            return <div>Waiting for your first creation!</div>;
          }
        } else {
          return <div>loading...</div>;
        }
      })()}
    </div>
  );
};

export default UserAutomations;
