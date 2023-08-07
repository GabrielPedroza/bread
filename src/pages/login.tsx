import { getSession, signIn } from "next-auth/react";
import { type GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="relative bottom-8 mb-8 font-greatvibes text-7xl text-amber-950">
        Login
      </div>
      <div className="h-4/6 w-2/6 rounded-lg border-2 border-amber-950">
        <Link href="/" className="absolute mb-4 text-blue-500 underline">
          <div className="relative bottom-20 left-36 mr-2 h-36 w-48 -rotate-[20deg] transition-all hover:scale-[175%] scale-[150%]">
            <Image src={"/bread-logo-bg-removed.png"} alt="bread logo" fill />
          </div>
        </Link>
        <div className="relative top-40 flex flex-col justify-center">
          <h3 className="mb-8 text-center font-mono text-xl font-bold">
            Step 1: Install the Bread GitHub App
          </h3>
          <div className="m-auto">
            <Link href={"https://github.com/apps/bread"}>
              <button className="mb-4 rounded bg-amber-950 px-6 py-4 text-center text-white transition-all hover:scale-105 hover:bg-amber-900">
                Install Bread
              </button>
            </Link>
          </div>
          <br />
          <h3 className="mb-8 text-center font-mono text-xl font-bold">
            Step 2: Login with GitHub
          </h3>
          <div className="m-auto">
            <button
              className="mb-4 rounded bg-amber-950 px-8 py-4 text-white transition-all hover:scale-105 hover:bg-amber-900"
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
