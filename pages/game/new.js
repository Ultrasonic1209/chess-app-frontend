import Main from "../../components/Main";

import { useState } from "react";
import { Button, Container, ListGroup } from "react-bootstrap";

import { useOnlineStatus } from "../../contexts/OnlineStatus";
import { useToastContext } from "../../contexts/ToastContext";

export default function Preferences() {
    const isOnline = useOnlineStatus();
    const addToast = useToastContext();

    const [gamemode, setGamemode] = useState();
    const [difficulty, setDifficulty] = useState();
    const [starter, setStarter] = useState("ANY");

    const gamemodeOnClick = (ev) => setGamemode(ev.target.getAttribute("data-gamemode"));
    const difficultyOnClick = (ev) => setDifficulty(ev.target.getAttribute("data-difficulty"));
    const starterOnClick = (ev) => setStarter(ev.target.getAttribute("data-starter"));

    // eslint-disable-next-line no-unused-vars
    const createGame = (ev) => {
      switch (gamemode) {
        case "BOT":

          break;
        case "LOCAL":

          break;
        case "NET":
          
          break;
        default:
          addToast({
            "title": "Checkmate",
            "message": "Error: Unknown gamemode " + gamemode
          });
      }
      console.log(gamemode, difficulty, starter);
    }

    const difficultyEnabled = gamemode === "BOT";
    const starterEnabled = (difficultyEnabled && difficulty) || (!difficultyEnabled && gamemode);

    return (
      <Main title="New Game">
        <p>Gamemode: {gamemode}</p>
        <p>Difficulty: {(gamemode === "BOT") ? difficulty : 'N/A'}</p>
        <p>Starting colour: {starter}</p>
        <h2>New Game</h2>
        <Container id="selectGamemode" className="p-0 pt-3">
          <h5>Choose your gamemode</h5>
          <ListGroup horizontal="sm">
            <ListGroup.Item active={gamemode === "BOT"} onClick={gamemodeOnClick} data-gamemode="BOT" type="button" action>Vs. Bot</ListGroup.Item>
            <ListGroup.Item active={gamemode === "LOCAL"} onClick={gamemodeOnClick} data-gamemode="LOCAL" type="button" action>Vs. Player</ListGroup.Item>
            <ListGroup.Item active={gamemode === "NET"} onClick={gamemodeOnClick} data-gamemode="NET" type="button" action disabled={!isOnline}>Vs. Online Player</ListGroup.Item>
          </ListGroup>
        </Container>
        <Container id="selectDifficulty" className={difficultyEnabled ? "p-0 pt-3" : "d-none"}>
          <h5>Choose your difficulty</h5>
          <ListGroup horizontal="sm">
            <ListGroup.Item active={difficulty === "EASY"} onClick={difficultyOnClick} data-difficulty="EASY" type="button" action>Easy</ListGroup.Item>
            <ListGroup.Item active={difficulty === "MEDIUM"} onClick={difficultyOnClick} data-difficulty="MEDIUM" type="button" disabled action>Medium</ListGroup.Item>
            <ListGroup.Item active={difficulty === "HARD"} onClick={difficultyOnClick} data-difficulty="HARD" type="button" disabled action>Hard</ListGroup.Item>
          </ListGroup>
        </Container>
        <Container id="selectStarter" className={starterEnabled ? "p-0 pt-3" : "d-none"}>
          <h5>Choose your starting colour</h5>
          <ListGroup horizontal="sm">
            <ListGroup.Item active={starter === "WHITE"} onClick={starterOnClick} data-starter="WHITE" type="button" action>White</ListGroup.Item>
            <ListGroup.Item active={starter === "BLACK"} onClick={starterOnClick} data-starter="BLACK" type="button" action>Black</ListGroup.Item>
            <ListGroup.Item active={starter === "ANY"} onClick={starterOnClick} data-starter="ANY" type="button" action>Any</ListGroup.Item>
          </ListGroup>
        </Container>

        <Button className={starterEnabled ? "mt-4" : "d-none"} type="button" onClick={createGame} disabled={!starterEnabled}>Create Game</Button>
      </Main>
    );
}