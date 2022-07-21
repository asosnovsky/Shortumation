import { isAutomationTimeString24Hours } from "./time";

test("isAutomationTimeString24Hours to parse correctly", () => {
  expect(isAutomationTimeString24Hours("00:01")).toEqual(true);
  expect(isAutomationTimeString24Hours("10:01")).toEqual(true);
  expect(isAutomationTimeString24Hours("12:01")).toEqual(true);
  expect(isAutomationTimeString24Hours("12:01:01")).toEqual(true);
  expect(isAutomationTimeString24Hours("22:01:01")).toEqual(true);
  expect(isAutomationTimeString24Hours("23:01:01")).toEqual(true);

  expect(isAutomationTimeString24Hours("@:01:01")).toEqual(false);
  expect(isAutomationTimeString24Hours("input_datetime.time")).toEqual(false);
  expect(isAutomationTimeString24Hours("sensor.me_yes")).toEqual(false);
  expect(isAutomationTimeString24Hours("25:01:01")).toEqual(false);
});
