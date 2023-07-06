import { getSession, signIn } from 'next-auth/react'
import { type GetServerSideProps } from 'next';
import Link from 'next/link';

const Login = () => {

  return (
    <>
      <div>Login</div>
      <Link href={'/'}>go to landing page</Link>
      <br />
      <button onClick={() => void signIn('github')}>sign in with github</button>
      <br />
      <button onClick={() => void signIn('google')}>sign in with google</button>
      <br />
    </>
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