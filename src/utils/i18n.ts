import { uniq } from "./collections";

const SUPPORTED_LOCALES = ["de-DE", "en-US", "es-ES"];

const DEFAULT_LOCALE = "en-US";

const LOCALE_ALIASES: Record<string, string> = {
  en: "en-US",
  "en-GB": "en-US",
  es: "es-ES",
  de: "de-DE"
};

/** Nested message catalogs (locale → section → string leaf). */
export type NestedMessages = {
  [key: string]: string | NestedMessages;
};

/**
 * Grabs all unique languages from the user, accounting for aliases
 * Loop through the locales and return as soon as we encounter one
 * that matches a supported locale
 * https://github.com/yahoo/react-intl/issues/1089#issuecomment-361743913
 *
 * @export
 * @returns string
 */
export function getLocale() {
  // Create array of all possible user languages and filter out duplicates
  // Lookup the locale name if it is aliased
  const locales = uniq(
    ([] as (string | undefined)[])
      .concat(
        navigator.languages as string[],
        navigator.language,
        navigator.userLanguage,
        navigator.browserLanguage,
        navigator.systemLanguage
      )
      // The legacy vendor-prefixed navigator.* properties may be undefined;
      // drop those before aliasing/matching.
      .filter((locale): locale is string => Boolean(locale))
      .map((locale) => LOCALE_ALIASES[locale] || locale)
  );

  // return the first locale that matches one of our supported locales
  const preferredLocale = locales.find((locale) =>
    SUPPORTED_LOCALES.includes(locale)
  );

  return preferredLocale || DEFAULT_LOCALE;
}

/**
 * Takes a nested object and returns a flattened
 * object according to React Intl v1's semantics
 * This helper function was taken from react-intl docs:
 * https://github.com/yahoo/react-intl/wiki/Upgrade-Guide#flatten-messages-object
 *
 * @export
 * @param {NestedMessages} nestedMessages
 * @param {string} prefix
 * @returns
 */
export function flattenMessages(
  nestedMessages: NestedMessages,
  prefix = ""
): Record<string, string> {
  return Object.keys(nestedMessages).reduce(
    (messages: Record<string, string>, key: string) => {
      let value = nestedMessages[key];
      let prefixedKey = prefix ? `${prefix}.${key}` : key;

      if (typeof value === "string") {
        messages[prefixedKey] = value;
      } else {
        Object.assign(messages, flattenMessages(value, prefixedKey));
      }

      return messages;
    },
    {}
  );
}
