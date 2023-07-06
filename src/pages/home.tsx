import { type GetServerSideProps } from 'next'
import { getSession, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'

const Home = () => {
  const { data: session } = useSession()

  return (
    <>
        <div>Home</div>
        <Link href={'/'}>landing</Link>
        <button onClick={() => void signOut()}>logout</button>
        {session ? <p>{session.user.email ?? session.user.name}</p> : <p>no user</p>}
    </>
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