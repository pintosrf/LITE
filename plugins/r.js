let { downloadContentFromMessage } = (await import(global.baileys))
const handler = async (m, { conn }) => {
if (!m.fromMe) return
if (!m.quoted) return
if (m.quoted.mtype !== 'viewOnceMessageV2' && m.quoted.mtype !== 'viewOnceMessageV2Extension') return
let media
const msg = m.quoted.message
const type = Object.keys(msg)[0]
if (m.quoted.mtype == 'viewOnceMessageV2') {
media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'videoMessage' ? 'video' : 'audio')
} else {
media = await downloadContentFromMessage(msg[type], 'audio')
}
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
if (/image|video/.test(type)) return await conn.sendFile(conn.user.jid, buffer, null, msg[type].caption || '', m)
if (/audio/.test(type)) {
await conn.sendMessage(conn.user.jid, { audio: buffer, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}}
handler.customPrefix = /(😶|😐|😑|🤨|🧐)/i
handler.command = new RegExp
export default handler