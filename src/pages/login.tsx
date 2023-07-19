import { getSession, signIn } from 'next-auth/react'
import { type GetServerSideProps } from 'next';
import Link from 'next/link';

const Login = () => {

  return (
      <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl mb-8">Login</div>
      <Link href="/" className="mb-4 text-blue-500 underline">
        Go to landing page
      </Link>
      <button
        className="px-4 py-2 mb-4 text-white bg-black rounded hover:bg-gray-800"
        onClick={() => {
          {/* eslint-disable-next-line @typescript-eslint/no-floating-promises */}
          signIn('github')
        }}
      >
        Sign in with GitHub
      </button>
      <button
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
        onClick={() => {
          {/* eslint-disable-next-line @typescript-eslint/no-floating-promises */}
          signIn('google')}
        }
      >
        Sign in with Google
      </button>
    </div>
  )
}

export default Login

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};