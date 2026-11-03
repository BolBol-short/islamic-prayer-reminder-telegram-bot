import { fetch } from 'sdk'
import { getConfig } from '../database/config.js'

const base = () => getConfig('GEOCODING_URL')

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
