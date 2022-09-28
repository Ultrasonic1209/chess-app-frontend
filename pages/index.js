import Head from "next/head";
import Link from "next/link";

import { Button } from "react-bootstrap";
import Main from "../components/Main";

const IS_DEV = process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export default function Home() {
    const resetLocalStorage = async (ev) => {
      ev.target.disabled = true;
      
      const db = (await import('../db')).db
      db.delete().then(() => window.location.reload());
    }
    return (
      <>
        <Head>
          <link rel="canonical" href={IS_DEV ? 'https://dev.chessapp.ultras-playroom.xyz' : 'https://chessapp.ultras-playroom.xyz'} />
        </Head>
        <Main title="Home">
          <h2 data-testid="welcome">Welcome to Checkmate</h2>
          <p>Checkmate is a webapp intended to allow users to play games of Chess.</p>
          <p>You are able to play Chess with the computer, someone who is next to you, or someone over the Internet.</p>
          <p>Checkmate automatically registers itself with your web browser so you are able to use Checkmate whilst offline.</p>
          <p>To start playing, click <Link href="/game/new">here</Link> or use the topbar.</p>
          <p>Optionally, you may also create an account <Link href="/sign-up">here</Link>.</p>
          {
            IS_DEV
            ? <>
                <p><b>You are currently accessing a developer build of Checkmate. Things may break.</b></p>
                <Button variant="danger" onClick={resetLocalStorage}>Reset Local Storage</Button>
              </>
            : ''
          }
        </Main>
      </>
    );
  }