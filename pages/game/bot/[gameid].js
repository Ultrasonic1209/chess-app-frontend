import { useEffect, useState } from 'react';
import { useRouter } from 'next/router'

import { Chessboard } from "react-chessboard";
import { Chess } from 'chess.js';

import { Container } from "react-bootstrap";

import Main from '../../../components/Main';

import { db } from "../../../db";
import { useLiveQuery } from "dexie-react-hooks";

import CountUp from '../../../components/CountUp';

export default function Play() {
  const router = useRouter()
  const gameid = router.query.gameid || "1";
  const [chessboardSize, setChessboardSize] = useState(320);

  const [game, setGame] = useState(new Chess());

  const storedgame = useLiveQuery(async () => {
    if (typeof window === 'undefined') { return }

    console.log("gameid:" + gameid);
    console.log("as int: " + parseInt(gameid))
    const loadedgame = db.table("games").get(parseInt(gameid)).then((retrievedgame) => {
        console.log(retrievedgame);
        const gameCopy = { ...game };
        gameCopy.reset()
        gameCopy.load_pgn(retrievedgame.game);
        setGame(gameCopy);
        return retrievedgame;
    })

    return loadedgame
  });

  function makeAMove(move) {
    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    setGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0)
      return; // exit if the game is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    
    setTimeout(makeRandomMove, 200);
    return true;
  }

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

  // eslint-disable-next-line no-unused-vars
  var [whiteTimerActive, setWhiteTimerActive] = useState(true);
  var whiteTime = 0;

  // eslint-disable-next-line no-unused-vars
  var [blackTimerActive, setBlackTimerActive] = useState(false);
  var blackTime = 48;

  console.log("board: " + game?.fen());

  return (
    <Main title="Play">
      <h2>Play</h2>
      <h3>Game ID: {storedgame?.id}</h3>
      <Container className={"d-flex flex-row mb-3"}>
        {
            storedgame
            ? (<Chessboard position={game.fen()} onPieceDrop={onDrop} id="BasicBoard" boardWidth={chessboardSize}/>)
            : (<Container width={chessboardSize} height={chessboardSize}>Loading</Container>)
        }
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