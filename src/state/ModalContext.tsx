import { createContext, useState } from "react";

type eventTriggerType = "mail" | "calendar" | "github" | "" 

type ModalContextType = {
  eventTriggerState: eventTriggerType;
  createModalState: {
    open: boolean;
  };
  rulesetModalState: {
    open: boolean;
  };
  setCreateModalState: (value: { open: boolean }) => void;
  setRulesetModalState: (value: { open: boolean }) => void;
  setEventTriggerState: (value: eventTriggerType) => void;
};


const InitialModalContext: ModalContextType = {
  eventTriggerState: "",
  createModalState: { open: false },
  rulesetModalState: { open: false },
  setCreateModalState: () => {},
  setRulesetModalState: () => {},
  setEventTriggerState: () => {}
};

export const ModalContext = createContext<ModalContextType>(InitialModalContext);

type ModalProviderProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [createModalState, setCreateModalState] = useState<{ open: boolean }>({ open: false });
  const [eventTriggerState, setEventTriggerState] = useState<ModalContextType['eventTriggerState']>('');
  const [rulesetModalState, setRulesetModalState] = useState<{ open: boolean }>({ open: false });

  const handleSetCreateModalState = ({ open }: { open: boolean }) => {
    setCreateModalState({ open });
    if (open === false) {
      setEventTriggerState('');
    }
  };

  const contextValues: ModalContextType = {
    eventTriggerState: eventTriggerState,
    createModalState: createModalState,
    rulesetModalState: rulesetModalState,
    setCreateModalState: handleSetCreateModalState,
    setRulesetModalState: ({ open }) => setRulesetModalState({ open }),
    setEventTriggerState: (value) => setEventTriggerState(value),
  };

  return (
    <ModalContext.Provider value={contextValues}>{children}</ModalContext.Provider>
  );
};


