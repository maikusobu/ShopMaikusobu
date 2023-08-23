import { render, screen } from "@testing-library/react";
import Logo from "./logo";
import "@testing-library/jest-dom";
describe("Logo", () => {
  it("renders the logo with the given width and height", () => {
    render(<Logo width={200} height={100} />);
    const logo = screen.getByAltText("Logo");
    expect(logo).toHaveStyle({
      width: "12.5rem",
      height: "6.25rem",
    });
  });
});
