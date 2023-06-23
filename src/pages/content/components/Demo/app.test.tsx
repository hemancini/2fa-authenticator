import App from "@pages/content/components/Demo/app";
import { render, screen } from "@testing-library/react";

describe("appTest", () => {
  test("render text", () => {
    // given
    const text = "content view";

    // when
    render(<App />);

    // then
    screen.getByText(text);
  });
});
