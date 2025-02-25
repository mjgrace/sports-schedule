import { render, screen } from "@testing-library/react";
import Team from "./Team";

test("renders content", () => {
  render(<Team />);
  const linkElement = screen.getByText(/This is some content/i);
  expect(linkElement).toBeInTheDocument();
});
