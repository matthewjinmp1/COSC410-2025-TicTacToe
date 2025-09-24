import { describe, expect, test, beforeAll, afterAll, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("mega board", () => {
  test("some moves", async () => {
    render(<App />);

    await screen.findByText("Current Player: X");

    fireEvent.click(screen.getByLabelText("0-0"));
    await screen.findByText("Current Player: O"); 
    expect(screen.getByLabelText("0-0").textContent).toBe("X"); 

    fireEvent.click(screen.getByLabelText("0-1"));
    await screen.findByText("Current Player: X"); 
    expect(screen.getByLabelText("0-1").textContent).toBe("O"); 

    fireEvent.click(screen.getByLabelText("0-2"));
    expect(screen.getByLabelText("0-2").textContent).toBe(""); 

    fireEvent.click(screen.getByLabelText("1-0"));
    await screen.findByText("Current Player: O"); 
    expect(screen.getByLabelText("1-0").textContent).toBe("X");

    fireEvent.click(screen.getByLabelText("0-4"));
    await screen.findByText("Current Player: X"); 
    expect(screen.getByLabelText("0-4").textContent).toBe("O");

    fireEvent.click(screen.getByLabelText("4-0"));
    await screen.findByText("Current Player: O"); 
    expect(screen.getByLabelText("4-0").textContent).toBe("X");

    fireEvent.click(screen.getByLabelText("0-7"));
    await screen.findByText("Current Player: X"); 
    expect(screen.getByLabelText("0-7").textContent).toBe("O");

    // fireEvent.click(screen.getByLabelText("8-0"));
    // await screen.findByText("Current Player: O"); 
    // expect(screen.getByLabelText("8-0").textContent).toBe("X");

  });

  test("prevents moves in occupied cells", async () => {
    render(<App />);
    
    await screen.findByText("Current Player: X");
    
    fireEvent.click(screen.getByLabelText("0-0"));
    await screen.findByText("Current Player: O");
    expect(screen.getByLabelText("0-0").textContent).toBe("X");
    
    fireEvent.click(screen.getByLabelText("0-0"));
    await screen.findByText("Current Player: O"); 
    expect(screen.getByLabelText("0-0").textContent).toBe("X");
  });

  test("alternates players correctly", async () => {
    render(<App />);
    
    await screen.findByText("Current Player: X");
    
    fireEvent.click(screen.getByLabelText("0-0"));
    await screen.findByText("Current Player: O");
    
    fireEvent.click(screen.getByLabelText("0-1"));
    await screen.findByText("Current Player: X");
    
    fireEvent.click(screen.getByLabelText("1-0"));
    await screen.findByText("Current Player: O");
  });

  test("restricts moves to active board", async () => {
    render(<App />);
    
    await screen.findByText("Current Player: X");
    
    fireEvent.click(screen.getByLabelText("0-2"));
    await screen.findByText("Current Player: O");
    
    const wrongBoardCell = screen.getByLabelText("1-0");
    fireEvent.click(wrongBoardCell);
    
    await screen.findByText("Current Player: O");
    expect(wrongBoardCell.textContent).toBe("");
  });

});