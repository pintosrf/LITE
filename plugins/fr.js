let handler = async (m, { conn, text }) => {
if (!m.fromMe) return
if (m.isGroup) return
if (!m.quoted && !text) return
let destino
const jidRegex = /[0-9]+@g\.us/g
const jidMatches = text.match(jidRegex)
const numberRegex = /@[0-9]+/g
const numberMatches = text.match(numberRegex)
let who = numberMatches[0].replace('@', '') + '@s.whatsapp.net'
const sp = '@' + who.split`@`[0]
const fake = text.split`@`[0]
let quotedMessage = {
key: {
participant: who
},
message: {
extendedTextMessage: {
text: fake
}}}
if (m.quoted) {
let q = m.quoted ? m.quoted : m
let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
if (!/audio/.test(mime)) return
let duration = (q.msg || q).seconds * 1000
let media = await q.download?.()
if (jidMatches && jidMatches.length > 0) {
destino = jidMatches[0]
conn.sendPresenceUpdate('recording', destino)
if (text.includes("viewonce")) {
setTimeout(async () => {
await conn.sendMessage(destino, { audio: media, mimetype: 'audio/mpeg', ptt: true, viewOnce: true, mention: who }, { quoted: quotedMessage, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}, duration)
} else {
setTimeout(async () => {
await conn.sendMessage(destino, { audio: media, mimetype: 'audio/mpeg', ptt: true, mention: who }, { quoted: quotedMessage, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}, duration)
}} else if (numberMatches && numberMatches.length > 0) {
conn.sendPresenceUpdate('recording', who)
if (text.includes("viewonce")) {
setTimeout(async () => {
await conn.sendMessage(who, { audio: media, mimetype: 'audio/mpeg', ptt: true, viewOnce: true, mention: who }, { quoted: quotedMessage, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}, duration)
} else {
setTimeout(async () => {
await conn.sendMessage(who, { audio: media, mimetype: 'audio/mpeg', ptt: true, mention: who }, { quoted: quotedMessage, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}, duration)
}}} else {
const splitText = text.split(sp)
const real = splitText.slice(1).join(sp).trim()
let realz = real.split`|`[0].trim()
if (!realz) return
let realfi = `${realz}`
if (jidMatches && jidMatches.length > 0) {
destino = jidMatches[0]
await conn.sendMessage(destino, { text: realz, mentions: conn.parseMention(realfi) }, { quoted: quotedMessage, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
} else if (numberMatches && numberMatches.length > 0) {
await conn.sendMessage(who, { text: realz, mentions: conn.parseMention(realfi) }, { quoted: quotedMessage, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}}}
handler.command = ['pq']
export default handler