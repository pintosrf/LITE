let { downloadContentFromMessage } = (await import(global.baileys))
let handler = m => m
handler.before = async function (m, { conn }) {
if (m.mtype !== 'viewOnceMessageV2' && m.mtype !== 'viewOnceMessageV2Extension') return
let media, msg, type
if (m.mtype == 'viewOnceMessageV2' || m.mtype == 'viewOnceMessageV2Extension') {
msg = m.mtype == 'viewOnceMessageV2' ? m.message.viewOnceMessageV2.message : m.message.viewOnceMessageV2Extension.message
type = Object.keys(msg)[0]
if (m.mtype == 'viewOnceMessageV2') {
media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'videoMessage' ? 'video' : 'audio')
} else {
media = await downloadContentFromMessage(msg[type], 'audio')
}
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])}
const description = `
🕵️‍♀️ ${type === 'imageMessage' ? '`Imagen`' : type === 'videoMessage' ? '`Vídeo`' : type === 'audioMessage' ? '`Nota de voz`' : 'no definido'} 🕵️
${msg[type].caption ? `- *Caption:* ${msg[type].caption}` : ''}`.trim()
if (/image|video/.test(type)) return await conn.sendFile(conn.user.jid, buffer, null, description, m)
if (/audio/.test(type)) {
await conn.reply(conn.user.jid, description, m)
await conn.sendMessage(conn.user.jid, { audio: buffer, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: m })
}}}
export default handler