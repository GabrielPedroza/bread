import { type MouseEvent, useContext } from "react"
import { ModalContext } from "~/state/ModalContext"

enum EventName {
  Mail = 'mail',
  GitHub = 'github',
  Calendar = 'calendar'
}

type eventType = {
  id: number;
  name: EventName;
  description: string;
}

type eventTypes = eventType[]

const CreateAutomationModal = () => {
  
  const { setCreateModalState, setRulesetModalState, setEventTriggerState } = useContext(ModalContext)
  
  const eventTypes: eventTypes = [
    { id: 1, name: EventName.Mail, description: 'Example: When an email was receieved...' },
    { id: 2, name: EventName.GitHub, description: 'Example: When a PR has been merged to a repository...' },
    { id: 3, name: EventName.Calendar, description: 'Example: When a meeting is canceled...' },
    // event types
  ];
  
  const handleClickedAutomation = (e: MouseEvent<HTMLDivElement>, eventType: eventType["name"]) => {
    setEventTriggerState(eventType)
    setRulesetModalState({ open: true })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-[15%] bg-slate-400">
      <div className="bg-blue-500 absolute w-[500px] h-[800px] z-10">
        <p>
          Create Modal
        </p>
        <button className="absolute right-4 top-4 text-3xl p-4" aria-label="Close Create Modal" type="button" onClick={() => setCreateModalState({ open: false })}>X</button>
        <div className="flex flex-col gap-4 p-4 mt-10">
          {eventTypes.map((eventType) => (
            <div key={eventType.id} className="border-2 p-4 cursor-pointer" onClick={(e) => handleClickedAutomation(e, eventType.name)}>
              <h3 className="text-xl font-bold capitalize">{eventType.name}</h3>
              <p>{eventType.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreateAutomationModal