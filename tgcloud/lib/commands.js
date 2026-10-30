import { api } from 'sdk'
import { regionKeyboard } from '../lib/keyboards.js'
import { setReminders } from './worker.js'

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

export const handle = (msg) => {
    const text = msg.text ?? ''
    const cmd = text.split(/[\s@]/)[0].toLowerCase()
    if (commands[cmd]) return commands[cmd](msg)
    return (text.startsWith('/') ? unknownCmd : hint)(msg)
}

export const commands = {
  '/start': start,
  '/setlocation': setLocation,
  '/reminderon': reminder(true),
  '/reminderoff': reminder(false),
}