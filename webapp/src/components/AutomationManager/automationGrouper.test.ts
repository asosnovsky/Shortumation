import { convertGroupingToItems, makeGrouping } from "./automationGrouper";
import { bigMockAutoList, createMockAuto } from "utils/mocks";
import { AutomationListAuto } from "./types";

const automations: AutomationListAuto[] = [
  createMockAuto({
    Room: "Living Room",
    Type: "Lights",
  }),
  createMockAuto({
    Room: "Living Room",
    Type: "Climate",
  }),
  createMockAuto({
    Room: "Kitchen",
    Type: "Climate",
  }),
  createMockAuto({
    Type: "Climate",
  }),
  createMockAuto({
    Room: "Living Room",
  }),
  createMockAuto({}),
].map<AutomationListAuto>((a) => ({
  title: a.metadata.alias ?? "",
  entityId: "automation." + a.metadata.id,
  description: a.metadata.description ?? "",
  state: "on",
  tags: a.tags,
  id: a.metadata.id,
  isSelected: false,
}));

const bigList = bigMockAutoList.map<AutomationListAuto>((a) => ({
  entityId: "automation." + a.metadata.id,
  title: a.metadata.alias ?? "",
  description: a.metadata.description ?? "",
  state: "on",
  tags: a.tags,
  id: a.metadata.id,
  isSelected: false,
}));

test("no grouping", () => {
  const grouped = makeGrouping(automations, [], automations[0].id);
  expect(grouped.top).toStrictEqual([0]);
  expect(grouped.getAutomations(0)).toStrictEqual([0, 1, 2, 3, 4, 5]);
});
test("1 grouping", () => {
  const grouped = makeGrouping(automations, ["Room"], automations[0].id);
  expect(grouped.top).toHaveLength(3);
  expect(grouped.getAutomations(0)).toStrictEqual([0, 1, 4]);
  expect(grouped.getAutomations(1)).toStrictEqual([2]);
  expect(grouped.getAutomations(2)).toStrictEqual([3, 5]);
});
test("2 groupings", () => {
  const grouped = makeGrouping(
    automations,
    ["Room", "Type"],
    automations[0].id
  );
  expect(grouped.top).toHaveLength(3);
  expect(grouped.getAutomations(grouped.top[0])).toHaveLength(0);
  expect(grouped.getSubGroups(grouped.top[0])).toHaveLength(3);
  expect(grouped.getAutomations(grouped.top[1])).toHaveLength(0);
  expect(grouped.getSubGroups(grouped.top[1])).toHaveLength(1);
  expect(grouped.getAutomations(grouped.top[2])).toHaveLength(2);
  expect(grouped.getSubGroups(grouped.top[2])).toHaveLength(0);
});
test("bigAutoList groupings has not duplicate ids", () => {
  const grouped = makeGrouping(bigList, ["Room", "Remote"], bigList[0].id);
  const flattenAndCount = (gid: number): Record<number, number[]> => {
    const subgroups = grouped.getSubGroups(gid);
    if (subgroups.length > 0) {
      return flattenAndConsolidate(subgroups);
    } else {
      return grouped
        .getAutomations(gid)
        .reduce((sum: Record<number, number[]>, b) => {
          sum[b] = (sum[b] ?? []).concat(gid);
          return sum;
        }, {});
    }
  };
  const flattenAndConsolidate = (gids: number[]): Record<number, number[]> =>
    gids.map(flattenAndCount).reduce((a, b) => {
      for (const k of Object.keys(b).map(Number)) {
        a[k] = (a[k] ?? []).concat(b[k]);
      }
      return a;
    }, {});
  const countedAutos = flattenAndConsolidate(grouped.top);
  for (const key of Object.keys(countedAutos).map(Number)) {
    expect(countedAutos[key]).toHaveLength(1);
  }
});

test("convert grouper to items when no tags are selected", () => {
  const grouping = makeGrouping(automations, [], null);
  const items = grouping.top.map((i) =>
    convertGroupingToItems(i, "", automations, grouping)
  );
  expect(items.filter((i) => i.type === "group")).toHaveLength(0);
  expect(items).toHaveLength(1);
  expect(items[0].data).toHaveLength(automations.length);
});

test("convert grouper to items when 1 tag is selected", () => {
  const grouping = makeGrouping(automations, ["Room"], null);
  const items = grouping.top.map((i) =>
    convertGroupingToItems(i, "", automations, grouping)
  );
  expect(grouping.top).toHaveLength(3);
  expect(items.filter((i) => i.type === "group")).toHaveLength(0);
  expect(items).toHaveLength(3);
  expect(items[0].data).toHaveLength(3);
  expect(items[1].data).toHaveLength(1);
  expect(items[2].data).toHaveLength(2);
  expect(items[0].title).toEqual("Living Room");
  expect(items[1].title).toEqual("Kitchen");
  expect(items[2].title).toEqual("");
});

test("convert grouper to items when 2 tag is selected", () => {
  const grouping = makeGrouping(automations, ["Room", "Type"], null);
  const items = grouping.top.map((i) =>
    convertGroupingToItems(i, "", automations, grouping)
  );
  expect(grouping.top).toHaveLength(3);
  expect(items.filter((i) => i.type === "group")).toHaveLength(2);
  expect(items.filter((i) => i.type === "items")).toHaveLength(1);
  expect(items).toHaveLength(3);
  expect(items[0].data).toHaveLength(3);
  expect(items[1].data).toHaveLength(1);
  expect(items[2].data).toHaveLength(2);
});
