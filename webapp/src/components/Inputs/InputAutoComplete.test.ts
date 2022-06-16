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
