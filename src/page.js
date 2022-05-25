import { useEffect } from "react";

const Page = (props) => {
  useEffect(() => {
    document.title = (props.title || "") + " | Checkmate";
  }, [props.title]);
  return props.children;
};

export default Page;