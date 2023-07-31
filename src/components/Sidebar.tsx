import CreateAutomationModal from "./CreateAutomationModal";
import { signOut } from "next-auth/react";
import { useContext } from "react";
import { ModalContext } from "~/state/ModalContext";
import RulesetAutomationModal from "./RulesetAutomationModal";
import Image from "next/image";

const Sidebar = () => {
  const { createModalState, rulesetModalState, setCreateModalState } =
    useContext(ModalContext);

  return (
    <div className="relative left-3 top-5 flex h-[95%] w-[300px] flex-col border-r-2 border-amber-950">
      <div className="relative top-5 flex">
        <div className="relative bottom-2 left-6 mr-2 h-16 w-24 -rotate-[20deg]">
          <Image src={"/bread-logo.png"} alt="bread logo" fill />
        </div>
        <h3 className="absolute right-16 top-3 font-greatvibes text-3xl text-amber-950">
          Bread
        </h3>
      </div>
      <br />
      <div className="text-center">
        <button
          onClick={() => {
            setCreateModalState({ open: true });
          }}
          className="my-5 rounded-md bg-green-500 px-12 py-3 text-white transition-all hover:scale-105 hover:bg-green-400"
        >
          + Create
        </button>
      </div>
      {createModalState.open && <CreateAutomationModal />}
      {rulesetModalState.open && <RulesetAutomationModal />}
      <div className="relative top-[38rem] mx-auto">
        <button
          className="rounded-md border-2 border-amber-950 bg-mainBackground px-12 py-3 text-amber-950 transition-all hover:scale-105 hover:bg-gray-50"
          onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            signOut();
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
