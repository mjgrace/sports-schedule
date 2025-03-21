import { render, screen } from "@testing-library/react";
import TeamList from "./FixtureList";

test("renders content", () => {
  render(<FixtureList />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
