export function dbg<T>(returnedValue: T, ...otherValues: any[]): T {
  console.log(...otherValues, returnedValue)
  return returnedValue
}
