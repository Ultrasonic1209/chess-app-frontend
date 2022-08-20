import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'

import { Chess, WHITE, BLACK } from 'chess.js';

import Main from '../../../components/Main';

import { useToastContext } from "../../../contexts/ToastContext";

import { db } from "../../../db";
import { useLiveQuery } from "dexie-react-hooks";

import { round, secondsToTime } from '../../../components/CountUp';
import CheckmateBoard from '../../../components/CheckmateBoard';

const clkRegex = new RegExp('\\[%clk (.*)]', 'g');

export default function Play() {

  // todo: figure out why (on countdown mode) opposing team time gets set to player's time
  const router = useRouter();
  const gameid = parseInt(router.query.gameid);
  const isReady = router.isReady;

  useEffect(() => {
    if (isNaN(gameid) && (typeof window != 'undefined') && (isReady === true)) {
      router.push("/").then(() => {
        addToast({
          "title": "Checkmate Bot Game ID " + router.query.gameid,
          "message": "Invalid ID"
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const addToast = useToastContext();

  const [game, setGame] = useState(new Chess());

  const [boardEnabled, setBoardEnabled] = useState(false);

  const whiteTimer = useRef(null);
  const blackTimer = useRef(null);

  const [whiteTime, setWhiteTime] = useState(0.0);

  const [blackTime, setBlackTime] = useState(0.0);

  const storedgame = useLiveQuery(async () => {
    if ((typeof window === 'undefined') || isNaN(gameid) || (router.isReady === false)) { return }

    const loadedgame = db.table("games").get(gameid)
    .then((retrievedgame) => {
        if ((!retrievedgame) || (retrievedgame.gameType != "BOT")) {
          router.push("/").then(() => {
            addToast({
              "title": "Checkmate Bot Game ID " + router.query.gameid,
              "message": "No game could be found"
            });
          })
          return;
        }
        const gameCopy = { ...game };
        gameCopy.reset();
        gameCopy.load_pgn(retrievedgame.game);

        const comments = gameCopy.get_comments()

        let times = comments.map((comment) => {
          const text = comment.comment

          const [ hours, minutes, seconds ] = (clkRegex.exec(text)?.at(1) || "00:00:00.0").split(":");
          clkRegex.lastIndex = 0;

          return (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseFloat(seconds)
        })

        let white = 0;
        let black = 0;

        let isWhite, lastTime
        if (retrievedgame.clockType === "DOWN") {
          isWhite = true;

          let timeLimit = parseInt(retrievedgame.timeLimit);

          times = times.map((time) => time - timeLimit);

          lastTime = timeLimit;

          times.forEach((time) => { // i am so incredibly done with this
            if (isWhite) {
              console.log(lastTime - time, " for white");
              white += lastTime - time;
            } else if (!isWhite) {
              console.log(lastTime - time, " for black");
              black += lastTime - time;
            }
            lastTime = time;
            isWhite = !isWhite;
          })

          white = timeLimit - white;
          black = timeLimit - black;

          if (white === 0) {
            white = timeLimit;
          }
          if (black === 0) {
            black = timeLimit;
          }

          if (retrievedgame.outOfTime === BLACK) {
            black = 0;
          } else if (retrievedgame.outOfTime === WHITE) {
            white = 0;
          }
        } else {
          isWhite = true;
          lastTime = 0;
          times.forEach((time) => {
            if (isWhite) {
              console.log(time - lastTime, " for white");
              white += time - lastTime;
            } else if (!isWhite) {
              console.log(time - lastTime, " for black");
              black += time - lastTime;
            }
            lastTime = time;
            isWhite = !isWhite;
          })
        }

        setWhiteTime(white);
        setBlackTime(black);

        setGame(gameCopy);
        return retrievedgame;
    })
    .catch((reason) => {
      console.error(reason);
      addToast({
        "title": "Checkmate Bot Game ID " + router.query.gameid,
        "message": "Loading Failure"
      });
    });

    return loadedgame;
  }, [isReady]);

  useEffect(() => {
    if (!storedgame || !whiteTimer.current || !blackTimer.current) { return; }
    const whiteTime = parseFloat(whiteTimer.current.dataset.time);
    const blackTime = parseFloat(blackTimer.current.dataset.time);

    console.log(blackTime, whiteTime);

    if (game.game_over()) {
      setBoardEnabled(false);
    }
    if (storedgame.clockType === "DOWN") {
      if ((whiteTime <= 0) || (blackTime <= 0) || storedgame.outOfTime) {
        console.log("time up!")
        setBoardEnabled(false);
      } else {
        setBoardEnabled(true);
      }
    } else {
      setBoardEnabled(true);
    }
  }, [storedgame, game])

  const timeForMove = useCallback(() => {
    if (storedgame.outOfTime) { return false; }
    const whiteTime = parseFloat(whiteTimer.current.dataset.time);
    const blackTime = parseFloat(blackTimer.current.dataset.time);

    if ((storedgame.clockType === "DOWN") && ((whiteTime <= 0) || (blackTime <= 0))) {
      return false;
    } else {
      return true;
    }
  }, [storedgame, whiteTimer, blackTimer])


  function makeAMove(move) {
    if (!timeForMove()) { return null; }

    let gametime = round(whiteTime + blackTime, 1);
    if (storedgame.clockType === "DOWN") {
      let timeLimit = parseInt(storedgame.timeLimit);

      console.log("time limit:", timeLimit)

      let whiteSpent = round(timeLimit - whiteTime, 1)
      let blackSpent = round(timeLimit - blackTime, 1)

      const totalSpent = round(whiteSpent + blackSpent, 1);
      console.log("most spent:", totalSpent)
      gametime = (timeLimit * 2) - totalSpent
      console.log("total:", gametime)
    }
    const formattedtime = secondsToTime(gametime);

    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    gameCopy.set_comment(`[%clk ${formattedtime}}]`);
    //console.log(gameCopy.get_comment());

    if (result) {
        db.table("games").update(gameid, {"game": gameCopy.pgn()})
        .then(function(updated) {
            if (!updated) {
              addToast(
                  "Checkmate Bot Game ID " + gameid,
                  "Failed to save move"
              );
              setGame(game);
            } else {
              setGame(gameCopy);
            }
        });
    }
    return result; // null if the move was illegal, the move object if the move was legal
  }

  const moveGameAlong = useCallback(() => {
    if (storedgame.gameWon) { return false; }
    const canMove = timeForMove();
    const possibleMoves = game.moves();
    if (game.game_over() || possibleMoves.length === 0 || !canMove) {
      let gameWinner = "UNKNOWN";
      let outOfTime = null;

      if (game.in_checkmate()) {
        if (game.turn() === BLACK) {
          gameWinner = "WHITE";
        } else if (game.turn() === WHITE) {
          gameWinner = "BLACK";
        }
      } else if (game.insufficient_material()) {
        gameWinner = "DRAW - INSUFFICENT MATERIAL"
      } else if (game.in_threefold_repetition()) {
        gameWinner = "DRAW - THREEFOLD REPETITION";
      } else if (game.in_stalemate()) {
        gameWinner = "DRAW - " + ((game.turn() === WHITE) ? "WHITE" : "BLACK") + " STALEMATED"
      } else if (!canMove) {
        if (game.turn() === BLACK) {
          gameWinner = "WHITE - BLACK OUT OF TIME";
        } else if (game.turn() === WHITE) {
          gameWinner = "BLACK - WHITE OUT OF TIME";
        }
        outOfTime = game.turn();
      } else {
        gameWinner = "DRAW - 100+ HALF MOVES"
      }

      db.table("games").update(gameid, {
        gameWon: gameWinner,
        outOfTime: outOfTime
      })
      .then(function(updated) {
        if (updated) {
          addToast({
            "title": "Checkmate Bot Game ID " + gameid,
            "message": "Game Over. Winner: " + gameWinner
          });
        } else {
          addToast({
            "title": "Checkmate Bot Game ID " + gameid,
            "message": "Game Over. Winner: " + gameWinner + "\nFailed to save win."
          });
        }
      });
      return false;
    } else {
      return true;
    }
  }, [addToast, game, gameid, storedgame, timeForMove]);

  useEffect(() => {
    let interval;
    if (storedgame) {
      interval = setInterval(() => { setBoardEnabled(moveGameAlong()); }, 1000);
    } else if (!storedgame) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [moveGameAlong, storedgame]);

  function makeRandomMove() {
    if (moveGameAlong()) {
      const possibleMoves = game.moves();
      const randomIndex = Math.floor(Math.random() * possibleMoves.length);
      const resp = makeAMove(possibleMoves[randomIndex]);
      return resp;
    }
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

  return (
    <Main title="Play">
      <h2>Play</h2>
      <h3>Vs: Bot ({storedgame?.difficulty})</h3>
      <CheckmateBoard
        storedgame={storedgame}
        game={game}
        onDrop={onDrop}

        whiteTimer={whiteTimer}
        whiteTime={whiteTime}
        setWhiteTime={setWhiteTime}

        blackTimer={blackTimer}
        blackTime={blackTime}
        setBlackTime={setBlackTime}

        boardEnabled={boardEnabled}
      />
    </Main>
  );
}