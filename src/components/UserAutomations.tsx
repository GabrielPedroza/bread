import { useSession } from "next-auth/react";
import { type AutomationType } from "~/server/types/automation";
import { api } from "~/utils/api";
import { AiFillDelete, AiOutlineLoading } from "react-icons/ai"
import { toast } from "react-hot-toast";
import { useState } from "react";

const UserAutomations = () => {
  const userAutomations = api.automation.getUserAutomations.useQuery();
  const deleteAutomation = api.automation.deleteAutomation.useMutation();
  const deleteWebHook = api.webhook.deleteWebhook.useMutation();
  const [loading, setLoading] = useState(false)

  const { data: session } = useSession();

  const handleDelete = async (automation: AutomationType, e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (loading) {
      toast.dismiss()
      toast.error("Stop spamming 😡")
    } else {
      toast.dismiss()
      toast.loading("Deleting Automation")
      const deleteWebHookAndReturnHookID = await deleteWebHook.mutateAsync({
        hookID: Number(automation.webhookID),
        accessToken: session?.user.accessToken,
      });
      
      if (deleteWebHookAndReturnHookID && deleteWebHookAndReturnHookID !== 404) {
        await deleteAutomation.mutateAsync({ hookID: automation.webhookID });
      } else if (deleteWebHookAndReturnHookID === 404) {
        toast.dismiss()
        toast.error("Cannot find your WebHook")
        setLoading(false)
        return
      } else {
        toast.dismiss()
        toast.error("Log Out and Log Back In")
        setLoading(false)
        return
      }
      toast.dismiss()
      toast.success('Automation Deleted', {
        style: {
          border: '1px solid #713200',
          padding: '16px',
          color: '#713200',
        },
        iconTheme: {
          primary: '#713200',
          secondary: '#FFFAEE',
        },
      });
      await userAutomations.refetch()
      setLoading(false)
    }
  };

  return (
    <div className="mx-auto mt-5 h-[45%] w-11/12 relative">
      <h2 className="relative top-4 left-8 text-3xl mb-10 text-amber-900 font-bold">My Automations</h2>
      <div className="flex justify-around mb-6 mt-5 text-xl text-amber-950">
        <h3>Name</h3>
        <h3>Description</h3>
        <h3>Status</h3>
      </div>
      {(() => {
        if (userAutomations.data) {
          if (userAutomations.data.length > 0) {
            return userAutomations.data.map((automation, i) => (
              <div className="relative flex justify-around w-[95%] border-2 border-amber-950 rounded-lg mx-auto py-3 mb-4 transition-all hover:scale-[101%]" key={i}>
                <div className="w-40 truncate -ml-10 top-[0.15rem] relative text-amber-950">{automation.name}</div>
                  <div className="w-44 truncate -ml-10 top-[0.15rem] relative text-amber-950 hover:">{automation.desc}</div>
                  <div>{automation.status === "active" ? <p className="text-lg relative top-[0.05rem]">🟢</p> : <p>🔴</p>}</div>
                  <button
                  className="absolute right-4 top-[0.65rem] text-lg p-2"
                    onClick={(e) => {
                      handleDelete(automation, e)
                    }}
                  >
                    <AiFillDelete />
                  </button>
              </div>
            ));
          } else {
            return <div className="text-4xl text-center text-amber-950 relative top-24">Waiting for your first creation!</div>;
          }
        } else {
          return <div className="animate-spin text-6xl absolute bottom-36 right-[37rem]"><AiOutlineLoading /></div>;
        }
      })()}
    </div>
  );
};

export default UserAutomations;
