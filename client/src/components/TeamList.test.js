import { render, screen } from "@testing-library/react";
import TeamList from "./TeamList";

test("renders content", () => {
  render(<TeamList />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
