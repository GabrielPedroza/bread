import { useContext } from "react"
import { ModalContext } from "~/state/ModalContext"

const RulesetAutomationModal = () => {

  const { setCreateModalOpened, setRulesetModalOpened } = useContext(ModalContext)

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="bg-orange-500 absolute w-[500px] h-[800px] z-100">
        <p>
          Ruleset Modal
        </p>
        <button className="absolute right-4 top-4 text-3xl p-4" onClick={() => {
          setRulesetModalOpened(false)
          setCreateModalOpened(false)
        }}>X</button>
        <p>if else done here</p>
        <button className="absolute bottom-4 right-4" onClick={() => {
          setCreateModalOpened(false)
          setRulesetModalOpened(false)
        }}>Create Automation</button>
        <button className="absolute bottom-4 left-4" onClick={() => setRulesetModalOpened(false)}>go back</button>
      </div>
    </div>
  )
}

export default RulesetAutomationModal