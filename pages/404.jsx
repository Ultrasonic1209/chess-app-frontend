import Main from "../components/Main";
import HttpCat from "../components/HttpCat";

export default function NotFound() {
    return (
      <Main title="404">
        <h2>HTTP 404</h2>
        <p>Page not found.</p>
        <HttpCat statuscode={404} />
      </Main>
    );
  } 
