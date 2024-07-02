let { downloadContentFromMessage } = (await import(global.baileys))
import { smsg } from './lib/simple.js'
import { fileURLToPath } from 'url'
import path, { join } from 'path'
export async function handler(chatUpdate) {
this.msgqueque = this.msgqueque || []
this.uptime = this.uptime || Date.now()
if (!chatUpdate) {
return
}
if (!chatUpdate || !chatUpdate.messages) {
return
} else {
this.pushMessage(chatUpdate.messages).catch(console.error)
}
let m = chatUpdate.messages[chatUpdate.messages.length - 1]
if (!m) {
return
}
if (global.db.data == null) await global.loadDatabase()
try {
m = smsg(this, m) || m
if (!m)
return
if (opts['nyimak']) return
if (typeof m.text !== 'string')
m.text = ''
if (m.isBaileys) return
let usedPrefix
const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), './plugins')
for (let name in global.plugins) {
let plugin = global.plugins[name]
if (!plugin)
continue
if (plugin.disabled)
continue
const __filename = join(___dirname, name)
if (typeof plugin.all === 'function') {
try {
await plugin.all.call(this, m, {
chatUpdate,
__dirname: ___dirname,
__filename
})
} catch (e) {
console.error(e)
}}
const str2Regex = str => str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')
let _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
let match = (_prefix instanceof RegExp ?
[[_prefix.exec(m.text), _prefix]] :
Array.isArray(_prefix) ?
_prefix.map(p => {
let re = p instanceof RegExp ?
p :
new RegExp(str2Regex(p))
return [re.exec(m.text), re]
}) :
typeof _prefix === 'string' ?
[[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]] :
[[[], new RegExp]]
).find(p => p[1])
if (typeof plugin.before === 'function') {
if (await plugin.before.call(this, m, {
match,
conn: this,
chatUpdate,
__dirname: ___dirname,
__filename
}))
continue
}
if (typeof plugin !== 'function')
continue
if ((usedPrefix = (match[0] || '')[0])) {
let noPrefix = m.text.replace(usedPrefix, '')
let [command, ...args] = noPrefix.trim().split` `.filter(v => v)
args = args || []
let _args = noPrefix.trim().split` `.slice(1)
let text = _args.join` `
command = (command || '').toLowerCase()
let isAccept = plugin.command instanceof RegExp ?
plugin.command.test(command) :
Array.isArray(plugin.command) ?
plugin.command.some(cmd => cmd instanceof RegExp ?
cmd.test(command) :
cmd === command
) :
typeof plugin.command === 'string' ?
plugin.command === command :
false
if (!isAccept)
continue
let extra = {
match,
usedPrefix,
noPrefix,
_args,
args,
command,
text,
conn: this,
chatUpdate,
__dirname: ___dirname,
__filename
}
try {
await plugin.call(this, m, extra)
} catch (e) {
console.error(e)
} finally {
if (typeof plugin.after === 'function') {
try {
await plugin.after.call(this, m, extra)
} catch (e) {
console.error(e)
}}}}}} catch (e) {
console.error(e)
}}
export async function deleteUpdate(message) {
try {
const { m, fromMe, id, participant } = message
if (fromMe) return
let msg = this.serializeM(this.loadMessage(id))
if (!msg) return
let isOnce = msg.mtype == 'viewOnceMessageV2' || msg.mtype == 'viewOnceMessageV2Extension'
if (isOnce) {
let media
let msgg = msg.mtype == 'viewOnceMessageV2' ? msg.message.viewOnceMessageV2.message : msg.message.viewOnceMessageV2Extension.message
const type = Object.keys(msgg)[0]
if (msg.mtype == 'viewOnceMessageV2') {
media = await downloadContentFromMessage(msgg[type], type == 'imageMessage' ? 'image' : 'videoMessage' ? 'video' : 'audio')
} else {
media = await downloadContentFromMessage(msgg[type], 'audio')
}
let buffer = Buffer.from([])
for await (const chunk of media) {
buffer = Buffer.concat([buffer, chunk])
}
if (/image|video/.test(type)) {
return await conn.sendFile(conn.user.jid, buffer, null, `*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*
*┃ ViewOnce (eliminado)*
- *Nombre:* @${participant.split`@`[0]}
${msgg[type].caption ? `- *Caption:* ${msgg[type].caption}` : '- *Caption:* _sin_caption_'}`, null, null, { mentions: [participant], quoted: msg })
} else if (/audio/.test(type)) {
await conn.reply(conn.user.jid, `*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*
*┃ ViewOnce (eliminado)*
- *Nombre:* @${participant.split`@`[0]}
- *Tipo:* Nota de voz🔊`, m, { mentions: [participant], quoted: msg })
await conn.sendMessage(conn.user.jid, { audio: buffer, fileName: 'error.mp3', mimetype: 'audio/mpeg', ptt: true }, { quoted: msg })
}}
let isImageOrVideo = msg.mtype === 'imageMessage' || msg.mtype === 'videoMessage'
if (msg.text && !isImageOrVideo) {
await this.sendMessage(conn.user.jid, { text: `*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*
*┃ Nombre:* @${participant.split`@`[0]}
- *📝Mensaje:* ${msg.text}
*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*`, mentions: [participant] }, { quoted: msg })
} else if (isImageOrVideo) {
let img = await msg.download?.()
await conn.sendFile(conn.user.jid, img, null, `*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*
*┃ Nombre:* @${participant.split`@`[0]}
${msg.text ? `- *Caption:* ${msg.text}` : '- *Caption:* _sin_caption_'}`, null, null, { mentions: [participant], quoted: msg })
} else if (msg.mtype === 'stickerMessage') {
await conn.sendMessage(conn.user.jid, { text: `*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*
*┃ Nombre:* @${participant.split`@`[0]}
*┃ Reenviando sticker..*
*━━━ 👇🏻👇🏻👇🏻👇🏻👇🏻 ━━━*`, mentions: [participant] }, { quoted: msg })
this.copyNForward(conn.user.jid, msg).catch(e => console.log(e, msg))
} else if (!isOnce) {
await conn.sendMessage(conn.user.jid, { text: `*━━━ \`𝘼𝙉𝙏𝙄 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝙍\` ━━━*
*┃ Nombre:* @${participant.split`@`[0]}
*┃ Reenviando contenido borrado..*
*━━━ 👇🏻👇🏻👇🏻👇🏻👇🏻 ━━━*`, mentions: [participant] }, { quoted: msg })
this.copyNForward(conn.user.jid, msg).catch(e => console.log(e, msg))
}} catch (e) {
console.error(e)
}}