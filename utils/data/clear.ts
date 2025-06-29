/**
 * Removes all undefined values from an object.
 *
 * @template T
 *
 * @param {T} obj - The object to remove undefined values from.
 *
 * @returns {T} The object with all undefined values removed.
 */
export function clearUndefinedValues<T extends Record<string, unknown>>(
  obj: T,
): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined),
  ) as T;
}
