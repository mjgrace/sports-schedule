import { render, screen } from "@testing-library/react";
import SeasonList from "./SeasonList";

test("renders content", () => {
  render(<SeasonList />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
