# How to Contribute

Grey Matter Fabric Dashboard is [Decipher's](http://www.deciphernow.com/) largest open-source project. To date, most development work is performed by Decipher employees, but we welcome issues and pull requests from external contributors. In the spirit of making this project as transparent and easy to contribute to as possible, this document provides a set of guidelines for contributing to the dashboard. It's loosely inspired by the [React Contributor's Guide](https://reactjs.org/docs/how-to-contribute.html) and the [Brad Frost Frontend Guidelines Questionnaire](https://github.com/bradfrost/frontend-guidelines-questionnaire).

**Table of Contents**

[Open Development](#open-development)
[Branch Organization](#branch-organization)
[Semantic Versioning](#semantic-versioning)
[Bugs](#bugs)
[How to Get in Touch](#how-to-get-in-touch)
[Proposing a Change](#proposing-a-change)
[Getting Started](#getting-started)
[Style Guide](#style-guide)

## Open Development

All work on Grey Matter Fabric Dashboard occurs directly on [GitHub](https://github.com/DecipherNow/gm-fabric-dashboard). All core team members and external contributors follow the same review process.

## Branch Organization

We use the [Git Feature Branch Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/feature-branch-workflow). All feature branches should be branched off `master` and all pull requests should be sent against `master`. We usually squash-merge feature branches into master.

## Semantic Versioning

For each release, we strive to follow [sematic versioning](https://semver.org/) and document the changes associated with each release in our CHANGELOG. Generally, we cut a new release at the end of every two-week sprint.

## Bugs

### Where to Find Known Issues

We use [GitHub Issues](https://github.com/DecipherNow/gm-fabric-dashboard/issues) for our public bugs. We use labels to triage issues and assign core contributors to the issue when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide relevant screenshots and console errors.

## How to Get in Touch

Send us an e-mail at gmfabricui\<at\>deciphernow\<dot\>com

## Proposing a Change

If you intend file a pull request with a bug fix or enhancement, we recommend filing an issue. This lets us reach an agreement on your proposal before you put significant effort into it.

## Getting Started

### Editor plugins

Follow the steps outlined in the [README](https://github.com/DecipherNow/gm-fabric-dashboard/blob/master/README.md) and install the following plugins for your editor:

* Biome (formatter + linter)
* stylelint
* styled-components syntax highlighting

### Commit Messages

We follow [conventional commit](https://conventionalcommits.org/) standards as a convention. They are not enforced by a commit hook.

#### Format
Commit messages should consist of a type and a subject:
`<type>: <subject>`

#### Type
Please use one of the following verbs as your type. Types should always be lowercase.

  - build: changes that affect the build system or external dependencies
  - ci: changes to circleci configuration
  - chore: package manager configs, etc; no production code change
  - docs: changes to documentation
  - feat: a new feature
  - fix: a bug fix
  - perf: a change that improves performance
  - refactor: a change that neither fixes a bug nor adds a feature
  - revert: updating build tasks, package manager configs, etc; no production code change
  - style: changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc.)
  - test: adding new tests or updating existing tests 

#### Subject
The subject of your commit should be less than 72 characters and should not begin with a capital letter or end with punctuation. Use present tense when writing your subject, e.g. update vs. updated.

## Style Guide

### General

* All UI elements should be implemented using component-based architecture, idiomatic React, and JSX.
* All Stylesheets should be implemented using styled-components, not in-line styles or external stylesheets.
* All components should be broken out into distinct files and follow a hierarchical directory structure. Please refer to [this blog post](https://medium.com/@alexmngn/how-to-better-organize-your-react-applications-2fd3ea1920f1) to better understand the technique
* Reuse UI elements when possible. Refer to our internal `storybook` to see what is available
* Avoid bringing in external CSS libraries or frameworks.
* Stay consistent with the Decipher brand guide
* All submissions should include function-level documentation using the JSDocs syntax
* All PRs should strive for full test coverage.
* Test your code locally using `npm test` prior to pushing your branch to origin. Our CI infrastructure will fail your build if any tests fail
* Respect our browser support matrix
* All submissions should respect this [Web Accessibility Checklist](https://a11yproject.com/checklist.html) and allow easy navigation for keyboard-only users and screen readers.
* Group import statements into the following types: NPM Module, Internal Import of sibling or child file, External Import of ancestor file using an absolute path from the project root
* Add PropTypes for all props. Use Shapes for complex objects

### jsx

1. Use class-based React components for stateful components and functional React components for stateless components. Avoid use of React.createClass.
2. When writing functional React components, use the traditional `function` syntax, not ES6 arrow functions
3. Use camel case when naming props
4. Omit the value of the prop if passing the boolean `true`
5. Use React 16 fragments to avoid excessive wrapping divs.

### styled-components

1. Try to keep props general and theme-oriented. If you find yourself adding a prop to a styled component to render a very specific CSS property (e.g., just to add padding or margin, etc), don’t
2. Instead, add the style inline, or if it is more than 1 or 2 properties, extend the styled-component
3. Document props that you do add
4. Avoid nested ternaries within styled-components. If you need to do this, it probably means you should `extend`.
