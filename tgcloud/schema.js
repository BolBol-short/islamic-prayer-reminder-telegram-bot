import { table, text, integer, real } from 'sdk/db';

export const config = table('config', {
  key:   text('key').primaryKey(),
  value: text('value').notNull(),
});

export const users = table('users', {
  tgId: integer('tg_id').primaryKey(),
  country: text('country'),
  city: text('city'),
  lat: real('lat'),
  lon: real('lon'),
  tz: text('tz'),
  pendingCountry: text('pending_country'),
});