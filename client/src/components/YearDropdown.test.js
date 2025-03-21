import { render, screen } from "@testing-library/react";
import YearDropdown from "./YearDropdown";

test("renders content", () => {
  render(<YearDropdown />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
