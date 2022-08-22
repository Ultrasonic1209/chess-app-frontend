import Image from "next/image";
import Main from "../../components/Main";

export default function Preferences() {
    return (
      <Main title="Preferences">
        <h2>Preferences</h2>
        <p>test</p>
        <Image src={"/lol.png"} alt={"image that doesnt exist, for offline placeholder testing"}></Image>
      </Main>
    );
}