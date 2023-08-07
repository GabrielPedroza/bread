import { createContext, useState } from "react";

type eventTriggerType = "mail" | "calendar" | "github" | "";

export type GitHubRulesetFormEventType = "" | "repository";

type RulesetFormIfConditionType =
  | "issues"
  | "push"
  | "star"
  | "pull_request"
  | "";

type RulesetFormThenActionType = "email" | "";

type ModalContextType = {
  eventTriggerState: eventTriggerType;
  createModalState: {
    open: boolean;
  };
  rulesetModalState: {
    open: boolean;
  };
  repositoryEventSelected: boolean;
  emailSelected: boolean;
  rulesetFormIfCondition: RulesetFormIfConditionType;
  rulesetFormThenAction: RulesetFormThenActionType;
  GitHubRulesetFormEventActionType: GitHubRulesetFormEventType;
  setRulesetFormIfCondition: (value: RulesetFormIfConditionType) => void;
  setRulesetFormThenAction: (value: RulesetFormThenActionType) => void;
  setCreateModalState: (value: { open: boolean }) => void;
  setRulesetModalState: (value: { open: boolean }) => void;
  setEventTriggerState: (value: eventTriggerType) => void;
  setGitHubRulesetFormEventActionType: (
    value: GitHubRulesetFormEventType
  ) => void;
  setRepositoryEventSelected: (value: boolean) => void;
  setEmailSelected: (value: boolean) => void;
};

type ModalContextTypeWithCollapsedReccommendedAutomationsState =
  ModalContextType & {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
  };

const InitialModalContext: ModalContextTypeWithCollapsedReccommendedAutomationsState =
  {
    eventTriggerState: "",
    rulesetFormThenAction: "",
    emailSelected: false,
    repositoryEventSelected: false,
    isCollapsed: false,
    createModalState: { open: false },
    rulesetModalState: { open: false },
    GitHubRulesetFormEventActionType: "",
    rulesetFormIfCondition: "",
    setRulesetFormIfCondition: () => {},
    setRulesetFormThenAction: () => {},
    setRepositoryEventSelected: () => {},
    setIsCollapsed: () => {},
    setEmailSelected: () => {},
    setCreateModalState: () => {},
    setRulesetModalState: () => {},
    setEventTriggerState: () => {},
    setGitHubRulesetFormEventActionType: () => {},
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

  const [emailSelected, setEmailSelected] = useState(false);
  const [rulesetFormThenAction, setRulesetFormThenAction] =
    useState<RulesetFormThenActionType>("");
  const [rulesetFormIfCondition, setRulesetFormIfCondition] =
    useState<RulesetFormIfConditionType>("");

  const [
    GitHubRulesetFormEventActionType,
    setGitHubRulesetFormEventActionType,
  ] = useState<GitHubRulesetFormEventType>("");
  const [repositoryEventSelected, setRepositoryEventSelected] =
    useState<boolean>(false);

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
      rulesetFormIfCondition,
      rulesetFormThenAction,
      emailSelected,
      eventTriggerState: eventTriggerState,
      repositoryEventSelected,
      GitHubRulesetFormEventActionType,
      createModalState: createModalState,
      rulesetModalState: rulesetModalState,
      setRulesetFormIfCondition: (value) => setRulesetFormIfCondition(value),
      setRulesetFormThenAction: (value) => setRulesetFormThenAction(value),
      setEmailSelected: (value) => setEmailSelected(value),
      setIsCollapsed: (value) => setIsCollapsed(value),
      setCreateModalState: handleSetCreateModalState,
      setRulesetModalState: ({ open }) => setRulesetModalState({ open }),
      setEventTriggerState: (value) => setEventTriggerState(value),
      setGitHubRulesetFormEventActionType: (value) =>
        setGitHubRulesetFormEventActionType(value),
      setRepositoryEventSelected: (value) => setRepositoryEventSelected(value),
    };

  return (
    <ModalContext.Provider value={contextValues}>
      {children}
    </ModalContext.Provider>
  );
};
