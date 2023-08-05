import { useContext } from "react";
import { ModalContext } from "~/state/ModalContext";
import FormType from "./FormType";
import { AiOutlineCloseCircle } from "react-icons/ai";

const RulesetAutomationModal = () => {
  const { setCreateModalState, setRulesetModalState } =
    useContext(ModalContext);

  const handleClose = () => {
    setCreateModalState({ open: false });
    setRulesetModalState({ open: false });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="relative h-[800px] w-[500px] rounded-lg border-2 border-amber-950 bg-amber-900 p-6 shadow-lg">
        <h3 className="mb-4 text-center text-3xl font-bold text-slate-100">
          Ruleset Modal
        </h3>
        <FormType />
        <div className="absolute bottom-5 mt-4 flex justify-between">
          <button
            className="rounded bg-gray-300 px-4 py-2 text-gray-700 transition-all hover:scale-[102%]"
            type="button"
            aria-label="Go Back to Create Automation Modal"
            onClick={() => setRulesetModalState({ open: false })}
          >
            Go Back
          </button>
        </div>
        <button
          type="button"
          className="absolute right-6 top-6 text-4xl text-slate-100 transition-all hover:scale-105"
          aria-label="Close Both Create and Ruleset Modals"
          onClick={handleClose}
        >
          <AiOutlineCloseCircle />
        </button>
      </div>
    </div>
  );
};

export default RulesetAutomationModal;
