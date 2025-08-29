import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

describe("App", () => {
  it("renders and responds to interaction", async () => {
    // userEvent.setup wraps interactions in act automatically
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial app title (ensures initial effects settle)
    await screen.findByText(/gorstan/i);

    // Try to find a start button or similar interaction (optional path)
    const startButtons = screen.queryAllByRole("button", { name: /start/i });
    const firstStart = startButtons[0];
    if (firstStart) {
      await user.click(firstStart);
      // Await something that appears after starting to flush follow-up effects
      await screen.findByText(/console/i);
    }
  });
});
