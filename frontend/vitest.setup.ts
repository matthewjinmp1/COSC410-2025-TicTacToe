import "@testing-library/jest-dom";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const initial = {
  id: "TEST-1",
  board: Array(9).fill(null),
  current_player: "X",
  winner: null,
  is_draw: false,
  status: "X's turn",
};

const script = [
  {
    board: ["X", null, null, null, null, null, null, null, null],
    current_player: "O",
    winner: null,
    is_draw: false,
    status: "O's turn",
  }
  ,

  {
    board: ["X", "O", null, null, null, null, null, null, null],
    current_player: "X",
    winner: null,
    is_draw: false,
    status: "X's turn",
  }, 

  {
    board: ["X", null, null, null, null, null, null, null, null],
    current_player: "O",
    winner: null,
    is_draw: false,
    status: "X's turn",
  }
  , 

  {
    board: ["X", "O", null, null, "O", null, null, null, null],
    current_player: "X",
    winner: null,
    is_draw: false,
    status: "X's turn",
  }

];

let step = -1;

export const server = setupServer(
  http.post("http://localhost:8000/tictactoe/new", async () => {
      step = -1;
      return HttpResponse.json(initial);
  }),

  http.post("http://localhost:8000/tictactoe/:id/move", async () => {
    step += 1;
    return HttpResponse.json({ id: "TEST-1", ...script[step] });
  })
);
