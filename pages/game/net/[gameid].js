/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr'

import { Chess, WHITE, BLACK } from 'chess.js';

import { parseISO, intervalToDuration, add } from 'date-fns';

import Main from '../../../components/Main';

import { useToastContext } from "../../../contexts/ToastContext";

import { round, secondsToTime } from '../../../components/CountUp';
import CheckmateBoard from '../../../components/CheckmateBoard';

import { Modal, Button } from 'react-bootstrap';

const fetcher = url => fetch(url, {withCredentials: true, credentials: 'include', headers: { "Accept": "application/json", }})
                            .then(r => r.json())

const clkRegex = new RegExp('\\[%clk (.*)]', 'g');

// https://spectrum.chat/date-fns/general/duration-object-milliseconds~1dfb088c-01fc-48df-a78c-babbd9b5e522?m=MTYwMzEzNTczMzEyMQ==
const durationToMillis = duration => +add(0, duration)

export default function Play(/*{initialdata, gameid}*/) {

  const router = useRouter();

  const gameid = parseInt(router.query.gameid)

  const addToast = useToastContext();

  const [game, setGame] = useState(new Chess());

  const [storedgame, setStoredGame] = useState(null);

  const [boardEnabled, setBoardEnabled] = useState(false);

  const [userAuthorised, setUserAuthorised] = useState(false);

  const whiteTimer = useRef(null);
  const blackTimer = useRef(null);

  const [whiteTime, setWhiteTime] = useState(0.0);

  const [blackTime, setBlackTime] = useState(0.0);

  const { data, error, mutate } = useSWR(
    router.isReady ? `https://apichessapp.server.ultras-playroom.xyz/chess/game/${gameid}` : null,
    fetcher,
    {
      refreshInterval: 1000,
      fallbackData: null //initialdata
    }
  );

  const [showJoinGame, setJoinGame] = useState(true);
  const [canJoinGame, allowJoiningGame] = useState(false);

  const closeJoinGame = () => setJoinGame(false);
  const joinGame = () => {
    closeJoinGame();
    fetch(`https://apichessapp.server.ultras-playroom.xyz/chess/game/${gameid}/enter`, {
        body: JSON.stringify({
          wantsWhite: null
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        withCredentials: true,
        credentials: 'include',
      })
      .then((response) => {
        if (response.ok) {
            addToast({
                "title": "Checkmate Remote Game ID " + gameid,
                "message": "Joined game sucessfully!"
            });
        } else {
            addToast({
                "title": "Checkmate Remote Game ID " + gameid,
                "message": response.message || "Failed to join game."
            });
        }
      })
      .catch((error) => {
        console.error(error);
        addToast({
            "title": "Checkmate Remote Game ID " + gameid,
            "message": "Error whilst joining game."
        });
      })
      .finally(mutate)
  }

  const syncGame = useCallback(
    () => {
      const startTime = parseISO(storedgame.time_started)
      const currentTime = new Date()

      const duration = intervalToDuration({
        start: startTime,
        end: currentTime,
      })

      const secondsSinceStart = durationToMillis(duration) / 1000

      //console.warn("seconds since game start", secondsSinceStart)

      const game = new Chess();
      game.load_pgn(storedgame.game);

      const comments = game.get_comments()

      let times = comments.map((comment) => {
        const text = comment.comment

        const [ hours, minutes, seconds ] = (clkRegex.exec(text)?.at(1) || "00:00:00.0").split(":");
        clkRegex.lastIndex = 0;

        return (parseInt(hours) * 3600) + (parseInt(minutes) * 60) + parseFloat(seconds)
      })

      let white = 0;
      let black = 0;

      let isWhite, lastTime
      if (storedgame.clockType === "DOWN") {

        isWhite = true;

        let timeLimit = parseInt(storedgame.time_limit);

        times = times.map((time) => time - timeLimit);

        lastTime = timeLimit;

        times.forEach((time) => {
          if (isWhite) {
            white += lastTime - time;
          } else if (!isWhite) {
            black += lastTime - time;
          }
          lastTime = time;
          isWhite = !isWhite;
        })

        let timeMoving = white + black;

        white = timeLimit - white;
        black = timeLimit - black;

        /*if (white === 0) {
          white = timeLimit;
        }
        if (black === 0) {
          black = timeLimit;
        }*/

        if (storedgame.outOfTime === BLACK) {
          black = 0;
        } else if (storedgame.outOfTime === WHITE) {
          white = 0;
        }

        if (game.turn() === WHITE) {
          white -= secondsSinceStart - timeMoving;
        } else {
          black -= secondsSinceStart - timeMoving;
        }

        const total = white + black;

        console.log("seconds since start", secondsSinceStart);
        console.log("total game time", total);

        if (game.turn() === WHITE) {
          white += secondsSinceStart - total;
        } else {
          black += secondsSinceStart - total;
        }

        white = Math.max(white, 0)
        black = Math.max(white, 0)

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

      setGame(game);

      //console.log("Game has been syncronised.")

    },
    [storedgame]
  )

  useEffect(() => {
    let interval;
    if (storedgame) {
      interval = setInterval(syncGame, 999);
      syncGame()
    } else if (!storedgame) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [storedgame, syncGame]);

  useEffect(() => {
    if (!data && !error) {
        // WE LOADIN
    } else if (error) {
        console.warn(error);
        addToast({
            "title": "Checkmate Remote Game ID " + gameid,
            "message": "Error while loading data."
        });
    } else if (!data) {
        console.warn(data, error);
        addToast({
            "title": "Checkmate Remote Game ID " + gameid,
            "message": "Data could not be loaded."
        });
    } else if (!data.game) {
        if (data.players?.length < 2) {
            if (data.is_white === null) {
                allowJoiningGame(true);
            } else {
                addToast({
                    "title": "Checkmate Remote Game ID " + gameid,
                    "message": "You are missing an opponent!"
                });
            }
        } else {
            console.warn(data, error);
            allowJoiningGame(false);
            addToast({
                "title": "Checkmate Remote Game ID " + gameid,
                "message": data.message || "Improper data recieved from server."
            });
        }
    } else {

      data.clockType = "UP";
      if (data.timer === "Countdown") {
        data.clockType = "DOWN";
      }

      setStoredGame(data);

      setUserAuthorised(data.is_white != null)

      console.log("updated!")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, error])

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
        setBoardEnabled(storedgame.is_white === (game.turn() === WHITE));
      }
    } else {
      setBoardEnabled(storedgame.is_white === (game.turn() === WHITE));
    }
    console.log("user is white: ", storedgame.is_white);
    console.log("turn is white: ", game.turn() === WHITE);
    console.log("board enabled:", storedgame.is_white === (game.turn() === WHITE))
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
      const resp = fetch(`https://apichessapp.server.ultras-playroom.xyz/chess/game/${gameid}/move`, {
        body: JSON.stringify({
          san: result.san
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        withCredentials: true,
        credentials: 'include',
      })
      .then(async (response) => {
        const body = await response.json()
        if (response.ok) {
          return body
        } else {
          addToast({
            "title": "Checkmate Remote Game ID " + gameid,
            "message": body.message || "Server did not process move"
          });
          setGame(game);
          return storedgame
        }
      })

      mutate(
        resp,
        {
          revalidate: true
        }
      ).catch(async (error) => {
        console.error(error);
        addToast({
          "title": "Checkmate Remote Game ID " + gameid,
          "message": "Error sending move to the server"
        });
        setGame(game);
      })
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

      /*db.table("games").update(gameid, {
        gameWon: gameWinner,
        outOfTime: outOfTime
      })
      .then(function(updated) {
        if (updated) {
          addToast({
            "title": "Checkmate Local Game ID " + gameid,
            "message": "Game Over. Winner: " + gameWinner
          });
        } else {
          addToast({
            "title": "Checkmate Local Game ID " + gameid,
            "message": "Game Over. Winner: " + gameWinner + "\nFailed to save win."
          });
        }
      });*/
      return false;
    } else {
      return true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToast, game, gameid, storedgame, timeForMove]);

  useEffect(() => {
    let interval;
    if (storedgame) {
      interval = setInterval(() => { setBoardEnabled((storedgame.is_white === (game.turn() === WHITE)) && moveGameAlong()); }, 1000);
    } else if (!storedgame) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [moveGameAlong, storedgame, game]);

  function onDrop(sourceSquare, targetSquare) {

    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q' // always promote to a queen for example simplicity
    });

    // illegal move
    if (move === null) return false;
    return true;
  }

  return (
    <Main title="Play">
      <Modal show={canJoinGame && showJoinGame} onHide={closeJoinGame}>
        <Modal.Header closeButton>
          <Modal.Title>Join game?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This game is currently looking for a second player. Would you like to join or spectate?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeJoinGame}>
            Spectate
          </Button>
          <Button variant="primary" onClick={joinGame}>
            Join
          </Button>
        </Modal.Footer>
      </Modal>
      <h2>Play</h2>
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

        boardEnabled={boardEnabled && userAuthorised}
      />
    </Main>
  );
}

/*export async function getServerSideProps(context) {
    const res = await fetch(`https://apichessapp.server.ultras-playroom.xyz/chess/game/${context.params.gameid}`)
    const data = await res.json()

    if (!data.game) {
        return {
          notFound: true,
        }
    }

    return {
      props: {
        initialdata: data,
        gameid: parseInt(context.params.gameid)
    }, // will be passed to the page component as props
    }
}


export const config = {
    runtime: 'nodejs', // getServerSideProps would stall if the game wasnt found without this (default is experimental-edge)
}*/