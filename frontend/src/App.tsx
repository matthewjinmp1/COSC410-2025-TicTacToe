import React from "react";
import TicTacToe from "@/components/TicTacToe";
import "./app.css";

type Player = "X" | "O";

interface Game {
  id: string;
  board: (Player | null)[];
  winner: Player | null;
  is_draw: boolean;
  status: string;
}

const API_BASE = "http://localhost:8000";

async function createGame(starting_player: Player = "X"): Promise<Game> {
  const r = await fetch(`${API_BASE}/tictactoe/new`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ starting_player }),
  });
  if (!r.ok) throw new Error("Failed to create game");
  return r.json();
}

async function playMove(gameId: string, index: number, player: Player): Promise<Game> {
  const r = await fetch(`${API_BASE}/tictactoe/${gameId}/move`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ index, player }),
  });
  if (!r.ok) throw new Error("Failed to play move");
  return r.json();
}

export default function App() {
  const [miniBoards, setMiniBoards] = React.useState<Game[] | null>(null);
  const [megaBoard, setMegaBoard] = React.useState<Game | null>(null);
  const [player, setPlayer] = React.useState<Player>("X");
  const [activeBoard, setActiveBoard] = React.useState<number | null>(null); // which mini-board is playable

  React.useEffect(() => {
    init();
  }, []);

  async function init() {
    // Create 9 mini boards + 1 mega board concurrently
    const minisPromise = Promise.all(Array.from({ length: 9 }, () => createGame("X")));
    const megaPromise = createGame("X");
    const [minis, mega] = await Promise.all([minisPromise, megaPromise]);

    setMiniBoards(minis);
    setMegaBoard(mega);
    setPlayer("X");
    setActiveBoard(null); // free choice on the first move
  }

  async function handleMiniMove(miniIndex: number, cellIndex: number) {
    if (!miniBoards || !megaBoard) return;
    if (activeBoard !== null && activeBoard !== miniIndex) return; // not your board

    const mini = miniBoards[miniIndex];
    if (mini.winner || mini.is_draw || mini.board[cellIndex]) return; // already resolved or occupied

    // 1) Play move on the selected mini-board
    const updatedMini = await playMove(mini.id, cellIndex, player);
    const newMinis = miniBoards.slice();
    newMinis[miniIndex] = updatedMini;
    setMiniBoards(newMinis);

    // 2) If that mini-board was just won, mark the mega-board at the same index
    let updatedMega = megaBoard;
    if (updatedMini.winner) {
      updatedMega = await playMove(megaBoard.id, miniIndex, player);
      setMegaBoard(updatedMega);
    }

    // 3) Choose next active mini-board (based on cellIndex you just played)
    const destination = newMinis[cellIndex];
    const destinationLocked = !destination || destination.winner !== null || destination.is_draw === true;

    setActiveBoard(updatedMega.winner || destinationLocked ? null : cellIndex);

    // 4) Toggle player
    setPlayer((p) => (p === "X" ? "O" : "X"));
  }

  function reset() {
    init();
  }

  if (!miniBoards || !megaBoard) {
    return <div>Loading...</div>;
  }

  function Status() {
    if (!megaBoard || !miniBoards) return;
    if (megaBoard.winner) {
      return <div className="center">{megaBoard.status}</div>;
    }

    let finished_boards = 0;
    for (let i = 0; i < 9; i++) {
      if (miniBoards[i].winner || miniBoards[i].is_draw) {
        finished_boards++;
      }
    }

    if (finished_boards === 9) {
      return <div className="center">Draw</div>;
    }

    return <div className="center">Current Player: {player}</div>;
  }

  return (
    <div data-testid="app">
      <Status />

      <div className="center">
        <div className="mega_board">
          {miniBoards.map((game, index) => {
            const disabled = !!megaBoard.winner || (activeBoard !== null && activeBoard !== index); // parent-level lock

            return (
              <TicTacToe
                key={index}
                game={game}
                miniIndex={index}
                disabled={disabled}
                highlight={activeBoard === index}
                onCellClick={(cellIdx) => handleMiniMove(index, cellIdx)}
              />
            );
          })}
        </div>
      </div>

      <div className="center">
        <button onClick={reset}>New Game</button>
      </div>
    </div>
  );
}
