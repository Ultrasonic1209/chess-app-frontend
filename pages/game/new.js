import { useEffect, useState } from 'react';

import { Chessboard } from "react-chessboard";

import { Container } from "react-bootstrap";

import Main from '../../components/main';

export default function Play() {
  const [chessboardSize, setChessboardSize] = useState(320);

  // https://github.com/Clariity/react-chessboard/blob/main/example/src/index.js
  useEffect(() => {
      function handleResize() {
        const display = document.getElementsByClassName('container')[0];
        var size = display.offsetWidth
        if (size >= 720) { // desktop/tablet
          size /= 2.15; // chess board on one side, list of moves on the other
        } else if (size <= 575) { // phone
          size -= 50;
        }
        setChessboardSize(size);
      }

      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <Main title="Play">
        <h2>Play</h2>
        <Container className={"container-md d-flex"}>
          <Chessboard id="BasicBoard" boardWidth={chessboardSize}/>
          <hr className={"d-lg-block"}/>
          <Container className={"d-inline-flex container-md p-2 bd-highlight"}>
            <p>shut</p>
          </Container>
        </Container>
      </Main>
    );
  }