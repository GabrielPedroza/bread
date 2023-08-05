import { createContext, useState } from "react";

type eventTriggerType = "mail" | "calendar" | "github" | "";

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

type ModalContextTypeWithCollapsedReccommendedAutomationsState =
  ModalContextType & {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
  };

const InitialModalContext: ModalContextTypeWithCollapsedReccommendedAutomationsState =
  {
    eventTriggerState: "",
    isCollapsed: false,
    createModalState: { open: false },
    rulesetModalState: { open: false },
    setIsCollapsed: () => {},
    setCreateModalState: () => {},
    setRulesetModalState: () => {},
    setEventTriggerState: () => {},
  };

export const ModalContext =
  createContext<ModalContextTypeWithCollapsedReccommendedAutomationsState>(
    InitialModalContext
  );

type ModalProviderProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [createModalState, setCreateModalState] = useState<{ open: boolean }>({
    open: false,
  });
  const [eventTriggerState, setEventTriggerState] =
    useState<ModalContextType["eventTriggerState"]>("");
  const [rulesetModalState, setRulesetModalState] = useState<{ open: boolean }>(
    { open: false }
  );

  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const handleSetCreateModalState = ({ open }: { open: boolean }) => {
    setCreateModalState({ open });
    if (open === false) {
      setEventTriggerState("");
    }
  };

  const contextValues: ModalContextTypeWithCollapsedReccommendedAutomationsState =
    {
      isCollapsed,
      eventTriggerState: eventTriggerState,
      createModalState: createModalState,
      rulesetModalState: rulesetModalState,
      setIsCollapsed: (value) => setIsCollapsed(value),
      setCreateModalState: handleSetCreateModalState,
      setRulesetModalState: ({ open }) => setRulesetModalState({ open }),
      setEventTriggerState: (value) => setEventTriggerState(value),
    };

  return (
    <ModalContext.Provider value={contextValues}>
      {children}
    </ModalContext.Provider>
  );
};
