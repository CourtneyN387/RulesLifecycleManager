import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hello rain text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello Rain/i);
  expect(linkElement).toBeInTheDocument();
});
