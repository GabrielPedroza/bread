import { getSession, signIn } from "next-auth/react";
import { type GetServerSideProps } from "next";
import Link from "next/link";

const Login = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mb-8 text-4xl">Login</div>
      <Link href="/" className="mb-4 text-blue-500 underline">
        Go to landing page
      </Link>
      <button
        className="mb-4 rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
        onClick={() => {
          //eslint-disable-next-line @typescript-eslint/no-floating-promises
          signIn("github");
        }}
      >
        Sign in with GitHub
      </button>
      <button
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          signIn("google");
        }}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;

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
