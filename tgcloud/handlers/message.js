import { api } from 'sdk';
import { getTimings } from '../lib/aladhan.js';
import { to12hour } from '../lib/time.js';

export default async function (message, ctx) {
  const chat_id = message.chat.id

  if (message.location){
    const { latitude, longitude } = message.location
    const times = await getTimings(latitude, longitude)
    const text = Object.entries(times)
      .map(([name, t]) => `${name} ${to12hour(t)}`)
      .join('\n');
    await api.sendMessage({ chat_id, text })
    return
  }

  await api.sendMessage({
    chat_id,
    text: 'Share your location to get prayer times.',
    reply_markup: {
      keyboard: [[{
        text: 'Share location',
        request_location: true,
      }]],
      resize_keyboard: true,
      one_time_keyboard: true,
    }
  })
}
