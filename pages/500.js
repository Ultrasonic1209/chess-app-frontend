import Main from "../components/Main";
import HttpCat from "../components/HttpCat";

export default function ServerError() {
    return (
      <Main title="500">
        <h2>HTTP 500</h2>
        <p>Internal server error.</p>
        <HttpCat statuscode={500} />
      </Main>
    );
  } 
