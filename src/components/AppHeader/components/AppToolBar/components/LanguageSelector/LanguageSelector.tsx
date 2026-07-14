import { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useAppDispatch } from "store/hooks";
import { setUserLocale } from "store/states/settings";
import LanguageSelectorOption from "./components/LangaugeSelectorOption";
import LanguageSelectorContent from "./components/LanguageSelectorContent";
import LanguageSelectorWrap from "./components/LanguageSelectorWrap";

function LanguageSelector() {
  const [visible, setVisible] = useState(false);
  const dispatch = useAppDispatch();

  const onSelectLanguage = (newLocale: string) => {
    dispatch(setUserLocale(newLocale));
    setVisible((v) => !v);
  };

  const onClick = () => setVisible((v) => !v);

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
