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
		const url = `${env.ALADHAN_URL}/timings?latitude=${env.LAT}&longitude=${env.LON}&method=3`
		const res = await fetch(url, { cf: {cacheTtl: 86400 }})
		if(!res.ok) throw new Error(`Aladhan ${res.status}`);
		const { data } = await res.json()

		const timezone = data.meta.timezone
		const now = new Intl.DateTimeFormat('en-GB', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23'}).format(new Date())

		// shortcut: no "sent" flag, a skipped cron minute loses that reminder; add KV if it ever matters
		for (const name of ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']){
			if (data.timings[name].slice(0, 5) === now){
				const send = await fetch(`${env.TELEGRAM_API}/bot${env.BOT_TOKEN}/sendMessage`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ 
						chat_id: env.CHAT_ID,
						text: `${name} time: ${now}`,
						}
					)
				})
				if (!send.ok) console.error('sendMessage failed', send.status);
			}
		}
	}
};
