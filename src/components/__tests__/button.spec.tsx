import { render, screen } from "@testing-library/react";
import { Button } from "../button";

describe("<Button />", () => {
  it("should render OK with props", () => {
    const { rerender } = render(
      <Button canClick={true} loading={false} actionText={"test"} />
    );
    screen.getByText("test");

    rerender(<Button canClick={true} loading={true} actionText={"test"} />);
    screen.getByText("Loading...");
  });

  it("should render canClick false class", () => {
    render(<Button canClick={false} loading={false} actionText={"test"} />);
    expect(screen.getByRole("button")).toHaveClass(
      "bg-gray-300 pointer-events-none"
    );
  });
});
