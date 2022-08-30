import { useEffect, useState } from "react";

import { Container, Dropdown } from "react-bootstrap";

import { Chessboard } from "react-chessboard";
import { WHITE, BLACK } from 'chess.js';

import CountUp from "./CountUp";
import CountDown from "./CountDown";

export default function CheckmateBoard({storedgame, game, onDrop, whiteTimer, whiteTime, setWhiteTime, blackTimer, blackTime, setBlackTime, boardEnabled}) {
    
    const [chessboardSize, setChessboardSize] = useState(320);

    const [optionSquares, setOptionSquares] = useState({});

    const [whiteTimerActive, setWhiteTimerActive] = useState(false);
    const [blackTimerActive, setBlackTimerActive] = useState(false);

    const moves = game.history();

    const placeholderStyle = {
        width: chessboardSize + "px",
        height: chessboardSize + "px"
    }

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
    
    var whiteMove = !(storedgame?.colourPlaying === "BLACK");

    return (
        <Container className={"d-flex flex-row mb-3"}>
        {
            storedgame
            ? (<Chessboard
                position={game.fen()}
                onPieceDrop={onDrop}
                id="BasicBoard"
                boardWidth={chessboardSize}
                onMouseOverSquare={onMouseOverSquare}
                onMouseOutSquare={onMouseOutSquare}
                customSquareStyles={boardEnabled && optionSquares}
                arePiecesDraggable={boardEnabled}
              />)
            : (<Container id="BasicBoard" className={"bg-secondary"} style={placeholderStyle} >Loading</Container>)
        }
        <div id={"moveBoard"} className={"p-2 m-2 mw-75 bg-dark flex-fill rounded text-white"}>
          <Container>
            <div className="row row-cols-2">
              <div id="whiteTimer" className={"col chessMove align-self-start bg-white text-dark text-center"}>
                Time:&nbsp;
                <b>
                  {storedgame?.clockType === "DOWN"
                  ? <CountDown getTime={whiteTime} setTime={setWhiteTime} running={whiteTimerActive} ref={whiteTimer}/>
                  : <CountUp getTime={whiteTime} setTime={setWhiteTime} running={whiteTimerActive} ref={whiteTimer}/>
                  }
                </b>
              </div>
              <div id="blackTimer" className={"col chessMove align-self-end bg-secondary text-center"}>
                Time:&nbsp;
                <b>
                  {storedgame?.clockType === "DOWN"
                  ? <CountDown getTime={blackTime} setTime={setBlackTime} running={blackTimerActive} ref={blackTimer}/>
                  : <CountUp getTime={blackTime} setTime={setBlackTime} running={blackTimerActive} ref={blackTimer}/>
                  }
                </b>
              </div>
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
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="export-dropdown">
            Share game
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="#" disabled={!storedgame?.players}>URL</Dropdown.Item>
            <Dropdown.Item href="#">PGN</Dropdown.Item>
            <Dropdown.Item href="#">FEN</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Container>
    )
}