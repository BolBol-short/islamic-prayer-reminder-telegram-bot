import { api } from 'sdk'
import { setReminders } from './worker.js'
import { getUser } from './users.js'
import { searchCities } from './geo.js'
import { regionKeyboard, cityKeyboard } from '../lib/keyboards.js'

const reminder = (on) => async (msg) => {
  try {
    await setReminders(msg.chat.id, on)
    await api.sendMessage({ chat_id: msg.chat.id, text: on ? 'Reminder On!' : 'Reminder Off' })
  } catch (e) {
    console.error(e)
    await api.sendMessage({ chat_id: msg.chat.id, text: 'Could not update reminders, try again later.' })
  }
}

async function start(msg){
  await api.sendMessage({ 
    chat_id: msg.chat.id, 
    text: 'Hi lol, use /setlocation to set your location for prayer time. Note: We won\'t take your latitude and longitude location'})
}

async function setLocation(msg){
  await api.sendMessage({
    chat_id: msg.chat.id,
    text: 'Pick your continent: ',
    reply_markup: { inline_keyboard: regionKeyboard() },
  })
}

async function citySearch(msg, countryCode){
  try {
    const results = await searchCities(msg.text, countryCode)
    if(!results.length) {
      return await api.sendMessage({ chat_id: msg.chat.id, text: 'No match. Try again' })
    }
    await api.sendMessage({
      chat_id: msg.chat.id,
      text: 'Pick your City: ',
      reply_markup: { inline_keyboard: cityKeyboard(results)}
    })
  } catch (e) {
    console.error(e)
    await api.sendMessage({ chat_id: msg.chat.id, text: 'Search failed, try again. '})
  }
}

async function unknownCmd(msg){
    await api.sendMessage({
        chat_id: msg.chat.id,
        text: 'Unknown cmd, not found here'
    })
}

async function hint(msg){
    await api.sendMessage({
        chat_id: msg.chat.id,
        text: 'Here are the commands: /setlocation'
    })
}

export const handle = async (msg) => {
  const text = msg.text ?? ''
  const cmd = text.split(/[\s@]/)[0].toLowerCase()
  if (commands[cmd]) return commands[cmd](msg)
  if (text.startsWith('/')) return unknownCmd(msg)
  const user = text && await getUser(msg.from.id)
  if (user?.pendingCountry) return citySearch(msg, user.pendingCountry)
  return hint(msg)
}

export const commands = {
  '/start': start,
  '/setlocation': setLocation,
  '/reminderon': reminder(true),
  '/reminderoff': reminder(false),
}