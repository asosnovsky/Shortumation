import { computeNodesEdgesPos } from "./positions"


test('empty nodes', () => {
  const onChange = () => {}
  const openModal = () => { }
  const out = Array.from(computeNodesEdgesPos([0, 0], [], onChange, openModal));
  expect(out).toHaveLength(0)
})

