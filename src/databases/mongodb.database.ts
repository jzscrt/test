import { db } from '@config/config';

const scheme: String = 'mongodb+srv://';
const domain: String = db.host;
const query: Object = {
  retryWrites: true,
  w: 'majority',
};

export const mongodb = {
  url: `${scheme}${db.un}:${db.pw}@${domain}/${db.name}?${Object.keys(query)
    .map(key => `${key}=${query[key]}`)
    .join('&')}`,
  options: {},
};
