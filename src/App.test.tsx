import { render, screen } from "@testing-library/react";
import App from "./App";
import { describe, test, expect } from "vitest";

describe("test", () => {
  test("renders Employee Form heading", () => {
    render(<App />);
    const heading = screen.getByRole("heading", { name: /employee form/i });
    if (!heading) throw new Error("heading not found");
    expect(heading).toBeInTheDocument();
  });
});
