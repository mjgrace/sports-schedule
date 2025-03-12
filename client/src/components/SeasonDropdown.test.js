import { render, screen } from "@testing-library/react";
import SeasonDropdown from "./SeasonDropdown";

test("renders content", () => {
  render(<SeasonDropdown />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
