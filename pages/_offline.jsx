import Link from "next/link";
import Main from "../components/Main";

export default function Offline() {
  return (
    <Main title="Offline">
      <h2>Offline</h2>
      <p>You have attempted to access a page which is unavailable on your device.</p>
      <p>As a connection to the server could not be made, you will be unable to access this page until a connection can be re-established.</p>
      <p>In theory, this should <emp>never</emp> happen, but mistakes happen.</p>
      <p>Click <Link href="/">here</Link> or use the navigation bar to continue.</p>
    </Main>
  );
} 
