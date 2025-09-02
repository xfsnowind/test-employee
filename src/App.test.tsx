import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Employee Form heading", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /employee form/i })
  ).toBeInTheDocument();
});
