import { useContext } from "react"
import { ModalContext } from "~/state/ModalContext"

const CreateAutomationModal = () => {

  const { setCreateModalOpened, setRulesetModalOpened } = useContext(ModalContext)

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-[15%] bg-slate-400">
      <div className="bg-blue-500 absolute w-[500px] h-[800px] z-10">
        <p>
          Create Modal
        </p>
        <button className="absolute right-4 top-4 text-3xl p-4" onClick={() => setCreateModalOpened(false)}>X</button>
        <p>Different types of events user can do (mail, calendar, github)</p>
        <button className="absolute bottom-4 right-4" onClick={() => setRulesetModalOpened(true)}>continue to ruleset modal</button>
      </div>
    </div>
  )
}

export default CreateAutomationModal