const handler = async (m, { conn }) => {
if (!m.fromMe) return
const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
for (let i = 0; i < groups.length; i++) {
const [jid] = groups[i]
const groupName = await conn.getName(jid)
const message = `${jid} ${groupName}`
setTimeout(async () => {
await conn.reply(conn.user.jid, message, m)
}, i * 1000)
}}
handler.command = ['ids']
export default handler