import { useEffect, useState } from "react";

import { Container } from "react-bootstrap";

import { Chessboard } from "react-chessboard";
import { WHITE, BLACK } from 'chess.js';

import CountUp from "./CountUp";

export default function CheckmateBoard({storedgame, game, onDrop, whiteTimer, whiteTime, setWhiteTime, blackTimer, blackTime, setBlackTime}) {
    
    const [chessboardSize, setChessboardSize] = useState(320);

    const [whiteTimerActive, setWhiteTimerActive] = useState(false);
    const [blackTimerActive, setBlackTimerActive] = useState(false);

    const moves = game.history();

    const placeholderStyle = {
        width: chessboardSize + "px",
        height: chessboardSize + "px"
    }

    useEffect(() => {
      if (game.game_over()) {
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
    
    var whiteMove = !(storedgame?.colourPlaying === "BLACK");

    return (
        <Container className={"d-flex flex-row mb-3"}>
        {
            storedgame
            ? (<Chessboard position={game.fen()} onPieceDrop={onDrop} id="BasicBoard" boardWidth={chessboardSize}/>)
            : (<Container id="BasicBoard" className={"bg-secondary"} style={placeholderStyle} >Loading</Container>)
        }
        <div id={"moveBoard"} className={"p-2 m-2 mw-75 bg-dark flex-fill rounded text-white"}>
          <Container>
            <div className="row row-cols-2">
              <div id="whiteTimer" className={"col chessMove align-self-start bg-white text-dark text-center"}>Time: <b><CountUp getTime={whiteTime} setTime={setWhiteTime} running={whiteTimerActive} ref={whiteTimer}/></b></div>
              <div id="blackTimer" className={"col chessMove align-self-end bg-secondary text-center"}>Time: <b><CountUp getTime={blackTime} setTime={setBlackTime} running={blackTimerActive} ref={blackTimer}/></b></div>
              {
                (moves.length > 0)
                ? (
                  moves.map((move, index) => {
                    var moveclass = whiteMove ? "col chessMove align-self-start text-center" : "col chessMove align-self-end text-center";
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