import { useMockAPI } from "./mock";
import { makeAutomationAPI } from "./automations";
import { createMockAuto } from "../utils/mocks";
import { AutomationData } from "types/automations";

const fakeUseRef = (a: any) => ({ current: a });

test("mock api uses initial autos for initial population -- empty", async () => {
  const mockApi = makeAutomationAPI(useMockAPI([], fakeUseRef as any));
  const data = await mockApi.list({ limit: 10, offset: 0 });
  expect(data.ok).toBe(true);
  expect((data as any).data.data).toHaveLength(0);
  expect((data as any).data.totalItems).toBe(0);
});

test("mock api uses initial autos for initial population -- some data", async () => {
  const initials = [createMockAuto(), createMockAuto()];
  const mockApi = makeAutomationAPI(useMockAPI(initials, fakeUseRef as any));
  const data = await mockApi.list({ limit: 10, offset: 0 });
  expect(data.ok).toBe(true);
  expect((data as any).data.data).toHaveLength(2);
  expect((data as any).data.totalItems).toBe(2);
});

test("populate mock api with some data", async () => {
  const mockApi = makeAutomationAPI(useMockAPI([], fakeUseRef as any));
  await mockApi.create(createMockAuto());
  let data = await mockApi.list({ limit: 10, offset: 0 });
  expect(data.ok).toBe(true);
  expect((data as any).data.data).toHaveLength(1);
  expect((data as any).data.totalItems).toBe(1);
  await mockApi.create(createMockAuto());
  data = await mockApi.list({ limit: 10, offset: 0 });
  expect((data as any).data.data).toHaveLength(2);
  expect((data as any).data.totalItems).toBe(2);
});

test("delete/update data from mock api", async () => {
  const mockApi = makeAutomationAPI(
    useMockAPI(
      [
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
      ],
      fakeUseRef as any
    )
  );
  let data = ((await mockApi.list({ limit: 10, offset: 0 })) as any).data.data;
  const toBeEdited = data[0];
  toBeEdited.alias = "Bob is my uncle";
  await mockApi.update(toBeEdited);
  data = ((await mockApi.list({ limit: 10, offset: 0 })) as any).data.data;
  expect(data[0].alias).toEqual("Bob is my uncle");
  await mockApi.remove(data[0]);
  data = ((await mockApi.list({ limit: 10, offset: 0 })) as any).data.data;
  expect(data[0].alias === "Bob is my uncle").toEqual(false);
});

test("update tags from mock api", async () => {
  const mockApi = makeAutomationAPI(
    useMockAPI(
      [
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
        createMockAuto(),
      ],
      fakeUseRef as any
    )
  );
  let data = ((await mockApi.list({ limit: 10, offset: 0 })) as any).data
    .data as AutomationData[];
  const autoId = data[0].id;
  expect(data[0].tags).toStrictEqual({});
  mockApi.updateTags({
    automation_id: autoId,
    tags: {
      room: "bathroom",
      type: "popup",
    },
  });
  data = ((await mockApi.list({ limit: 10, offset: 0 })) as any).data
    .data as AutomationData[];
  expect(data[0].id).toEqual(autoId);
  expect(data[0].tags).toStrictEqual({
    room: "bathroom",
    type: "popup",
  });
});
