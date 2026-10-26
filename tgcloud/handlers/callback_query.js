import { api } from 'sdk';
import { countryKeyboard, regionKeyboard, subregionKeyboard, PAGE_SIZE } from '../lib/keyboards.js';
import { COUNTRIES } from '../lib/countries.js';

const screens = {
  r: () => ({ text: 'Pick your continent: ', kb: regionKeyboard() }),
  g: (a) => ({ text: `${a}: pick a region: `, kb: subregionKeyboard(a) }),
  s: (a, b) => ({ text: `${a}: pick your country: `, kb: countryKeyboard(a, Number(b)) }),
  k: (code) => countrySelected(code),
}

export default async function (query) {
  const { id, data, message } = query
  const [ kind, a, b ] = data.split(':')
  const screen = screens[kind]?.(a, b)

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

function countrySelected(code){
  const country = COUNTRIES.find(c => c[0] === code)
  const sub = country[4]
  const page = Math.floor(COUNTRIES.filter(c => c[4] === sub).findIndex(c => c[0] === code) / PAGE_SIZE)
  return {
    text: `${country[2]} ${country[1]} selected. City step comes next.`,
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