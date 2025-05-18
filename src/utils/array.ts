export namespace ArrayUtil {
  export function popLast<T>(
    array: T[],
    where: (item: T) => boolean,
  ): T | undefined {
    for (let i = array.length - 1; i >= 0; i--) {
      if (where(array[i])) {
        return array.splice(i, 1)[0]
      }
    }
    return undefined
  }

  export function lastOf<T>(array: T[]): T | undefined {
    return array[array.length - 1]
  }

  export function findLastIndex<T>(
    array: T[],
    where: (item: T) => boolean,
  ): number {
    for (let i = array.length - 1; i >= 0; i--) {
      if (where(array[i])) {
        return i
      }
    }
    return -1
  }
}
