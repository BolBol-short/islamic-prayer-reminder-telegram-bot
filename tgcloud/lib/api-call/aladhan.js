import { fetch } from 'sdk'
import { getConfig } from '../database/config.js'

export async function getTimings(lat, lon){
    const url = `${await getConfig('ALADHAN_KEY')}/timings?latitude=${lat}&longitude=${lon}&method=3`

    const res = await fetch(url)
    if (!res.ok) throw new Error(`AlAdhan ${res.status}`)

    const body = await res.json()
    const { Fajr, Dhuhr, Asr, Maghrib, Isha } = body.data.timings
    return { Fajr, Dhuhr, Asr, Maghrib, Isha }
}
