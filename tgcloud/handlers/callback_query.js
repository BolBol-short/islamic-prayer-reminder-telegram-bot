import { api } from 'sdk';
import { countryKeyboard, regionKeyboard, subregionKeyboard, PAGE_SIZE } from '../lib/keyboards.js';
import { COUNTRIES } from '../lib/countries.js';
import { saveUser } from '../lib/users.js';
import { getPlace } from '../lib/geo.js';

const screens = {
  r: () => ({ text: 'Pick your continent: ', kb: regionKeyboard() }),
  g: (a) => ({ text: `${a}: pick a region: `, kb: subregionKeyboard(a) }),
  s: (a, b) => ({ text: `${a}: pick your country: `, kb: countryKeyboard(a, Number(b)) }),
  k: (code, _b, q) => countrySelected(code, q),
  p: async (id, _b, q) => {
    const place = await getPlace(id)
    await saveUser(q.from.id, {
      country: place.country_code, city: place.name,
      lat: place.latitude, lon: place.longitude, tz: place.timezone,
      pendingCountry: null,
    })
    return { text: `Location set: ${place.name}, ${place.country}`, kb: []}
  }
}

export default async function (query) {
  const { id, data, message } = query
  const [ kind, a, b ] = data.split(':')
  const screen = await screens[kind]?.(a, b, query)

  if (screen){
    await edit({
      chat_id: message.chat.id,
      message_id: message.message_id,
      text: screen.text,
      reply_markup: { inline_keyboard: screen.kb },
    })
  }

  await api.answerCallbackQuery({ callback_query_id: id})
}

async function countrySelected(code, query){
  await saveUser(query.from.id, { pendingCountry: code })
  const country = COUNTRIES.find(c => c[0] === code)
  const sub = country[4]
  const page = Math.floor(COUNTRIES.filter(c => c[4] === sub).findIndex(c => c[0] === code) / PAGE_SIZE)
  return {
    text: `${country[2]} ${country[1]} selected. Type your city name:`,
    kb: [[{ text: '< Back to countries', callback_data: `s:${sub}:${page}`}]],
  }
}

async function edit(params){
  try{
    await api.editMessageText(params)
  } catch (e) {
    if (!e.description?.includes('not modified')) throw e
  }
}