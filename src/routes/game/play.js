import { useEffect, useState } from 'react';

import { Chessboard } from "react-chessboard";

export default function Play() {
  const [chessboardSize, setChessboardSize] = useState(undefined);
  const [selectedBoard, setSelectedBoard] = useState('chessBoard');

  // https://github.com/Clariity/react-chessboard/blob/main/example/src/index.js
  useEffect(() => {
      function handleResize() {
        const display = document.getElementsByClassName('container')[0];
        var size = display.offsetWidth
        if (size >= 720) {
          size /= 2.15
        }
        setChessboardSize(display.offsetWidth);
      }

      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Play</h2>
        <div className="container">
          <Chessboard id="BasicBoard" boardWidth={chessboardSize} />
        </div>
      </main>
    );
  }