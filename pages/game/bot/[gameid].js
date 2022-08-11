import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'

import { Chessboard } from "react-chessboard";
import { Chess, WHITE, BLACK } from 'chess.js';

import { Container } from "react-bootstrap";

import Main from '../../../components/Main';

import { useToastContext } from "../../../contexts/ToastContext";

import { db } from "../../../db";
import { useLiveQuery } from "dexie-react-hooks";

import CountUp, { round, secondsToTime } from '../../../components/CountUp';

const clkRegex = new RegExp(
  /\[%clk (?<hours>([0-9][0-9])+):(?<minutes>[0-5][0-9]):(?<seconds>[0-5][0-9]\.[0-9])]/g
);

export default function Play() {
  const router = useRouter();
  const gameid = parseInt(router.query.gameid);
  const isReady = router.isReady;

  useEffect(() => {
    if (isNaN(gameid) && (typeof window != 'undefined') && (router.isReady === true)) {
      router.push("/").then(() => {
        addToast({
          "title": "Checkmate Local Game ID " + router.query.gameid,
          "message": "Invalid ID"
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const addToast = useToastContext();
  const [chessboardSize, setChessboardSize] = useState(320);

  const [game, setGame] = useState(new Chess());

  const whiteTimer = useRef(null);
  const blackTimer = useRef(null);

  // eslint-disable-next-line no-unused-vars
  const [whiteTimerActive, setWhiteTimerActive] = useState(true);
  const [whiteTime, setWhiteTime] = useState(0.0);

  // eslint-disable-next-line no-unused-vars
  const [blackTimerActive, setBlackTimerActive] = useState(false);
  const [blackTime, setBlackTime] = useState(0.0);

  const storedgame = useLiveQuery(async () => {
    if ((typeof window === 'undefined') || isNaN(gameid) || (router.isReady === false)) { return }

    const loadedgame = db.table("games").get(gameid)
    .then((retrievedgame) => {
        if (!retrievedgame) {
          router.push("/").then(() => {
            addToast({
              "title": "Checkmate Local Game ID " + router.query.gameid,
              "message": "No game could be found"
            });
          })
          return;
        }
        const gameCopy = { ...game };
        gameCopy.reset();
        gameCopy.load_pgn(retrievedgame.game);

        const comments = gameCopy.get_comments()

        const times = comments.map((comment) => {
          const text = comment.comment

          const { hours, minutes, seconds } = clkRegex.exec(text).groups;
          clkRegex.lastIndex = 0;

          return (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseFloat(seconds)
        })

        console.log(times);

        var isWhite = true;
        var lastValue = 0;

        var white = 0;
        var black = 0;

        times.forEach((time) => {
          if (isWhite) {
            white += time - lastValue;
          } else {
            black += time - lastValue;
          }
          isWhite = !isWhite;
          lastValue = time;
        })

        console.log(white, whiteTime);

        setWhiteTime(white)
        setBlackTime(black);

        setGame(gameCopy);
        return retrievedgame;
    })
    .catch((reason) => {
      console.error(reason);
      addToast({
        "title": "Checkmate Local Game ID " + router.query.gameid,
        "message": "Loading Failure"
      });
    });

    return loadedgame;
  }, [isReady]);


  function makeAMove(move) {
    const gametime = round(parseFloat(whiteTimer.current.dataset.time) + parseFloat(blackTimer.current.dataset.time), 1);
    const formattedtime = secondsToTime(gametime);

    console.log(gametime, formattedtime)

    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    gameCopy.set_comment(`[%clk ${formattedtime}}]`);

    setGame(gameCopy);
    
    if (result) {
        db.table("games").update(gameid, {"game": gameCopy.pgn()})
        .then(function(updated) {
            if (!updated) {
                addToast(
                    "Checkmate Local Game ID " + gameid,
                    "Failed to save move"
                );
            }
        });
    }
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {

      var gameWinner = "TIE";
      if (game.in_checkmate()) {
        if (game.turn() === BLACK) {
          gameWinner = "WHITE"
        } else if (game.turn() === WHITE) {
          gameWinner = "BLACK"
        }
      }
      db.table("games").update(gameid, {
        gameWon: gameWinner
      })
      .then(function(updated) {
        if (updated) {
          addToast({
            "title": "Checkmate Local Game ID " + router.query.gameid,
            "message": "Game Over. Winner: " + gameWinner
          });
        } else {
          addToast({
            "title": "Checkmate Local Game ID " + gameid,
            "message": "Game Over. Winner: " + gameWinner + "\nFailed to save win."
          });
        }
      });
      return;
    }
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    const resp = makeAMove(possibleMoves[randomIndex]);
    return resp;
  }

  useEffect(() => {
    if ((storedgame?.game === '') && (storedgame?.colourPlaying === "BLACK")) {
      makeRandomMove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storedgame])

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

  useEffect(() => {
    const possibleMoves = game.moves();
    if (game.game_over() || game.in_draw() || possibleMoves.length === 0) {
      setWhiteTimerActive(false);
      setBlackTimerActive(false);
    } else if (!storedgame) {
      setWhiteTimerActive(false);
      setBlackTimerActive(false);
    } else {
      setWhiteTimerActive(game.turn() === WHITE);
      setBlackTimerActive(game.turn() === BLACK);
    }

  }, [storedgame, game])

  const placeholderStyle = {
    width: chessboardSize + "px",
    height: chessboardSize + "px"
  }

  return (
    <Main title="Play">
      <h2>Play</h2>
      <h3>Game ID: {storedgame?.id}</h3>
      <Container className={"d-flex flex-row mb-3"}>
        {
            storedgame
            ? (<Chessboard position={game.fen()} onPieceDrop={onDrop} id="BasicBoard" boardWidth={chessboardSize}/>)
            : (<Container id="BasicBoard" className={"bg-secondary"} style={placeholderStyle} >Loading</Container>)
        }
        <div className={"p-2 m-2 mw-75 bg-dark flex-fill rounded text-white"}>
          <Container>
            <div className="row row-cols-2">
              <div id="whiteTimer" className={"col chessMove align-self-start bg-white text-dark text-center"}>Time: <b><CountUp getTime={whiteTime} setTime={setWhiteTime} running={whiteTimerActive} ref={whiteTimer}/></b></div>
              <div id="blackTimer" className={"col chessMove align-self-end bg-secondary text-center"}>Time: <b><CountUp getTime={blackTime} setTime={setBlackTime} running={blackTimerActive} ref={blackTimer}/></b></div>
              <div className={"col chessMove align-self-start text-center"}>b2b3</div>
              <div className={"col chessMove align-self-end text-center"}>ejdfoqfhqhu</div>
            </div>
          </Container>
        </div>
      </Container>
    </Main>
  );
}