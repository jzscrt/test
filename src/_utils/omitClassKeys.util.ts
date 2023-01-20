export const omitClassKeys = (object: any, keys: string | string[]) => {
  const retObj = {};
  Object.keys(object).forEach(key => {
    if (key !== keys || !keys.includes(key)) retObj[key] = object[key];
  });
  return retObj;
};
