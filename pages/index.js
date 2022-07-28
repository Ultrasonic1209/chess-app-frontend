import Head from "next/head";
import Main from "../components/Main";

const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export default function Home() {
    return (
      <>
        <Head>
          <link rel="canonical" href={IS_DEV ? 'https://dev.chessapp.ultras-playroom.xyz' : 'https://chessapp.ultras-playroom.xyz'} />
        </Head>
        <Main title="Home">
          <h2>Welcome to Checkmate</h2>
          <p>This area is under construction. Check back soon!</p>
          <p>In the future, this website will offer many different ways to play chess.</p>
          {IS_DEV ? <p><b>You are currently accessing a developer build of Checkmate. Things may break.</b></p> : ''}
        </Main>
      </>
    );
  }