import { getSession, signIn } from "next-auth/react";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="mb-8 text-7xl relative bottom-8 text-amber-950 font-greatvibes">Login</div>
      <div className="border-2 border-amber-950 rounded-lg w-2/6 h-4/6">
        <Link href="/" className="absolute mb-4 text-blue-500 underline">
          <div className="relative mr-2 h-36 w-48 -rotate-[20deg] bottom-20 left-36 hover:scale-95 transition-all">
            <Image src={'/bread-logo.png'} alt="bread logo" fill />
          </div>
        </Link>
        <div className="relative flex justify-center flex-col top-40">
          <h3 className="text-center font-bold font-mono text-xl mb-8">Step 1: Install the Bread GitHub App</h3>
          <div className="m-auto">
            <Link href={"https://github.com/apps/bread"}>
              <button className="mb-4 rounded bg-amber-950 px-6 py-4 text-white text-center transition-all hover:bg-amber-900">
              Install Bread
              </button>
            </Link>
          </div>
          <br />
          <h3 className="text-center font-bold font-mono text-xl mb-8">Step 2: Login with GitHub</h3>
          <div className="m-auto">
            <button
              className="mb-4 rounded bg-amber-950 text-white transition-all hover:bg-amber-900 px-8 py-4"
              onClick={() => {
                //eslint-disable-next-line @typescript-eslint/no-floating-promises
                signIn("github");
              }}
            >
              Sign in with GitHub
            </button>
          </div>
        </div>
      </div>
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
