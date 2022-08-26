import Main from "../../components/Main";

import { useState } from "react";
import { Button, Container, ListGroup, Form } from "react-bootstrap";

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
    const [time, setTime] = useState("UP");
    const [timeRange, setTimeRange] = useState(0);

    const gamemodeOnClick = (ev) => setGamemode(ev.target.dataset.gamemode);
    const difficultyOnClick = (ev) => setDifficulty(ev.target.dataset.difficulty);
    const starterOnClick = (ev) => setStarter(ev.target.dataset.starter);
    const timeOnClick = (ev) => setTime(ev.target.dataset.time);

    const timeRangeOnChange = (ev) => setTimeRange(parseInt(ev.target.value));

    const formatTimeRange = (range) => {
      const seconds = range % 60;
      const minutes = Math.floor(range / 60)

      var tr = ""

      if (minutes > 0) {
        tr = minutes + " minute";

        if (minutes != 1) {
          tr += "s"
        }
        
        if (seconds > 0) {
          tr += ", " + seconds + " second";

          if (seconds != 1) {
            tr += "s"
          }
        }
      } else if (seconds > 0) {
        tr = seconds + " second";

        if (seconds != 1) {
          tr += "s"
        }
      } else {
        tr = "Zero."
      }

      return tr;
    }

    // eslint-disable-next-line no-unused-vars
    const createGame = async (ev) => {

      switch (gamemode) {
        case "BOT":

          var toStarter = starter;
          if (toStarter === "ANY") {
            toStarter = Math.random() < 0.5 ? "WHITE" : "BLACK";
          }

          db.games.put({
            gameType: "BOT",
            game: "",
            difficulty: difficulty,
            colourPlaying: toStarter,
            clockType: time,
            timeLimit: timeRange,
            gameWon: null
          })
          .then(async (key) => {
            addToast({
              "title": "Checkmate",
              "message": "Bot Game created. ID " + key
            });
            await router.push("/game/bot/" + key);
          })
          break;
        case "LOCAL":

          db.games.put({
            gameType: "LOCAL",
            game: "",
            clockType: time,
            timeLimit: timeRange,
            gameWon: null
          })
          .then(async (key) => {
            addToast({
              "title": "Checkmate",
              "message": "Local Game created. ID " + key
            });
            await router.push("/game/local/" + key);
          })

          break;
        case "NET":
          console.log(time);
          fetch(`https://apichessapp.server.ultras-playroom.xyz/chess/game/`, {
            body: JSON.stringify({
              creatorStartsWhite: toStarter === "WHITE",
              countingDown: time === "DOWN",
              timeLimit: timeRange
            }),
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            withCredentials: true,
            credentials: 'include',
          })
          .then(async (response) => {
            if (response.ok) {
                const resp = await response.json()
                addToast({
                  "title": "Checkmate",
                  "message": "Remote Game created. ID " + resp.game_id
                });
                await router.push("/game/net/" + resp.game_id);
            } else {
                console.error(response);
                addToast({
                    "title": "Checkmate",
                    "message": response.message || "Internal server error."
                });
            }
          })
          .catch((error) => {
            console.error(error);
            addToast({
                "title": "Checkmate",
                "message": "Error whilst creating game."
            });
          })
          break;
        default:
          addToast({
            "title": "Checkmate",
            "message": "Error: Unknown gamemode " + gamemode
          });
          
      }
    }

    const difficultyEnabled = gamemode === "BOT";
    const starterEnabled = (difficultyEnabled && difficulty) || (!difficultyEnabled && (gamemode === "NET"));
    const timeEnabled = starterEnabled || (!starterEnabled && (gamemode === "LOCAL"))
    const timeLimitEnabled = timeEnabled && (time === "DOWN")

    const createEnabled = (timeEnabled && (((time != "DOWN") || (timeRange > 0))))

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
        <Container id="selectTime" className={timeEnabled ? "p-0 pt-3" : "d-none"}>
          <h5>Choose your clock</h5>
          <ListGroup horizontal="sm">
            <ListGroup.Item active={time === "UP"} onClick={timeOnClick} data-time="UP" type="button" action>Stopwatch</ListGroup.Item>
            <ListGroup.Item active={time === "DOWN"} onClick={timeOnClick} data-time="DOWN" type="button" action>Countdown</ListGroup.Item>
          </ListGroup>
        </Container>
        <Container id="selectTimeLimit" className={timeLimitEnabled ? "p-0 pt-3" : "d-none"}>
          <h5>Select your time limit</h5>
          <Form.Label>{formatTimeRange(timeRange)}</Form.Label>
          <Form.Range onChange={timeRangeOnChange} defaultValue={0} max={3600}/>
        </Container>

        <Button className={"mt-4"} type="button" onClick={createGame} disabled={!createEnabled}>Create Game</Button>
      </Main>
    );
}