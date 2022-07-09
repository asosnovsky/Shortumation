import { updateBBox } from "./math";

test("compute bbox correctly", () => {
  expect(
    updateBBox(
      [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      { x: 0, y: 70 },
      {
        height: 70,
        width: 170,
      }
    )
  ).toStrictEqual([
    { x: 0, y: 0 },
    { x: 170, y: 140 },
  ]);
});
