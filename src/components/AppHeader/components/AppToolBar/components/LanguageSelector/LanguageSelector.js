import React from "react";
import { Actions } from "jumpstate";
import { FormattedMessage } from "react-intl";

import LanguageSelectorWrap from "./components/LanguageSelectorWrap";
import LanguageSelectorContent from "./components/LanguageSelectorContent";
import LanguageSelectorOption from "./components/LangaugeSelectorOption";

class LanguageSelector extends React.Component {
  state = {
    visible: false
  };

  onSelectLanguage = (newLocale) => {
    Actions.setUserLocale(newLocale);
    this.setState({ visible: !this.state.visible });
  };

  onClick = () => this.setState({ visible: !this.state.visible });

  render() {
    const { visible } = this.state;
    return (
      <LanguageSelectorWrap onClick={this.onClick} visible={visible}>
        <FormattedMessage
          id="languageSelector.languages"
          defaultMessage="Languages"
          description="Title for languages widget"
        />
        <LanguageSelectorContent visible={visible}>
          <LanguageSelectorOption
            onClick={() => this.onSelectLanguage("en-US")}
          >
            English (en)
          </LanguageSelectorOption>
          <LanguageSelectorOption
            onClick={() => this.onSelectLanguage("es-ES")}
          >
            Español (es)
          </LanguageSelectorOption>
          <LanguageSelectorOption
            onClick={() => this.onSelectLanguage("de-DE")}
          >
            Deutsch (de)
          </LanguageSelectorOption>
        </LanguageSelectorContent>
      </LanguageSelectorWrap>
    );
  }
}

export default LanguageSelector;
