import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { ModalContext } from "~/state/ModalContext";
import { api } from "~/utils/api";

type ModalStateSetter = (value: { open: boolean }) => void;

interface GitHubFormTypeProps {
  modals: {
    setCreateModalState: ModalStateSetter;
    setRulesetModalState: ModalStateSetter;
  };
}

const FormType = () => {
  const { eventTriggerState, setRulesetModalState, setCreateModalState } =
    useContext(ModalContext);

  return (
    <div>
      {eventTriggerState === "mail" && <MailFormType />}
      {eventTriggerState === "calendar" && <CalendarFormType />}
      {eventTriggerState === "github" && (
        <GitHubFormType
          modals={{ setCreateModalState, setRulesetModalState }}
        />
      )}
    </div>
  );
};

const MailFormType = () => <div>this is a mail only form</div>;

const CalendarFormType = () => <div>this is a calendar only form</div>;
const GitHubFormType = ({ modals }: GitHubFormTypeProps) => {
  const { setCreateModalState, setRulesetModalState } = modals;
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const createWebhook = api.webhook.createWebhook.useMutation();
  const createAutomation = api.automation.createAutomation.useMutation();
  const userAutomations = api.automation.getUserAutomations.useQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (loading) {
      toast.dismiss();
      toast.error("Stop spamming 😡");
    } else {
      if (!session) {
        toast.dismiss();
        toast.error("Log Out and Log Back In");
        setLoading(false);
        return;
      }
      toast.dismiss();
      toast.loading("Reviewing your conditions and permissions...");

      // passing accessToken is necessary because DB access token can be stale which can cause 401: Bad Credentials
      const createWebhookResultObject = await createWebhook.mutateAsync({
        accessToken: session.user.accessToken,
      });

      if (createWebhookResultObject.error) {
        if (createWebhookResultObject.status === 404) {
          toast.dismiss();
          toast.error(
            "Conditions are invalid. Double check what you've written and make sure you have the right permissions!"
          );
          setLoading(false);
          return;
        } else if (createWebhookResultObject.status === 422) {
          toast.dismiss();
          toast.error("This exact automation already exists!");
          setLoading(false);
          return;
        } else if (createWebhookResultObject.status === 500) {
          toast.dismiss();
          toast.error("Log Out and Log Back In");
          setLoading(false);
          return;
        }
      } else {
        try {
          await createAutomation.mutateAsync({
            name: "issue on exotica repo",
            desc: "if user creates issue on exotica, send me an email",
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            webhookID: createWebhookResultObject.data!, // this will have data guaranteed
            actionType: "email",
            condition: "issues",
          });
        } catch (e) {
          toast.dismiss();
          toast.error(
            "Credentials are good but there was an error creating the automation. Log out, log back in, and try again!"
          );
          setLoading(false);
          return;
        }
      }

      toast.dismiss();
      toast.success("Automation Created", {
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
      setCreateModalState({ open: false });
      setRulesetModalState({ open: false });
    }
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        handleSubmit(e);
      }}
    >
      <div>
        <label htmlFor="eventType" className="block font-medium">
          Type of Event:
        </label>
        <select
          id="eventType"
          name="eventType"
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="" disabled>
            Select event trigger here...
          </option>
          <option value="issueCreated">Issue Created in Repository</option>
          {/* more options */}
        </select>
      </div>
      <div>
        <label htmlFor="ifCondition" className="block font-medium">
          If:
        </label>
        <select
          id="ifCondition"
          name="ifCondition"
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="" disabled>
            Condition 1...
          </option>
          <option value="occured">Occured on</option>
          {/* more options */}
        </select>
      </div>
      <div>
        <label htmlFor="Condition" className="block font-medium"></label>
        <select
          id="Condition"
          name="ifCondition"
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="condition1" disabled></option>
          <option value="condition1">Weekday</option>
          {/* more options */}
        </select>
      </div>
      <div>
        <label htmlFor="elseCondition" className="block font-medium">
          Then:
        </label>
        <select
          id="elseCondition"
          name="elseCondition"
          className="w-full rounded border border-gray-300 px-3 py-2"
        >
          <option value="condition2" disabled>
            Condition 2
          </option>
          <option value="condition2">Email me with more information</option>
          {/* more options */}
        </select>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          id="repeatCheckbox"
          name="repeat"
          className="mr-2"
        />
        <label htmlFor="repeatCheckbox" className="font-medium">
          Repeat
        </label>
      </div>
      <button
        className="mr-2 rounded bg-blue-500 px-4 py-2 text-white"
        type="submit"
      >
        Create Automation
      </button>
    </form>
  );
};

export default FormType;
