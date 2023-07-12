import { type GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Navbar from "~/components/Navbar";

export default function Home() {

  return (
		<>
			<Head>
				<title>Bread</title>
				<meta name="description" content="Generated by Gabriel Pedroza" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar />
      <div className="flex justify-center align-middle flex-col text-center mt-10">
        <h1 className="text-7xl">Bread</h1>
        <div className="flex justify-center align-middle flex-col">
          <h3>An Automation Tool</h3>
          <h3>For Engineers</h3>
        </div>
      </div>
		</>
	);
}

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