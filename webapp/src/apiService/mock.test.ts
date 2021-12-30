import { useMockAPI } from "./mock"
import { makeAutomationAPI } from "./automations";
import { createMockAuto } from '../utils/mocks';

const fakeUseRef = (a: any) => ({ current: a });

test('mock api uses initial autos for initial population -- empty', async () => {
  const mockApi = makeAutomationAPI(useMockAPI([], fakeUseRef as any));
  const data = await mockApi.list({ limit: 10, offset: 0 });
  expect(data.ok).toBe(true);
  expect((data as any).data.data).toHaveLength(0);
  expect((data as any).data.totalItems).toBe(0);
})

test('mock api uses initial autos for initial population -- some data', async () => {
  const initials = [
    createMockAuto(),
    createMockAuto()
  ];
  const mockApi = makeAutomationAPI(useMockAPI(initials, fakeUseRef as any));
  const data = await mockApi.list({ limit: 10, offset: 0 });
  expect(data.ok).toBe(true);
  expect((data as any).data.data).toHaveLength(2);
  expect((data as any).data.totalItems).toBe(2);
})

test('populate mock api with some data', async () => {
  const mockApi = makeAutomationAPI(useMockAPI([], fakeUseRef as any));
  await mockApi.update({index: 0, auto: createMockAuto()})
  let data = await mockApi.list({ limit: 10, offset: 0 });
  expect(data.ok).toBe(true);
  expect((data as any).data.data).toHaveLength(1);
  expect((data as any).data.totalItems).toBe(1);
  await mockApi.update({index: 1, auto: createMockAuto()})
  data = await mockApi.list({ limit: 10, offset: 0 });
  expect((data as any).data.data).toHaveLength(2);
  expect((data as any).data.totalItems).toBe(2);
})

test('delete/update data from mock api', async () => {
  const mockApi = makeAutomationAPI(useMockAPI([
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
    createMockAuto(),
  ], fakeUseRef as any));
  let data = (await mockApi.list({ limit: 10, offset: 0 }) as any).data.data;
  const toBeEdited = data[0];
  toBeEdited.metadata.alias = "Bob is my uncle";
  await mockApi.update({index: 0, auto: toBeEdited})
  data = (await mockApi.list({ limit: 10, offset: 0 }) as any).data.data;
  expect(data[0].metadata.alias).toEqual("Bob is my uncle");
  await mockApi.remove({index: 0})
  data = (await mockApi.list({ limit: 10, offset: 0 }) as any).data.data;
  expect(data[0].metadata.alias === "Bob is my uncle").toEqual(false);
})
