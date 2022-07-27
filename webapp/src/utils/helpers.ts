export const cleanUpUndefined = (data: Record<string, any>): any => {
  const clean: any = {};
  Object.keys(data).forEach((k) => {
    if (data[k] !== undefined && data[k] !== null) {
      clean[k] = data[k];
    }
  });
  return clean;
};
