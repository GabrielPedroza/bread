import { useContext } from "react";
import { ModalContext } from "~/state/ModalContext";
import FormType from "./FormType";

const RulesetAutomationModal = () => {
  const { setCreateModalState, setRulesetModalState } =
    useContext(ModalContext);

  const handleClose = () => {
    setCreateModalState({ open: false });
    setRulesetModalState({ open: false });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="relative h-[800px] w-[500px] rounded-lg bg-orange-400 p-6 shadow-lg">
        <h3 className="mb-4 text-xl font-bold">Ruleset Modal</h3>
        <FormType />
        <div className="mt-4 flex justify-between">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-700"
            type="button"
            aria-label="Go Back to Create Automation Modal"
            onClick={() => setRulesetModalState({ open: false })}
          >
            Go Back
          </button>
        </div>
        <button
          type="button"
          className="absolute right-4 top-4 text-4xl text-black"
          aria-label="Close Both Create and Ruleset Modals"
          onClick={handleClose}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default RulesetAutomationModal;
