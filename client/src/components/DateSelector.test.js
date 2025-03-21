import { render, screen } from "@testing-library/react";
import DateSelector from "./DateSelector";

test("renders content", () => {
  render(<DateSelector />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
