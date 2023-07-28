import { useSession } from "next-auth/react";
import { useContext } from "react";
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
  const { data: session } = useSession();

  const createWebhook = api.webhook.createWebhook.useMutation();
  const createAutomation = api.automation.createAutomation.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    if (!session) return "log out and log back in";
    e.preventDefault();

    // passing accessToken is necessary because DB access token can be stale which can cause 401: Bad Credentials
    const createWebhookResult = await createWebhook.mutateAsync({
      accessToken: session.user.accessToken,
    });
    if (createWebhookResult === false) {
      console.log("log out and log back in");
      return;
    }

    if (createWebhookResult === 422) {
      console.log("hook already exists");
      return;
    }

    createAutomation.mutate({
      name: "issue on exotica repo",
      desc: "if user creates issue on exotica, send me an email",
      webhookID: createWebhookResult,
      actionType: "email",
      condition: "issues",
    });

    setCreateModalState({ open: false });
    setRulesetModalState({ open: false });
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
