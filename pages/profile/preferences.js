import Image from "next/image";
import Main from "../../components/Main";
import useLocalStorage from "../../components/useLocalStorage";

import { Form, FloatingLabel } from "react-bootstrap";

export default function Preferences() {

  const [boardOrientation, setBoardOrientation] = useLocalStorage("boardOrientation", null);
  
  return (
    <Main title="Preferences">
      <h2>Preferences</h2>
      <FloatingLabel controlId="orientationSelect" label="Board orientation">
      <Form.Select
        aria-label="Which side of the board would you like to be facing?"
        defaultValue={boardOrientation}
        onChange={setBoardOrientation}
      >
        <option>Choose board orientation</option>
        <option value={null}>My colour (default)</option>
        <option value={'white'}>White</option>
        <option value={'black'}>Black</option>
      </Form.Select>
    </FloatingLabel>
      <Image src={"/lol.png"} objectFit={"scale-down"} width={500} height={850} alt={"image that doesnt exist, for offline placeholder testing"}></Image>
    </Main>
  );
}