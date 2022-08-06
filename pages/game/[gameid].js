import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router'

import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';

import { Container } from "react-bootstrap";

import Main from '../../components/Main';

import { db } from "../../db";
import { useLiveQuery } from "dexie-react-hooks";

import CountUp from '../../components/CountUp';

export default function Play() {
  const router = useRouter()
  const gameid = "LOCAL-1";//router.query.gameid || "";
  const [chessboardSize, setChessboardSize] = useState(320);

  const gameArray = gameid.split("-")

  /*
    to future me: SEPERATE EACH GAME TYPE INTO THEIR OWN PATH
    and use `/components/boards/PlayRandomMove.js` as an example.
  */
  if (gameArray[0] === "LOCAL") {
    // local multiplayer
  } else if (gameArray[0] === "BOT") {
    // you vs bot! (local)
  } else if (gameArray[0] === "NET") {
    // internet multiplayer
    // it's extremely likely that this will have to be in another page
  }

  console.log(router);
  console.log(gameid);
  console.log(gameArray);

  const game = useLiveQuery(async () => {
    console.log("gameid:" + gameArray[1]);
    console.log("as int: " + gameArray[1])
    return await db.table("games").get(parseInt(gameArray[1]))
  });

  // https://github.com/Clariity/react-chessboard/blob/main/example/src/index.js
  useEffect(() => {
      function handleResize() {
        setTimeout(() => {
          const display = document.getElementsByClassName('container')[0];
          var size = display.offsetWidth
          if (size >= 720) { // desktop/tablet
            size /= 2.15; // chess board on one side, list of moves on the other
          } else if (size <= 575) { // phone
            size -= 50;
          }
          setChessboardSize(size);
       }, 0) // setTimeout to prevent force reflows (bad for resizing window on low-end systems!)
      }

      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []);

  const chess = useMemo(() => {
    const chessinst = new Chess();
    (game ? chessinst.load_pgn(game.game) : undefined)
    return chessinst;
  }, [game])

  // eslint-disable-next-line no-unused-vars
  var [whiteTimerActive, setWhiteTimerActive] = useState(true);
  var whiteTime = 0;

  // eslint-disable-next-line no-unused-vars
  var [blackTimerActive, setBlackTimerActive] = useState(false);
  var blackTime = 48;

  return (
    <Main title="Play">
      <h2>Play</h2>
      <h3>Game: {game?.game}</h3>
      <Container className={"d-flex flex-row mb-3"}>
        <Chessboard position={chess.fen()} id="BasicBoard" boardWidth={chessboardSize}/>
        <div className={"p-2 m-2 mw-75 bg-dark flex-fill rounded text-white"}>
          <Container>
            <div className="row row-cols-2">
              <div id="whiteTimer" className={"col chessMove align-self-start bg-white text-dark text-center"}>Time: <b><CountUp initial={whiteTime} running={whiteTimerActive}/></b></div>
              <div id="blackTimer" className={"col chessMove align-self-end bg-secondary text-center"}>Time: <b><CountUp initial={blackTime} running={blackTimerActive}/></b></div>
              <div className={"col chessMove align-self-start text-center"}>b2b3</div>
              <div className={"col chessMove align-self-end text-center"}>ejdfoqfhqhu</div>
            </div>
          </Container>
        </div>
      </Container>
    </Main>
  );
}