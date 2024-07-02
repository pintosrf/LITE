import Jimp from "jimp"
async function resizeImg(image, height) {
let jimp = await Jimp.read(image)
let min = jimp.getWidth()
let max = jimp.getHeight()
let outputRatio = height / Math.max(max, min)
let cropped = jimp.crop(0, 0, min, max)
return {
image: await cropped
.resize(Math.floor(min * outputRatio), Math.floor(max * outputRatio), Jimp.RESIZE_BILINEAR)
.getBufferAsync(Jimp.MIME_JPEG)
}}
const updatePictureProfile = async (content, conn) => {
return new Promise(async (resolve) => {
try {
const media = await resizeImg(content, 720)
await conn.query({
tag: "iq",
attrs: {
to: conn.user.jid,
type: "set",
xmlns: "w:profile:picture"
},
content: [{
tag: "picture",
attrs: { type: "image" },
content: Buffer.from(media.image)
}]
})
resolve({ status: true })
} catch (e) {
console.log(e)
resolve({ status: false })
}})
}
const handler = async (m, { conn }) => {
if (!m.fromMe) return
if (m.isGroup) return
let q = m.quoted ? m.quoted : m
let mime = (q.msg || q).mimetype || q.mediaType || ''
if (mime === 'image/jpeg' || mime === 'image/png') {
let media = await q.download()
let response = await updatePictureProfile(media, conn)
} else return
}
handler.command = ['pp']
export default handler