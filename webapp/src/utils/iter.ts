

export class IteratorWrap<T, TReturn, TNext> {
  public returnValue: TReturn | null = null;
  constructor(
    private it: Generator<T,TReturn,TNext>
  ) { }
  *iter() {
    let next = this.it.next()
    while (!next.done) {
      yield next.value
      next = this.it.next()
    }
    this.returnValue = next.value
  }
  toArray() {
    return Array.from(this.iter())
  }
}

export function* chain<T>(genArray: Generator<T>[]): Generator<T> {
  for (const gen of genArray) {
    yield * gen
  }
} 

export function* arrayToIter<T>(arr: T[]): Generator<T> {
  for (const e of arr) {
    yield e
  }
}
