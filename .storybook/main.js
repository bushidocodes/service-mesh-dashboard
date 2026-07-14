/**
 * Storybook v10 configuration. Uses the @storybook/react-vite framework
 * adapter so Storybook builds with the same Vite pipeline as the app
 * (vite.config.js) — no separate webpack toolchain to maintain.
 *
 * The viteFinal hook is intentionally absent: vite.config.js already
 * configures the React plugin, path aliases, and styled-components
 * Babel plugin, and Storybook 10 picks those up automatically.
 *
 * `typescript.reactDocgen: false` disables Storybook's PropType / TS-type
 * auto-extraction step. The default extractor (react-docgen) parses
 * .stories files with babel-parser but doesn't enable preset-react,
 * so the JSX in our stories trips a "Support for the experimental syntax
 * 'jsx' isn't currently enabled" error during `storybook build`. We don't
 * rely on auto-generated argTypes (the stories specify their controls
 * explicitly — see Button.stories.tsx), so disabling docgen is the
 * cleanest fix.
 */
const config = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  typescript: {
    reactDocgen: false
  }
};

export default config;
