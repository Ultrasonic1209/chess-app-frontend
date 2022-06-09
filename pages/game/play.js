import { useEffect, useState } from 'react';

import { Chessboard } from "react-chessboard";

import Main from '../../components/main';

export default function Play() {
  const [chessboardSize, setChessboardSize] = useState(undefined);

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
        <div className="container">
          <Chessboard id="BasicBoard" boardWidth={chessboardSize} />
        </div>
      </Main>
    );
  }