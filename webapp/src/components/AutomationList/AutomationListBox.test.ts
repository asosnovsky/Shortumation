import { getTagList } from "./AutomationListBox";
import { createMockAuto } from "utils/mocks";

test("getTagList", () => {
  expect(
    getTagList([
      createMockAuto(),
      createMockAuto(),
      createMockAuto(),
      createMockAuto(),
    ])
  ).toStrictEqual([]);

  expect(
    getTagList([
      createMockAuto({ Room: "Kitchen", Area: "Oven" }),
      createMockAuto({ Room: "Attic" }),
      createMockAuto({ Room: "Office" }),
      createMockAuto({ Area: "Balcony" }),
    ])
  ).toStrictEqual(["Room", "Area"]);
});
