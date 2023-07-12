import { useContext } from "react";
import { ModalContext } from "~/state/ModalContext";
import FormType from "./FormType";

const RulesetAutomationModal = () => {
  const { setCreateModalOpened, setRulesetModalOpened, setEventTrigger } = useContext(ModalContext);

  const handleClose = () => {
    setCreateModalOpened(false)
    setRulesetModalOpened(false)
    setEventTrigger("") // not neccessary but nice to know state is always up-to-date
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative bg-orange-400 rounded-lg shadow-lg p-6 w-[500px] h-[800px]">
        <h3 className="text-xl font-bold mb-4">Ruleset Modal</h3>
        <FormType />
        <div className="flex justify-between mt-4">
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
          type="button"
          aria-label="Go Back to Create Automation Modal"
          onClick={() => setRulesetModalOpened(false)}
        >
          Go Back
        </button>
        </div>
        <button type="button" className="absolute text-black top-4 right-4 text-4xl" aria-label="Close Both Create and Ruleset Modals" onClick={handleClose}>
          X
        </button>
      </div>
    </div>
  );
};

export default RulesetAutomationModal;
