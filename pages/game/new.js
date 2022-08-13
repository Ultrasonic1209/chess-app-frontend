import Main from "../../components/Main";

import { useState } from "react";
import { Button, Container, ListGroup } from "react-bootstrap";

import { useRouter } from 'next/router'

import { useOnlineStatus } from "../../contexts/OnlineStatus";
import { useToastContext } from "../../contexts/ToastContext";

import { db } from "../../db";

export default function Preferences() {
    const router = useRouter();

    const isOnline = useOnlineStatus();
    const addToast = useToastContext();

    const [gamemode, setGamemode] = useState();
    const [difficulty, setDifficulty] = useState();
    const [starter, setStarter] = useState("ANY");

    const gamemodeOnClick = (ev) => setGamemode(ev.target.dataset.gamemode);
    const difficultyOnClick = (ev) => setDifficulty(ev.target.dataset.difficulty);
    const starterOnClick = (ev) => setStarter(ev.target.dataset.starter);

    // eslint-disable-next-line no-unused-vars
    const createGame = async (ev) => {

      switch (gamemode) {
        case "BOT":
          var toStarter = starter;
          if (toStarter === "ANY") {
            toStarter = Math.random() < 0.5 ? "WHITE" : "BLACK";
          }
          var key = await db.games.put({
            gameType: "BOT",
            game: "",
            difficulty: difficulty,
            colourPlaying: starter,
            gameWon: null//starter === gameWinner
          });
          addToast({
            "title": "Checkmate",
            "message": "Local Game created. ID " + key
          });
          router.push("/game/bot/" + key);
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