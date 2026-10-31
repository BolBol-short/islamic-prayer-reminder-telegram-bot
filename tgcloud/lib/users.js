import { db } from 'sdk'
import { eq } from 'sdk/db'
import { users } from '../schema.js'

export const getUser = (tgId) => db.select().from(users).where(eq(users.tgId, tgId)).get()

export async function saveUser(tgId, fields){
    await db.insert(users).values({ tgId, ...fields})
        .onConflictDoUpdate({ target: users.tgId, set: fields})
}