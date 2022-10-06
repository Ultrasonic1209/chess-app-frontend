import { useEffect, useState, Suspense, useMemo } from "react";
import dynamic from "next/dynamic";

import { Container, Dropdown } from "react-bootstrap";

import styles from './Chessboard.module.css';

import { WHITE, BLACK } from 'chess.js';

import CountUp from "../CountUp";
import CountDown from "../CountDown";

import UserCard from "../UserCard";

const Chessboard = dynamic(() =>
  import('./Chessboard'),
  {
    suspense: true
  }
)

const ExportModal = dynamic(() =>
  import('./NetExtensions').then((mod) => mod.ExportModal)
)

function BoardPlaceholder({ text, chessboardSize }) {
  const style = {
      width: chessboardSize + "px",
      height: chessboardSize + "px"
  }

  return <Container id={"CheckmateBoard"} className={"bg-secondary text-white"} style={style}>{text}</Container>
}

export default function CheckmateBoard({ storedgame, game, onDrop, whiteTimer, whiteTime, setWhiteTime, blackTimer, blackTime, setBlackTime, boardEnabled, rotateBoard }) {

  const [chessboardSize, setChessboardSize] = useState(320);

  const [optionSquares, setOptionSquares] = useState({});

  const [whiteTimerActive, setWhiteTimerActive] = useState(false);
  const [blackTimerActive, setBlackTimerActive] = useState(false);

  const moves = game.history();

  useEffect(() => {
    if (!storedgame) {
      setWhiteTimerActive(false);
      setBlackTimerActive(false);
    } else if (game.game_over()) {
      setWhiteTimerActive(false);
      setBlackTimerActive(false);
    } else {
      if (storedgame?.clockType === "DOWN") {
        //console.log("checking time")
        if ((whiteTime <= 0) || (blackTime <= 0)) {
          //console.log("stopping time: times up")
          setWhiteTimerActive(false);
          setBlackTimerActive(false);
        } else {
          //console.log("time checked: keeping time going")
          setWhiteTimerActive(game.turn() === WHITE);
          setBlackTimerActive(game.turn() === BLACK);
        }
      } else {
        setWhiteTimerActive(game.turn() === WHITE);
        setBlackTimerActive(game.turn() === BLACK);
      }
    }

  }, [storedgame, game, whiteTime, blackTime])

  // https://github.com/Clariity/react-chessboard/blob/main/example/src/index.js
  useEffect(() => {
    function handleResize() {
      setTimeout(() => {
        const display = document.getElementsByClassName('container')[0];
        let size = display.offsetWidth
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

  // https://github.com/Clariity/react-chessboard/blob/main/example/src/boards/SquareStyles.js
  function onMouseOverSquare(square) {
    getMoveOptions(square);
  }

  // Only set squares to {} if not already set to {}
  function onMouseOutSquare() {
    if (Object.keys(optionSquares).length !== 0) setOptionSquares({});
  }

  function getMoveOptions(square) {
    const moves = game.moves({
      square,
      verbose: true
    });
    if (moves.length === 0) {
      return;
    }

    const newSquares = {};
    moves.map((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%'
      };
      return move;
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)'
    };
    setOptionSquares(newSquares);
  }

  let whiteMove = !(storedgame?.colourPlaying === "BLACK");

  const [showExport, setShowExport] = useState(false);
  const [exportText, setExportText] = useState("");
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowShare, setAllowShare] = useState(false);
  const [exportMode, setExportMode] = useState("");

  function onExportClicked(type) {
    switch (type) {
      case "link": 
        return () => {
          setExportText(document.location.toString());
          setAllowDownload(false);
          setAllowShare(true);
          setExportMode("link");
          setShowExport(true);
        }
      case "pgn":
        return () => {
          setExportText(game.pgn());
          setAllowDownload(true);
          setAllowShare(true);
          setExportMode("pgn");
          setShowExport(true);
        }
      case "fen":
        return () => {
          setExportText(game.fen());
          setAllowDownload(true);
          setAllowShare(true);
          setExportMode("fen");
          setShowExport(true);
        }
    }
  }

  let [blackplr, whiteplr] = useMemo(() => {

    let blackplr, whiteplr
    if (storedgame?.players) {
      storedgame.players.forEach((player) => {
        let plrName = player.username || "Anonymous"

        if ((player.is_white === storedgame.is_white) && !player.username) {
          plrName += " ⚙️"
        }

        if (player.is_white) {
          whiteplr = {
            username: plrName,
            rank: player.rank,
            avatar: player.avatar_hash
          }
        } else {
          blackplr = {
            username: plrName,
            rank: player.rank,
            avatar: player.avatar_hash
          }
        }
      })
    }

    return [blackplr, whiteplr]
  }, [storedgame?.players, storedgame?.is_white])

  return (
    <Container className={"d-flex flex-row mb-3"}>
      <ExportModal
        show={showExport}
        handleClose={() => setShowExport(false)}
        string={exportText}
        allowDownload={allowDownload}
        allowShare={allowShare}
        mode={exportMode}
      />
      
      <Dropdown className={"mb-2"} id={styles.shareDropdown}>
        <Dropdown.Toggle letiant="secondary" id="export-dropdown">
          Share game
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={onExportClicked("link")} href="#" disabled={!storedgame?.players}>As Link</Dropdown.Item>
          <Dropdown.Item onClick={onExportClicked("pgn")} href="#">As .PGN</Dropdown.Item>
          <Dropdown.Item onClick={onExportClicked("fen")} href="#">As .FEN</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {
        storedgame
          ? (
            <Suspense fallback={<BoardPlaceholder chessboardSize={chessboardSize} text={"Loading board..."}/>}>
              <Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                id={"CheckmateBoard"}
                boardWidth={chessboardSize}
                onMouseOverSquare={onMouseOverSquare}
                onMouseOutSquare={onMouseOutSquare}
                customSquareStyles={boardEnabled && optionSquares}
                arePiecesDraggable={boardEnabled}
                boardOrientation={rotateBoard ? 'black' : 'white'}
              />
            </Suspense>)
          : (<BoardPlaceholder chessboardSize={chessboardSize} text={"Loading data..."}/>)
      }
      <div id={styles.moveBoard} className={"p-2 m-2 mw-75 bg-dark flex-fill rounded text-white"}>
        <Container>
          <div className="row row-cols-2">
            {
              storedgame?.players
              ? ( <>
                    <div id="whitePlayer" className={"col chessMove align-self-start bg-white text-dark text-center align-items-center justify-content-center d-flex"}>
                      <UserCard
                        className={"mt-2 mb-2 me-0"} // did i say how much i hate CSS
                        username={whiteplr?.username}
                        avatarhash={whiteplr?.avatar}
                        rank={whiteplr?.rank}
                        priority={true}
                      />
                    </div>
                    <div id="blackPlayer" className={"col chessMove align-self-end bg-secondary text-center align-items-center justify-content-center d-flex"}>
                    <UserCard
                        className={"mt-2 mb-2 me-0"}
                        username={blackplr?.username}
                        avatarhash={blackplr?.avatar}
                        rank={blackplr?.rank}
                        priority={true}
                      />
                    </div>
                  </>
              ) : undefined
            }
            <div id="whiteTimer" className={"col chessMove align-self-start bg-white text-dark text-center"}>
              Time:&nbsp;
              <b>
                {storedgame?.clockType === "DOWN"
                  ? <CountDown getTime={whiteTime} setTime={setWhiteTime} running={whiteTimerActive} ref={whiteTimer} />
                  : <CountUp getTime={whiteTime} setTime={setWhiteTime} running={whiteTimerActive} ref={whiteTimer} />
                }
              </b>
            </div>
            <div id="blackTimer" className={"col chessMove align-self-end bg-secondary text-center"}>
              Time:&nbsp;
              <b>
                {storedgame?.clockType === "DOWN"
                  ? <CountDown getTime={blackTime} setTime={setBlackTime} running={blackTimerActive} ref={blackTimer} />
                  : <CountUp getTime={blackTime} setTime={setBlackTime} running={blackTimerActive} ref={blackTimer} />
                }
              </b>
            </div>
            {
              (moves.length > 0)
                ? (
                  moves.map((move, index) => {
                    let moveclass = whiteMove ? "col chessMove align-self-start text-center" : "col chessMove align-self-end text-center";
                    whiteMove = !whiteMove;
                    return (<div key={move + index + whiteMove} className={moveclass}>{move}</div>)
                  })
                )
                : undefined
            }
          </div>
        </Container>
      </div>
    </Container>
  )
}