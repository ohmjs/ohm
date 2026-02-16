export function assert(cond: boolean, message = 'Assertion failed'): asserts cond {
  if (!cond) throw new Error(message);
}

export function checkNotNull<T>(x: T, msg = 'unexpected null value'): NonNullable<T> {
  assert(x != null, msg);
  return x as NonNullable<T>;
}
