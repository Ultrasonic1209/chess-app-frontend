import Head from "next/head";
import { Button } from "react-bootstrap";
import Main from "../components/Main";

import { db } from "../db";

const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export default function Home() {
    const resetLocalStorage = (ev) => {
      ev.target.disabled = true;
      db.delete().then(() => window.location.reload());
    }
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
          <Button variant="danger" onClick={resetLocalStorage}>Reset Local Storage</Button>
        </Main>
      </>
    );
  }