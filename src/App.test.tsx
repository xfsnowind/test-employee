import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders Employee Form heading", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /employee form/i });
  if (!heading) throw new Error("heading not found");
});
