import { COUNTRIES } from "./countries.js";

export const PAGE_SIZE = 8
const unique = (list) => [...new Set(list)].sort()
const pairs = (buttons) => {
    const rows = []
    for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2))
    return rows
}

export function regionKeyboard(){
    return unique(COUNTRIES.map(c => c[3])).map(r => [{ text: r, callback_data: `g:${r}`}])
}

export function subregionKeyboard(region){
    const subs = unique(COUNTRIES.filter(c => c[3] === region).map(c => c[4]))
    return [
        ...pairs(subs.map(s => ({ text: s, callback_data: `s:${s}:0`}))),
        [{ text: '< Back', callback_data: 'r' }],
    ]
}

export function countryKeyboard(subregion, page = 0){
    const all = COUNTRIES.filter(c => c[4] === subregion)
    const items = all.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
    const rows = pairs(items.map(([code, name, flag]) => ({ text: `${flag} ${name}`, callback_data: `k:${code}`})))

    const nav = []
    if (page > 0) nav.push({text: '< Prev', callback_data: `s:${subregion}:${page - 1}`})
    if ((page + 1) * PAGE_SIZE < all.length) nav.push({ text: 'Next >', callback_data: `s:${subregion}:${page + 1}`})
    if (nav.length) rows.push(nav)

    rows.push([{ text: `< Back to ${all[0][3]}`, callback_data: `g:${all[0][3]}` }])
    return rows;
}

export function cityKeyboard(results){
    return results.map(p => [{ text: `${p.name}, ${p.admin1 ?? p.country}`, callback_data: `p:${p.id}`}])
}