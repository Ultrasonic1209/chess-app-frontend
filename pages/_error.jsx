import Main from "../components/Main";
import HttpCat from "../components/HttpCat";

const statusCodes = {
  400: "Bad request.",
  404: "Page not found.",
  405: "Request method not allowed.",
  500: "Internal server error.",
};

function Error({ statusCode, message }) {
  return (
    <Main title={statusCode ? statusCode : "Error"}>
      <h2>{statusCode ? `HTTP ${statusCode}` : "Internal Client Error"}</h2>

      <p>{message}</p>

      {statusCode ? <HttpCat statuscode={statusCode} /> : undefined}
    </Main>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = (statusCodes[statusCode] ||= "How'd you manage that?"); // logical or assignment, why does it look so ugly tho
  return { statusCode, message };
};

export default Error;
