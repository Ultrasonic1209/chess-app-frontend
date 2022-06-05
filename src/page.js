import { Suspense, useEffect } from "react";

// https://stackoverflow.com/a/52695341
const isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) || (window.navigator.standalone) || document.referrer.includes('android-app://');

const Page = (props) => {

  useEffect(() => {
    document.title = (props.title || "");
    if (!isInStandaloneMode()) {
      document.title += " | Checkmate";
    }
  }, [props.title]);

  return (
    <>
      <Suspense fallback={
        <main>
          <p>Loading {props.title}...</p>
        </main>
      }>
        {props.children}
      </Suspense>
    </>
  );
};

export default Page;