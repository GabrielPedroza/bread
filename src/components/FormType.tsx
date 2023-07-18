import { useSession } from "next-auth/react"
import { useContext } from "react"
import { ModalContext } from "~/state/ModalContext"
import { api } from "~/utils/api"

type ModalStateSetter = (value: { open: boolean }) => void

interface GitHubFormTypeProps {
  modals: {
    setCreateModalState: ModalStateSetter
    setRulesetModalState: ModalStateSetter
  }
}

const FormType = () => {
  
  const { eventTriggerState, setRulesetModalState, setCreateModalState } = useContext(ModalContext);

  return (
    <div>
      {eventTriggerState === "mail" && <MailFormType />}
      {eventTriggerState === "calendar" && <CalendarFormType />}
      {eventTriggerState === "github" && <GitHubFormType modals={{ setCreateModalState, setRulesetModalState }} />}
    </div>
  );
};


const MailFormType = () => (
  <div>
    this is a mail only form
  </div>
)

const CalendarFormType = () => (
  <div>
    this is a calendar only form
  </div>
)
const GitHubFormType = ({ modals }: GitHubFormTypeProps) => {

  const { setCreateModalState, setRulesetModalState } = modals
  const { data: session } = useSession()
  const result = api.webhook.createWebhook.useMutation()
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // create automation and webhook logic func calls here
    // show some UI if worked for failed
    result.mutate({ accessToken: session?.user.accessToken! })

    setCreateModalState({ open: false })
    setRulesetModalState({ open: false })
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="eventType" className="block font-medium">
            Type of Event:
          </label>
          <select
            id="eventType"
            name="eventType"
            className="border border-gray-300 rounded px-3 py-2 w-full"
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
            className="border border-gray-300 rounded px-3 py-2 w-full"
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
            className="border border-gray-300 rounded px-3 py-2 w-full"
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
            className="border border-gray-300 rounded px-3 py-2 w-full"
          >
            <option value="condition2" disabled>
              Condition 2
            </option>
            <option value="condition2">Email me with more information</option>
            {/* more options */}
          </select>
        </div>
        <div className="flex items-center">
          <input type="checkbox" id="repeatCheckbox" name="repeat" className="mr-2" />
          <label htmlFor="repeatCheckbox" className="font-medium">
            Repeat
          </label>
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" type="submit">
          Create Automation
        </button>
      </form>
  )
}

export default FormType