import { useContext } from "react";
import { ModalContext } from "~/state/ModalContext";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast } from "react-hot-toast";

enum EventName {
  Mail = "mail",
  GitHub = "github",
  Calendar = "calendar",
}

type eventType = {
  id: number;
  name: EventName;
  description: string;
};

type eventTypes = eventType[];

const CreateAutomationModal = () => {
  const { setCreateModalState, setRulesetModalState, setEventTriggerState } =
    useContext(ModalContext);

  const eventTypes: eventTypes = [
    {
      id: 1,
      name: EventName.GitHub,
      description: "Example: When a PR has been merged to a repository...",
    },
    {
      id: 2,
      name: EventName.Mail,
      description: "Example: When an email was received...",
    },
    {
      id: 3,
      name: EventName.Calendar,
      description: "Example: When a meeting is canceled...",
    },
    // event types
  ];

  const handleClickedAutomation = (eventType: eventType["name"]) => {
    if (eventType !== EventName.GitHub) {
      toast.dismiss();
      toast.error("Feature coming out soon");
      return;
    }
    setEventTriggerState(eventType);
    setRulesetModalState({ open: true });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900 bg-opacity-[15%] backdrop-blur-sm">
      <div className="absolute z-10 h-[800px] w-[500px] rounded-lg border-2 border-amber-950 bg-amber-800">
        <button
          className="absolute right-4 top-4 cursor-pointer p-2 text-4xl text-slate-100 transition-all hover:scale-110"
          aria-label="Close Create Modal"
          type="button"
          onClick={() => setCreateModalState({ open: false })}
        >
          <AiOutlineCloseCircle />
        </button>
        <h3 className="mt-6 text-center text-3xl font-bold text-slate-100">
          Create Automation
        </h3>
        <div className="mt-10 flex flex-col gap-4 p-4 text-amber-950">
          {eventTypes.map((eventType) => (
            <div
              key={eventType.id}
              className="cursor-pointer rounded-md border-2 border-amber-950 bg-slate-100 p-4 transition-all hover:my-1 hover:scale-[102%]"
              onClick={() => handleClickedAutomation(eventType.name)}
            >
              <h3 className="text-xl font-bold capitalize">{eventType.name}</h3>
              <p>{eventType.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateAutomationModal;
