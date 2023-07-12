import { type GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'
import RecommendedAutomations from '~/components/RecommendedAutomations'
import Sidebar from '~/components/Sidebar'
import UserAutomations from '~/components/UserAutomations'

const Home = () => {

  return (
    <div className='flex border-4 border-green-300 h-screen w-screen'>
        <Sidebar />
        <div className='flex flex-col w-screen h-screen justify-center'>
          <RecommendedAutomations />
          <UserAutomations />
        </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default Home