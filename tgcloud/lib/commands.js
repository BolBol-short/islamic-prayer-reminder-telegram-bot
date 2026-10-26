import { api } from 'sdk'
import { regionKeyboard } from '../lib/keyboards.js'

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
}