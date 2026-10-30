import { db, fetch } from 'sdk'
import { eq } from 'sdk/db'
import { config } from '../schema.js'

const get = async (key) => (await db.select().from(config).where(eq(config.key, key)).get())?.value

export async function setReminders(chatId, on) {
    const [url, secret] = [await get('WORKER_URL'), await get('SHARED_SECRET')]
    if (!url || !secret) throw new Error('Worker config missing')
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, on}),
    })
    if(!res.ok) throw new Error(`Worker ${res.status}`)
}