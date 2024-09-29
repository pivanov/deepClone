export type TCloneable = object | number | string | boolean | symbol | bigint | null | undefined;

/**
 * Performs a deep clone of the given object or value. (recursively cloning nested objects and arrays)
 *
It handles circular references, built-in types, and custom class instances.
 *
 * @template T - The type of the object to be cloned, extending TCloneable.
 * @param {T} obj - The object or value to be cloned.
 * @returns {T} A deep clone of the input object or value.
 */
export const deepClone = <T extends TCloneable>(obj: T): T => {
  return internalDeepClone(obj, new WeakMap());
};

/**
 * Internal function that performs the actual deep cloning.
 *
 * @template T - The type of the object to be cloned, extending TCloneable.
 * @param {T} obj - The object or value to be cloned.
 * @param {WeakMap<object, unknown>} seen - A WeakMap to keep track of circular references.
 * @returns {T} A deep clone of the input object or value.
 */
const internalDeepClone = <T extends TCloneable>(obj: T, seen: WeakMap<object, unknown>): T => {
  // Handle primitives, null, and undefined
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Check for circular references
  if (seen.has(obj)) {
    return seen.get(obj) as T;
  }

  // Handle Node.js Buffers
  if (typeof Buffer !== 'undefined' && Buffer.isBuffer(obj)) {
    return Buffer.from(obj) as unknown as T;
  }

  // Handle built-in types that structuredClone can handle efficiently
  if (
    obj instanceof Date ||
    obj instanceof Set ||
    obj instanceof Map ||
    obj instanceof RegExp ||
    obj instanceof ArrayBuffer ||
    ArrayBuffer.isView(obj)
  ) {
    return structuredClone(obj);
  }

  // Handle arrays using a simple for loop for better performance
  if (Array.isArray(obj)) {
    const arrayCopy: unknown[] = new Array(obj.length);
    seen.set(obj, arrayCopy);

    for (let i = 0; i < obj.length; i++) {
      arrayCopy[i] = internalDeepClone(obj[i] as TCloneable, seen);
    }

    return arrayCopy as unknown as T;
  }

  // Handle custom class instances (preserving prototypes)
  if (obj.constructor !== Object) {
    const copy = Object.create(Object.getPrototypeOf(obj)) as T;
    seen.set(obj, copy);

    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        (copy as Record<string, unknown>)[key] = internalDeepClone(
          (obj as Record<string, unknown>)[key] as TCloneable,
          seen,
        );
      }
    }

    return copy;
  }

  // Handle plain objects
  const clonedObj = {} as T;
  seen.set(obj, clonedObj);

  for (const [key, value] of Object.entries(obj)) {
    (clonedObj as Record<string, unknown>)[key] = internalDeepClone(value, seen);
  }

  return clonedObj;
};
