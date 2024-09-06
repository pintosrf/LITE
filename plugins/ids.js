const handler = async (m, { conn }) => {
if (!m.fromMe) return
const groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats)
for (let i = 0; i < groups.length; i++) {
setTimeout(async () => {
await conn.reply(conn.user.jid, `${groups[i][0]} ${await conn.getName(groups[i][0])}`, m)
}, i * 1000)
}}
handler.command = ['ids']
export default handler