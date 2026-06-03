import {
  INSTANCE_ID_LENGTH,
  calculateErrorPercent,
  clearFabricIntervalIfNeeded,
  convertMS,
  formatAsDecimalString,
  relativeReqPercent,
  blurTableRow,
  slugify,
  trimID
} from "./index";
import { slugifyMicroservice } from "utils";
import React from "react";
import { render, fireEvent } from "@testing-library/react";
import TableRow from "components/Main/components/TableRow";
import "jest-styled-components";

describe("trimID", () => {
  test("returns an empty string if not provided an ID", () => {
    expect(trimID()).toEqual("");
  });
  test("returns the rightmost possible substring", () => {
    expect(trimID("Decipher", 3)).toEqual("her");
  });
  test("uses INSTNACE_ID_LENGTH when desired length is not provided", () => {
    expect(trimID("Decipher Tech Studios")).toEqual(
      trimID("Decipher Tech Studios", INSTANCE_ID_LENGTH)
    );
  });
  test("returns the entire ID when desired length is longer than the length of the actual ID", () => {
    expect(trimID("Decipher", 20)).toEqual("Decipher");
  });
});

describe("clearFabricIntervalIfNeeded", () => {
  test("Initialize window.refreshFabricIntervalID for test", () => {
    window.refreshFabricIntervalID = setInterval(
      () => console.log("interval set"),
      3000
    );
    // The exact interval ID depends on how many timers have been created
    // before this test runs; just assert that an ID was assigned.
    expect(typeof window.refreshFabricIntervalID).toBe("number");
  });
  test("clears an interval with ID equal to window.refreshFabricIntervalID", () => {
    clearFabricIntervalIfNeeded();
    expect(window.refreshFabricIntervalID).toBe(null);
  });
});

describe("convertMS", () => {
  test("takes milliseconds and returns an array of time units in [00d, 00h, 00m, 00s] format", () => {
    expect(convertMS(1510172807556)).toEqual(["17478d", "20h", "26m", "47s"]);
    expect(convertMS(72807556)).toEqual(["20h", "13m", "27s"]);
    expect(convertMS(0)).toEqual([]);
  });
  test("returns undefined when invalid prop is passed", () => {
    expect(convertMS("not a number")).toEqual([]);
    expect(convertMS("")).toEqual([]);
  });
  test('works on string number such as "0.477112"', () => {
    expect(convertMS("342342451")).toEqual(["03d", "23h", "05m", "42s"]);
  });
});
describe("relativeReqPercent", () => {
  const testArray = [
    { name: "Fries", requests: 4000 },
    { name: "Taco", requests: 200 },
    { name: "Salad", requests: 100 }
  ];

  const testArrayWithSomeMatchingKeys = [
    { name: "Fries", requests: 300 },
    { name: "Taco" },
    { name: "Salad", requests: 20 }
  ];

  const key = "requests";

  test("Takes an array of objects and key and returns a new field relativeReqPercent added to each object", () => {
    expect(relativeReqPercent(testArray, key)).toEqual([
      { name: "Fries", relativeReqPercent: 100, requests: 4000 },
      { name: "Taco", relativeReqPercent: 5, requests: 200 },
      { name: "Salad", relativeReqPercent: 2.5, requests: 100 }
    ]);
  });
  test("returns original array if no key is passed", () => {
    expect(relativeReqPercent(testArray)).toEqual(testArray);
  });
  test("returns original array if there is no corresponding key", () => {
    expect(relativeReqPercent(testArray, "not a valid key")).toEqual(testArray);
  });
  test("returns original array all objects don't have the key ", () => {
    expect(
      relativeReqPercent(testArrayWithSomeMatchingKeys, "not a valid key")
    ).toEqual(testArrayWithSomeMatchingKeys);
  });
});
describe("calculateErrorPercent", () => {
  test("returns a string representation of error percentage with three decimal places without % sign ", () => {
    expect(calculateErrorPercent(23425, 4134)).toEqual("17.648");
  });
  test("returns 0.000 if request is zero", () => {
    expect(calculateErrorPercent(0, 4134)).toEqual("0");
  });
  test("returns 0.000 if error is zero", () => {
    expect(calculateErrorPercent(54435, 0)).toEqual("0");
  });
});
describe("formatAsDecimalString", () => {
  test("trims decimals after three places", () => {
    expect(formatAsDecimalString(0.4254134)).toEqual("0.425");
    expect(formatAsDecimalString(0.8)).toEqual("0.8");
  });

  test('works on number string such as "0.477112" ', () => {
    expect(formatAsDecimalString("0.477112")).toEqual("0.477");
  });

  test("returns the parameter when it is invalid", () => {
    expect(formatAsDecimalString("I am not a valid number")).toEqual(
      "I am not a valid number"
    );
  });
});

describe("blurTableRow", () => {
  test("traverses up the DOM until it finds a TableRow ancestor and removes focus", () => {
    const spy = jest.fn((e) => blurTableRow(e));
    // In production, babel-plugin-styled-components makes the TableRow <li>
    // render with class "sc-xxx hash TableRow" — the component name appears
    // after the hash, not at position 0. This div mimics that pattern so we
    // can verify that includes("TableRow") finds it regardless of position.
    const { container, getByText } = render(
      <div className="sc-fake hash123 TableRow" tabIndex={0}>
        <div>
          <span onClick={spy}>Words</span>
        </div>
      </div>
    );
    const tableRowEl = container.firstChild;
    const span = getByText("Words");

    tableRowEl.focus();
    expect(document.activeElement).toBe(tableRowEl);

    fireEvent.click(span);

    expect(spy).toHaveBeenCalled();
    expect(document.activeElement).not.toBe(tableRowEl);
  });

  test("does not crash when no ancestor has a TableRow class", () => {
    const spy = jest.fn((e) => blurTableRow(e));
    const { getByText } = render(
      <div>
        <span onClick={spy}>Words</span>
      </div>
    );
    expect(() => fireEvent.click(getByText("Words"))).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });
});

describe("slugify", () => {
  test("replaces spaces with dashes", () => {
    expect(slugify("a b c")).toEqual("a-b-c");
  });
  test("strips out unsafe characters", () => {
    expect(slugify("[()=:.,!#$@\"'/|?*+&]")).toEqual("");
  });
  test("strips out leading and trailing dashes characters", () => {
    expect(slugify("-m-")).toEqual("m");
  });
  test("replaces multiple dashes with a single dash", () => {
    expect(slugify("thug-------life")).toEqual("thug-life");
  });
  test("coverts strings to lower case", () => {
    expect(slugify("USAUSAUSA")).toEqual("usausausa");
  });
});

describe("slugifyMicroservice", () => {
  test("combines a service name and version into a param passed to slugify", () => {
    const slugify = jest.fn();
    slugifyMicroservice("Awesome Service", "1.0", slugify);
    expect(slugify.mock.calls[0]).toEqual(["Awesome Service-v1-0"]);
  });
  test("produces a valid slug", () => {
    expect(slugifyMicroservice("Awesome Service", "1.0")).toEqual(
      "awesome-service-v1-0"
    );
  });
});
