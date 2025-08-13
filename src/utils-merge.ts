export function utilsMerge<T extends object, U extends object>(target: T, source: U): T & U {
  if (typeof target !== 'object' || target === null) return Object.assign({}, source) as T & U;
  if (typeof source !== 'object' || source === null) return Object.assign({}, target) as T & U;

  // รักษา prototype chain ของ target
  const output = Object.create(Object.getPrototypeOf(target));

  // คัดลอก key ของ target
  for (const key of Object.keys(target)) {
    (output as any)[key] = (target as any)[key];
  }

  // รวม key ของ source
  for (const key of Object.keys(source)) {
    const sourceValue = (source as any)[key];
    const targetValue = (target as any)[key];

    if (
      typeof sourceValue === 'object' &&
      sourceValue !== null &&
      typeof targetValue === 'object' &&
      targetValue !== null &&
      !Array.isArray(sourceValue) &&
      !Array.isArray(targetValue)
    ) {
      (output as any)[key] = utilsMerge(targetValue, sourceValue); // recursive merge
    } else if (Array.isArray(sourceValue)) {
      (output as any)[key] = [...sourceValue]; // clone array
    } else {
      (output as any)[key] = sourceValue; // assign primitive or new object
    }
  }

  return output;
}
