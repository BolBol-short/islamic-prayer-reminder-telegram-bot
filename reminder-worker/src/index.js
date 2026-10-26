/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export default {
	async scheduled(event, env){
		const [date, time] = new Date().toLocaleString('sv-SE', {timeZone: env.TIMEZONE}).split(' ')
		const now = time.slice(0, 5)
		const key = date.slice(0, 7)
		const day = Number(date.slice(8, 10))

		let month = await env.TIMES.get(key, 'json')
		if (!month){
			console.log('cache miss')
			const url = `${env.ALADHAN_URL}/calendar/${date.slice(0, 4)}/${date.slice(5, 7)}?latitude=${env.LAT}&longitude=${env.LON}&method=3`
			const res = await fetch(url)
			if(!res.ok) throw new Error(`Aladhan ${res.status}`);
			
			const { data } = await res.json()
			month = data.map(d => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(n => d.timings[n].slice(0, 5)))
			await env.TIMES.put(key, JSON.stringify(month), { expirationTtl: 60 * 60 * 24 * 40})
		}

		const times = month[day - 1]

		// shortcut: no "sent" flag, a skipped cron minute loses that reminder; add KV if it ever matters
		for (const [i, name] of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].entries()){
			if (times[i] === now){
				const send = await fetch(`${env.TELEGRAM_API}/bot${env.BOT_TOKEN}/sendMessage`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						chat_id: env.CHAT_ID,
						text: `${name} time: ${now}`
					})
				})
				if (!send.ok) console.error('sendMessage failed', send.status)
			}
		}


	}
};
