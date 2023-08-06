import { useSession } from "next-auth/react";
import React, { useContext, useState } from "react";
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

const MailFormType = () => (
  <div className="my-20 text-center text-4xl text-white">
    Mail feature coming soon!
  </div>
);

const CalendarFormType = () => (
  <div className="my-20 text-center text-4xl text-white">
    Calendar feature coming soon!
  </div>
);
const GitHubFormType = ({ modals }: GitHubFormTypeProps) => {
  const { setCreateModalState, setRulesetModalState } = modals;
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const createWebhook = api.webhook.createWebhook.useMutation();
  const createAutomation = api.automation.createAutomation.useMutation();
  const userAutomations = api.automation.getUserAutomations.useQuery();

  const [owner, setOwner] = useState("");
  const [repositoryEventSelected, setRepositoryEventSelected] = useState(false);
  const [repositoryName, setRepositoryName] = useState("");
  const [ifCondition, setIfCondition] = useState<
    "issues" | "pull_request" | "push" | "star" | ""
  >("");
  const [thenCondition, setThenCondition] = useState<"email" | "">("");

  const [automationName, setAutomationName] = useState("");
  const [automationDescription, setAutomationDescription] = useState("");

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
        repository: repositoryName,
        events: ifCondition,
        owner,
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
            name: automationName,
            desc: automationDescription,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            webhookID: createWebhookResultObject.data!, // this will have data guaranteed
            actionType: thenCondition,
            condition: ifCondition,
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

  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "repository") {
      setRepositoryEventSelected(true);
    }
  };

  const handleSetIfCondition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventValue = e.target.value;
    if (
      eventValue === "issues" ||
      eventValue === "pull_request" ||
      eventValue === "push" ||
      eventValue === "star"
    ) {
      setIfCondition(eventValue);
    } else {
      setIfCondition("");
    }
  };

  const handleSetThenCondition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const eventValue = e.target.value;
    if (eventValue === "email") {
      setThenCondition(eventValue);
    } else {
      setThenCondition("");
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
      <div className="relative">
        <label htmlFor="eventType" className="block font-medium text-white">
          Type of Event:
        </label>
        <select
          id="eventType"
          name="eventType"
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
          onChange={(e) => handleEventTypeChange(e)}
        >
          <option value="" disabled selected>
            Select event trigger here...
          </option>
          <option value="repository">On Repository</option>
          {/* more options */}
        </select>
      </div>
      {repositoryEventSelected ? (
        <>
          <div>
            <input
              type="text"
              required
              placeholder="Enter Owner Name..."
              onChange={(e) => setOwner(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          <div>
            <input
              type="text"
              required
              placeholder="Enter Repository Name..."
              onChange={(e) => setRepositoryName(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
        </>
      ) : null}
      <div>
        <label htmlFor="ifCondition" className="block font-medium text-white">
          If:
        </label>
        <select
          id="ifCondition"
          name="ifCondition"
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
          onChange={(e) => handleSetIfCondition(e)}
        >
          <option value="" disabled selected>
            Condition...
          </option>
          <option value="issues">Issue Created</option>
          <option value="pull_request">Pull Request Created</option>
          <option value="star">Stars Repo</option>
          <option value="push">Push Code</option>
          {/* more options */}
        </select>
      </div>
      <div>
        <label htmlFor="elseCondition" className="block font-medium text-white">
          Then:
        </label>
        <select
          id="elseCondition"
          name="elseCondition"
          className="w-full rounded border border-gray-300 px-3 py-2"
          required
          onChange={(e) => handleSetThenCondition(e)}
        >
          <option value="condition2" disabled selected>
            Notify Me By...
          </option>
          <option value="email">Email me with more information</option>
          {/* more options */}
        </select>
      </div>
      <div>
        <label htmlFor="" className="block font-medium text-white">
          Automation:
        </label>
        <div>
          <input
            type="text"
            placeholder="Automation Name"
            required
            className="w-full rounded border border-gray-300 px-3 py-2"
            onChange={(e) => setAutomationName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            required
            placeholder="Automation Description"
            className="mt-4 w-full rounded border border-gray-300 px-3 py-2"
            onChange={(e) => setAutomationDescription(e.target.value)}
          />
        </div>
      </div>
      <button
        className="absolute bottom-5 right-5 mr-2 rounded bg-blue-500 px-4 py-2 text-white transition-all hover:scale-[102%]"
        type="submit"
      >
        Create Automation
      </button>
    </form>
  );
};

export default FormType;
