import Head from "next/head";
import { Suspense } from "react";

// https://stackoverflow.com/a/52695341
const isInStandaloneMode = () => {
  if (typeof window === "undefined") { return false; }
  if (!window.matchMedia) { return (window.navigator.standalone) || document.referrer.includes('android-app://') }

  return (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');
}

const Main = (props) => {

  var title = (props.title || "");

  if (!(typeof window === 'undefined') && !isInStandaloneMode()) {
    title += " | Checkmate";
  }

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Suspense fallback={
        <main>
          <p>Loading {props.title}...</p>
        </main>
      }>
        <main>
          {props.children}
        </main>
      </Suspense>
    </>
  );
};

export default Main;