import Main from "../../components/Main";
import useLocalStorage from "../../components/useLocalStorage";

import { Form, FloatingLabel } from "react-bootstrap";

export default function Preferences() {

  const [boardOrientation, setBoardOrientation] = useLocalStorage("boardOrientation", "1");

  return (
    <Main title="Preferences">
      <h2>Preferences</h2>
      <FloatingLabel controlId="orientationSelect" label="Board orientation">
        <Form.Select
          aria-label="Which side of the board would you like to be facing?"
          onChange={(ev) => setBoardOrientation(ev.target.value)}
          value={boardOrientation}
        >
          <option value={"1"}>My colour</option>
          <option value={"2"}>White</option>
          <option value={"3"}>Black</option>
        </Form.Select>
      </FloatingLabel>
    </Main>
  );
}