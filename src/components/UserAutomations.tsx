import { api } from "~/utils/api";

const UserAutomations = () => {
  const userAutomations = api.automation.getUserAutomations.useQuery();
  const deleteAutomation = api.automation.deleteAutomation.useMutation();

  return (
    <div className="mx-auto mt-5 h-[45%] w-11/12 border-4 border-blue-600">
      {userAutomations.data?.length ? (
        userAutomations.data?.map((automation, i) => (
          <div className="flex justify-evenly" key={i}>
            <div>{automation.name}</div>
            <div>{automation.desc}</div>
            <div>{automation.status}</div>
            <button
              onClick={() => {
                {
                  /* eslint-disable-next-line @typescript-eslint/no-floating-promises */
                }
                deleteAutomation.mutate({ hookID: automation.webhookID });
              }}
            >
              delete
            </button>
          </div>
        ))
      ) : userAutomations.isLoading ? (
        <div>loading...</div>
      ) : (
        <div>Waiting for your first creation!</div>
      )}
    </div>
  );
};

export default UserAutomations;
