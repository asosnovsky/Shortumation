import { IteratorWrap } from "./iter"


test('it wraps a simple iter', () => {
  const wit = new IteratorWrap((function* () {
    yield '2'
    return true
  })());
  const data = wit.toArray();
  expect(data).toEqual(['2'])
  expect(wit.returnValue).toEqual(true)
})

test('it wraps a simple iter while being nested', () => {
  const wit = new IteratorWrap((function* () {
    yield '2'
    return true
  })());
  function* makeIter(w: IteratorWrap<string, boolean, any>) {
    yield* w.iter()
  }
  const data = Array.from(makeIter(wit));
  expect(data).toEqual(['2'])
  expect(wit.returnValue).toEqual(true)
})
