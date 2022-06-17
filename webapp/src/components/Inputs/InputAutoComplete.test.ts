import { computeSimilarity } from "./InputAutoComplete";

test("similarity score", () => {
  const searchTerms = [
    "lught",
    "light",
    "light balcn",
    "light bal",
    "light balcony",
    "Balcony lig",
  ].map((x) => computeSimilarity(x, "light.balcony", "Balcony Light"));
  expect(searchTerms).toStrictEqual(searchTerms.sort());
});

test("similarity score", () => {
  expect(
    computeSimilarity(
      "li",
      "6592b3d6d05d3de6fa26c3dbd2edecc2",
      "Balcony Lights"
    )
  ).toBeGreaterThan(0);
});
