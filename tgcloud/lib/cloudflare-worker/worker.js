import { fetch } from 'sdk'
import { getConfig } from '../database/config.js'

export async function setReminders(chatId, on) {
    const [url, secret] = [await getConfig('WORKER_URL'), await getConfig('SHARED_SECRET')]
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'x-secret': secret, 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, on }),
    })
    if(!res.ok) throw new Error(`Worker ${res.status}`)
}
