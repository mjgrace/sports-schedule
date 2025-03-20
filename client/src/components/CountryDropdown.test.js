import { render, screen } from "@testing-library/react";
import CountryDropdown from "./CountryDropdown";

test("renders content", () => {
  render(<CountryDropdown />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
