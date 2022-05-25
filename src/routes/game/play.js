import { Chessboard } from "react-chessboard";

export default function Play() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Play</h2>
        <div>
          <Chessboard id="BasicBoard" />
        </div>
      </main>
    );
  }