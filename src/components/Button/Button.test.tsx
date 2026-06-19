import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import Button from "./Button";

const types = ["danger", "info", "primary", "warning", "polling"];
const outlines = ["raised", "outline", "shadow", "none", "raised-outline"];
const sizes = ["normal", "xs", "sm", "lg", "xl"];
const orientations = ["vertical", "horizontal"];

const props = {
  active: false,
  clickAction: () => {},
  disabled: false,
  glyph: "Bell",
  glyphColor: "#fff",
  glyphRatio: 1,
  iconSize: "sm",
  label: "Button",
  labelStyle: {},
  orientation: "horizontal",
  outline: "outline",
  prefix: "pre",
  size: "normal",
  style: {},
  suffix: "suff",
  tabIndex: 0,
  type: "primary"
};

describe("Button", () => {
  describe("Snapshots", () => {
    test("matches type snapshots", () => {
      types.forEach((type) => {
        const { asFragment } = render(
          <Button
            type={type as any}
            label={type}
            key={type}
            clickAction={() => {}}
          />
        );
        expect(asFragment()).toMatchSnapshot();
      });
    });

    test("matches outline snapshots", () => {
      outlines.forEach((outline) => {
        const { asFragment } = render(
          <Button
            outline={outline as any}
            label={outline}
            key={outline}
            clickAction={() => {}}
          />
        );
        expect(asFragment()).toMatchSnapshot();
      });
    });

    test("matches size snapshots", () => {
      sizes.forEach((size) => {
        const { asFragment } = render(
          <Button
            size={size as any}
            label={size}
            key={size}
            clickAction={() => {}}
          />
        );
        expect(asFragment()).toMatchSnapshot();
      });
    });

    test("matches orientation snapshots", () => {
      orientations.forEach((orientation) => {
        const { asFragment } = render(
          <Button
            orientation={orientation as any}
            label={orientation}
            key={orientation}
            clickAction={() => {}}
          />
        );
        expect(asFragment()).toMatchSnapshot();
      });
    });

    test("matches prefix/suffix snapshot", () => {
      const { asFragment } = render(
        <Button
          prefix="Prefix"
          suffix="Suffix"
          label="Button"
          clickAction={() => {}}
        />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    test("matches active snapshot", () => {
      const { asFragment } = render(
        <Button active label="Button" clickAction={() => {}} />
      );
      expect(asFragment()).toMatchSnapshot();
    });

    test("matches disabled snapshot", () => {
      const { asFragment } = render(
        <Button disabled label="Button" clickAction={() => {}} />
      );
      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe("Props", () => {
    test("passes correct props to ButtonWrap", () => {
      const clickAction = vi.fn();
      render(
        <Button {...(props as any)} clickAction={clickAction}>
          {["Hello World"]}
        </Button>
      );
      // ButtonWrap is a styled.button; assert the observable DOM produced by the
      // props Button forwards to it.
      const button = screen.getByRole("button");
      // title={label}
      expect(button).toHaveAttribute("title", "Button");
      // tabIndex
      expect(button).toHaveAttribute("tabindex", "0");
      // disabled={false} -> not disabled
      expect(button).not.toBeDisabled();
      // onClick={clickAction}
      fireEvent.click(button);
      expect(clickAction).toHaveBeenCalledTimes(1);
      // NOTE: active, iconSize, orientation, outline, size, style and type have
      // no plain DOM attribute manifestation (they only feed styled-components
      // CSS generation), so they are not directly asserted here. The styled
      // output is covered by the Snapshots describe block above.
    });

    test("passes correct props to Glyph", () => {
      const { container } = render(
        <Button {...(props as any)}>{["Hello World"]}</Button>
      );
      // Glyph renders <g className="glyph" fill={glyphColor} transform=...>
      // with the named glyph (Bell) inside it.
      const glyph = container.querySelector("g.glyph");
      expect(glyph).toBeInTheDocument();
      // glyphColor="#fff"
      expect(glyph).toHaveAttribute("fill", "#fff");
      // ratio=1 -> translate(0 0) scale(1)
      expect(glyph).toHaveAttribute("transform", "translate(0 0) scale(1)");
      // name="Bell" -> Bell glyph renders a <path id="Shape">
      expect(glyph!.querySelector("path#Shape")).toBeInTheDocument();
    });

    test("renders children", () => {
      const { container } = render(
        <Button {...(props as any)}>{["Hello World"]}</Button>
      );
      expect(container).toHaveTextContent("Hello World");
    });
  });
});
