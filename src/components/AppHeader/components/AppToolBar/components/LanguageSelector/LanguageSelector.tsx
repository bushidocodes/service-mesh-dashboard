import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { Actions } from "store/jumpstate";
import LanguageSelectorOption from "./components/LangaugeSelectorOption";
import LanguageSelectorContent from "./components/LanguageSelectorContent";
import LanguageSelectorWrap from "./components/LanguageSelectorWrap";

function LanguageSelector() {
  const [visible, setVisible] = useState(false);

  const onSelectLanguage = (newLocale: string) => {
    // Locale still via Actions until PR-16 migrates the settings slice to RTK.
    Actions.setUserLocale(newLocale);
    setVisible((prev) => !prev);
  };

  const onClick = () => setVisible((prev) => !prev);

  return (
    <LanguageSelectorWrap
      onClick={onClick}
      visible={visible}
      data-testid="language-selector"
    >
      <FormattedMessage
        id="languageSelector.languages"
        defaultMessage="Languages"
        description="Title for languages widget"
      />
      <LanguageSelectorContent visible={visible}>
        <LanguageSelectorOption onClick={() => onSelectLanguage("en-US")}>
          English (en)
        </LanguageSelectorOption>
        <LanguageSelectorOption onClick={() => onSelectLanguage("es-ES")}>
          Español (es)
        </LanguageSelectorOption>
        <LanguageSelectorOption onClick={() => onSelectLanguage("de-DE")}>
          Deutsch (de)
        </LanguageSelectorOption>
      </LanguageSelectorContent>
    </LanguageSelectorWrap>
  );
}

export default LanguageSelector;
