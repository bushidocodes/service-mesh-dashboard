import createTestStore from "json/createTestStore";
import { renderWithIntl } from "utils/i18nTesting";
import LanguageSelector from "./LanguageSelector";

describe("LanguageSelector", () => {
  test("matches snapshot", () => {
    const { asFragment } = renderWithIntl(
      <LanguageSelector />,
      createTestStore()
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
