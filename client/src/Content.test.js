import { render, screen } from "@testing-library/react";
import Content from "./Content";

test("renders content", () => {
  render(<Content />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
