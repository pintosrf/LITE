let handler = async (m, { conn, text, args }) => {
if (!m.fromMe) return
if (m.isGroup) return
if (!m.quoted) return
let q = m.quoted ? m.quoted : m
let mime = (m.quoted ? m.quoted : m.msg).mimetype || ''
if (!/audio/.test(mime)) return
let media = await q.download?.()
let duration = (q.msg || q).seconds * 1000
conn.sendPresenceUpdate('recording', args[0])
if (text.includes("viewonce")) {
setTimeout(async () => {
await conn.sendMessage(args[0], { audio: media, mimetype: 'audio/mpeg', ptt: true, viewOnce: true }, { quoted: null, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}, duration)
} else {
setTimeout(async () => {
await conn.sendMessage(args[0], { audio: media, mimetype: 'audio/mpeg', ptt: true }, { quoted: null, ephemeralExpiration: 24*60*100, disappearingMessagesInChat: 24*60*100 })
}, duration)
}}
handler.command = ['ptt']
export default handler