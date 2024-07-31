export const pickFields = <T extends object, K extends keyof T>(
  obj: T,
  fields: K[],
): Pick<T, K> => {
  if (typeof obj !== 'object' || !obj || !Array.isArray(fields)) {
    return {} as Pick<T, K>;
  }

  return fields.reduce(
    (acc, field) => {
      if (field in obj) {
        (acc as Record<K, any>)[field] = obj[field];
      }
      return acc;
    },
    {} as Pick<T, K>,
  );
};
