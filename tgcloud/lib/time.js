export function to12hour(hhmm){
    const [h, m] = hhmm.slice(0, 5).split(':')
    const clockSystem = Number(h) < 12 ? 'AM' : 'PM'
    const hourCycle = Number(h) % 12 || 12
    return `${hourCycle}:${m} ${clockSystem}`
}