import { useEffect, useState } from 'react';

import { Chessboard } from "react-chessboard";

import { Container } from "react-bootstrap";

import Main from '../../components/Main';

import CountUp from '../../components/CountUp';

export default function Play() {
  const [chessboardSize, setChessboardSize] = useState(320);

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

    var [whiteTimerActive, setWhiteTimerActive] = useState(true);
    var whiteTime = 0;

    var [blackTimerActive, setBlackTimerActive] = useState(false);
    var blackTime = 48;

    return (
      <Main title="Play">
        <h2>Play</h2>
        <Container className={"d-flex flex-row mb-3"}>
          <Chessboard id="BasicBoard" boardWidth={chessboardSize}/>
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