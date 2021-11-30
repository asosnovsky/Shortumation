

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
