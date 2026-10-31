import { db, fetch } from 'sdk'
import { eq } from 'sdk/db'
import { config } from '../schema.js'

async function base(){
    const row = await db.select().from(config).where(eq(config.key, 'GEOCODING_URL')).get()
    if(!row) throw new Error('GEOCODING_URL missing')
    return row.value
}

export async function searchCities(name, countryCode) {
    const res = await fetch(`${await base()}/search?name=${encodeURIComponent(name)}&count=5&language=en&countryCode=${countryCode}`)
    if(!res.ok) throw new Error(`Geocoding ${res.status}`)
    const { results = [] } = await res.json()
    return results
}

export async function getPlace(id){
    const res = await fetch(`${await base()}/get?id=${id}`)
    if (!res.ok) throw new Error(`Geocoding ${res.status}`)
    return await res.json()
}