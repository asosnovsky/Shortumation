import { validateNode } from "./automations";

test("validate works on bad conditions", () => {
  expect(
    validateNode(
      {
        condition: "and",
        thisshouldnotbehere: "1",
        conditions: "1234",
      } as any,
      ["condition"]
    )
  ).toHaveLength(1);

  expect(
    validateNode(
      {
        event: "triggerme",
      },
      ["condition"]
    )
  ).toHaveLength(2);
});
