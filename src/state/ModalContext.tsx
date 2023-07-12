import { createContext, useState } from "react";
import { z } from "zod";

const ModalContextSchema = z.object({
  eventTrigger: z.enum(["mail", "calendar", "github", ""]),
  createModalOpened: z.boolean(),
  rulesetModalOpened: z.boolean(),
  setCreateModalOpened: z.function(z.tuple([z.boolean()])).returns(z.void()),
  setRulesetModalOpened: z.function(z.tuple([z.boolean()])).returns(z.void()),
  setEventTrigger: z.function(z.tuple([z.enum(["mail", "calendar", "github", ""])])).returns(z.void())
});

export type ModalContextType = z.infer<typeof ModalContextSchema>;

const InitialModalContext: ModalContextType = {
  eventTrigger: "",
  createModalOpened: false,
  rulesetModalOpened: false,
  setCreateModalOpened: () => {},
  setRulesetModalOpened: () => {},
  setEventTrigger: () => {}
};

export const ModalContext = createContext<ModalContextType>(InitialModalContext);

type ModalProviderProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
  const [eventTrigger, setEventTrigger] = useState<ModalContextType["eventTrigger"]>("");
  const [rulesetModalOpened, setRulesetModalOpened] = useState<boolean>(false);

  const contextValues: ModalContextType = {
    eventTrigger,
    createModalOpened,
    rulesetModalOpened,
    setCreateModalOpened: (value: boolean) => setCreateModalOpened(value),
    setRulesetModalOpened: (value: boolean) => setRulesetModalOpened(value),
    setEventTrigger: (value: ModalContextType["eventTrigger"]) => setEventTrigger(value)
  };

  return (
    <ModalContext.Provider value={contextValues}>{children}</ModalContext.Provider>
  );
};
