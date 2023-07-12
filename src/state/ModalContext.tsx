import { createContext, useState } from "react";
import { z } from "zod";

const ModalContextSchema = z.object({
  createModalOpened: z.boolean(),
  rulesetModalOpened: z.boolean(),
  setCreateModalOpened: z.function(z.tuple([z.boolean()])).returns(z.void()),
  setRulesetModalOpened: z.function(z.tuple([z.boolean()])).returns(z.void())
});

type ModalContextType = z.infer<typeof ModalContextSchema>;

const InitialModalContext: ModalContextType = {
  createModalOpened: false,
  rulesetModalOpened: false,
  setCreateModalOpened: () => {},
  setRulesetModalOpened: () => {}
};

export const ModalContext = createContext<ModalContextType>(InitialModalContext);

type ModalProviderProps = {
  children: React.ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [createModalOpened, setCreateModalOpened] = useState<boolean>(false);
  const [rulesetModalOpened, setRulesetModalOpened] = useState<boolean>(false);

  const contextValues: ModalContextType = {
    createModalOpened,
    rulesetModalOpened,
    setCreateModalOpened: (value: boolean) => setCreateModalOpened(value),
    setRulesetModalOpened: (value: boolean) => setRulesetModalOpened(value)
  };

  return (
    <ModalContext.Provider value={contextValues}>{children}</ModalContext.Provider>
  );
};
