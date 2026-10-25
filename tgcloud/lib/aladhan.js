import { fetch, db } from 'sdk';
import { eq } from 'sdk/db';
import { config } from '../schema.js';
import { to12hour } from './time.js'

export async function getTimings(lat, lon){
    const row = await db.select().from(config).where(eq(config.key, 'ALADHAN_KEY')).get()
    if(!row) throw new Error('Error! ALADHAN_KEY missing!')

    const url = `${row.value}/timings?latitude=${lat}&longitude=${lon}&method=3`; 

    const res = await fetch(url)
    if (!res.ok) throw new Error('Error! URL NOT FOUND')

    const body = await res.json()
    const { Fajr, Dhuhr, Asr, Maghrib, Isha } = body.data.timings;
    return { Fajr, Dhuhr, Asr, Maghrib, Isha }
}