import { MouseEvent, useContext } from "react"
import { z } from "zod";
import { ModalContext, ModalContextType } from "~/state/ModalContext"

const eventTypeSchema = z.array(z.object({
  id: z.number(),
  name: z.enum(['Calendar', 'Mail', 'GitHub', '']),
  description: z.string()
}))

type eventTypes = z.infer<typeof eventTypeSchema>

const CreateAutomationModal = () => {
  
  const { setCreateModalOpened, setRulesetModalOpened, setEventTrigger } = useContext(ModalContext)
  
  const eventTypes: eventTypes = [
    { id: 1, name: 'Mail', description: 'Example: When an email was receieved...' },
    { id: 2, name: 'GitHub', description: 'Example: When a PR has been merged to a repository...' },
    { id: 3, name: 'Calendar', description: 'Example: When a meeting is canceled...' },
    // event types
  ];
  
  const handleClickedAutomation = (e: MouseEvent<HTMLDivElement>, eventType: eventTypes[0]["name"]) => {
    const eventTrigger = eventType.toLowerCase() as ModalContextType["eventTrigger"]
    setEventTrigger(eventTrigger)
    setRulesetModalOpened(true)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-[15%] bg-slate-400">
      <div className="bg-blue-500 absolute w-[500px] h-[800px] z-10">
        <p>
          Create Modal
        </p>
        <button className="absolute right-4 top-4 text-3xl p-4" aria-label="Close Create Modal" type="button" onClick={() => setCreateModalOpened(false)}>X</button>
        <div className="flex flex-col gap-4 p-4 mt-10">
          {eventTypes.map((eventType) => (
            <div key={eventType.id} className="border-2 p-4 cursor-pointer" onClick={(e) => handleClickedAutomation(e, eventType.name)}>
              <h3 className="text-xl font-bold">{eventType.name}</h3>
              <p>{eventType.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CreateAutomationModal