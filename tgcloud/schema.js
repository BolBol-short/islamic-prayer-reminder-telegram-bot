import { table, text } from 'sdk/db';

export const config = table('config', {
  key:   text('key').primaryKey(),
  value: text('value').notNull(),
});
