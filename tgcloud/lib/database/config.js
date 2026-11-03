import { db } from 'sdk'
import { eq } from 'sdk/db'
import { config } from '../../schema.js'

export async function getConfig(key) {
    const row = await db.select().from(config).where(eq(config.key, key)).get()
    if (!row) throw new Error(`Config ${key} missing`)
    return row.value
}
