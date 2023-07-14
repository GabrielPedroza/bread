import Link from "next/link"
import CreateAutomationModal from "./CreateAutomationModal"
import { signOut } from "next-auth/react"
import { useContext } from "react"
import { ModalContext } from "~/state/ModalContext"
import RulesetAutomationModal from "./RulesetAutomationModal"

const Sidebar = () => {

  const { createModalState, rulesetModalState, setCreateModalState } = useContext(ModalContext)

  return (
    <div className="w-[300px] border-4 border-purple-400 h-full">
      <Link href={'/'}>Bread</Link>
      <br />
      <button onClick={() => {
        setCreateModalState({ open: true })
      }} className="bg-green-400 px-5 py-3 text-white rounded-md my-5">Create</button>
      { createModalState.open && <CreateAutomationModal /> }
      { rulesetModalState.open && <RulesetAutomationModal /> }
      <div>Sidebar</div>
      <button onClick={() => void signOut()}>logout</button>
    </div>
  )
}

export default Sidebar