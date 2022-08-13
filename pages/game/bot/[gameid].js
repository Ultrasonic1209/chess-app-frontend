import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router'

import { Chess, WHITE, BLACK } from 'chess.js';

import Main from '../../../components/Main';

import { useToastContext } from "../../../contexts/ToastContext";

import { db } from "../../../db";
import { useLiveQuery } from "dexie-react-hooks";

import { round, secondsToTime } from '../../../components/CountUp';
import CheckmateBoard from '../../../components/CheckmateBoard';

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
          "title": "Checkmate Bot Game ID " + router.query.gameid,
          "message": "Invalid ID"
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);

  const addToast = useToastContext();

  const [game, setGame] = useState(new Chess());

  const whiteTimer = useRef(null);
  const blackTimer = useRef(null);

  const [whiteTime, setWhiteTime] = useState(0.0);

  const [blackTime, setBlackTime] = useState(0.0);

  const storedgame = useLiveQuery(async () => {
    if ((typeof window === 'undefined') || isNaN(gameid) || (router.isReady === false)) { return }

    const loadedgame = db.table("games").get(gameid)
    .then((retrievedgame) => {
        if (!retrievedgame) {
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

        const times = comments.map((comment) => {
          const text = comment.comment

          const { hours, minutes, seconds } = clkRegex.exec(text).groups;
          clkRegex.lastIndex = 0;

          return (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseFloat(seconds)
        })

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

        setWhiteTime(white)
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


  function makeAMove(move) {
    const gametime = round(parseFloat(whiteTimer.current.dataset.time) + parseFloat(blackTimer.current.dataset.time), 1);
    const formattedtime = secondsToTime(gametime);

    const gameCopy = { ...game };
    const result = gameCopy.move(move);
    gameCopy.set_comment(`[%clk ${formattedtime}}]`);

    setGame(gameCopy);
    
    if (result) {
        db.table("games").update(gameid, {"game": gameCopy.pgn()})
        .then(function(updated) {
            if (!updated) {
                addToast(
                    "Checkmate Bot Game ID " + gameid,
                    "Failed to save move"
                );
            }
        });
    }
    return result; // null if the move was illegal, the move object if the move was legal
  }

  function makeRandomMove() {
    const possibleMoves = game.moves();
    if (game.game_over()) {

      var gameWinner = "UNKNOWN";

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
      } else {
        gameWinner = "DRAW - 100+ HALF MOVES"
      }

      db.table("games").update(gameid, {
        gameWon: gameWinner
      })
      .then(function(updated) {
        if (updated) {
          addToast({
            "title": "Checkmate Bot Game ID " + router.query.gameid,
            "message": "Game Over. Winner: " + gameWinner
          });
        } else {
          addToast({
            "title": "Checkmate Bot Game ID " + gameid,
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

      />
    </Main>
  );
}