import { useContext } from "react";
import { HiOutlineArrowNarrowDown } from "react-icons/hi";
import { BiCollapseVertical } from "react-icons/bi";
import { ModalContext } from "~/state/ModalContext";

enum EventName {
  Repository = "repository",
}

type AutomationType = {
  id: number;
  type: EventName;
  ifThis: string;
  thenThat: string;
  ifThisEvent: ("issue" | "pull_request" | "star" | "push")[]; // an array of any of these combinations
  thenThatEvent: "email";
};

type AutomationsType = AutomationType[];

const RecommendedAutomations = () => {
  const { isCollapsed, setIsCollapsed } = useContext(ModalContext);
  const automationRecommendations: AutomationsType = [
    {
      id: 1,
      type: EventName.Repository,
      ifThis: "Issue or PR created on repo",
      thenThat: "Email me with more info",
      ifThisEvent: ["issue", "pull_request"],
      thenThatEvent: "email",
    },
    {
      id: 2,
      type: EventName.Repository,
      ifThis: "Someone stars on repo",
      thenThat: "Email me about the user",
      ifThisEvent: ["star"],
      thenThatEvent: "email",
    },
    {
      id: 3,
      type: EventName.Repository,
      ifThis: "Someone pushes code on repo",
      thenThat: "Email me on the code merged",
      ifThisEvent: ["push"],
      thenThatEvent: "email",
    },
  ];
  return (
    <div
      className={`mx-auto  -mt-7 w-11/12 rounded-lg border-2 border-amber-950 transition-all ${
        isCollapsed ? "h-[5%]" : "h-[45%]"
      } `}
    >
      <div
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="relative flex cursor-pointer justify-end p-2 text-2xl"
      >
        <div className="absolute left-4 text-xl text-amber-950">
          Recommended Automations
        </div>
        <BiCollapseVertical />
      </div>
      <div
        className={`mt-7 flex h-[70%] justify-around ${
          isCollapsed ? "hidden" : ""
        }`}
      >
        {automationRecommendations.map((automation, i) => (
          <div
            key={i}
            className="h-[100%] w-[31%] cursor-pointer rounded-lg border-4 border-orange-900 p-4 text-center text-2xl text-amber-950 transition-all hover:scale-[102%]"
          >
            <h3 className="mt-14">{automation.ifThis}</h3>
            <HiOutlineArrowNarrowDown className="mx-auto my-2" />
            <h3>{automation.thenThat}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedAutomations;
