// Utility function to deeply merge two objects
export function utilsMerge<T, U>(target: T, source: U): T & U {
  if (typeof target !== 'object' || typeof source !== 'object' || target === null || source === null) {
    return Object.assign({}, target, source);
  }
  // Support class instances by preserving prototype chain
  const output = Object.create(Object.getPrototypeOf(target));
  // Copy target properties
  Object.getOwnPropertyNames(target).forEach((key) => {
    output[key] = (target as any)[key];
  });
  // Merge source properties
  for (const key of Object.getOwnPropertyNames(source)) {
    const sourceValue = (source as any)[key];
    const targetValue = output[key];
    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      targetValue !== null
    ) {
      output[key] = utilsMerge(targetValue, sourceValue);
    } else {
      output[key] = sourceValue;
    }
  }
  return output;
}
