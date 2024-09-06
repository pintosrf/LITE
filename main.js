process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import { createRequire } from 'module'
import path, { join } from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import { platform } from 'process'
import { readdirSync, unlinkSync } from 'fs'
import yargs from 'yargs'
import fs from 'fs'
import pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import readline from 'readline'
const { DisconnectReason, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, PHONENUMBER_MCC } = await import('@whiskeysockets/baileys')
protoType()
serialize()
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString()
}; global.__dirname = function dirname(pathURL) {
return path.dirname(global.__filename(pathURL, true))
}; global.__require = function require(dir = import.meta.url) {
return createRequire(dir)
}
global.timestamp = { start: new Date }
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[' + (opts['prefix'] || '.').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']')
global.authFile = `LiteSession`
const {state, saveCreds} = await useMultiFileAuthState(global.authFile)
const {version} = await fetchLatestBaileysVersion()
let phoneNumber = ""
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: true
})
const question = (texto) => {
rl.clearLine(rl.input, 0)
return new Promise((resolver) => {
rl.question(texto, (respuesta) => {
rl.clearLine(rl.input, 0)
resolver(respuesta.trim())
})
})
}
const filterStrings = [
"Q2xvc2luZyBzdGFsZSBvcGVu",
"Q2xvc2luZyBvcGVuIHNlc3Npb24=",
"RmFpbGVkIHRvIGRlY3J5cHQ=",
"U2Vzc2lvbiBlcnJvcg==",
"RXJyb3I6IEJhZCBNQUM=",
"RGVjcnlwdGVkIG1lc3NhZ2U="
]
console.info = () => {}
console.debug = () => {}
['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings))
const connectionOptions = {
logger: pino({ level: 'silent' }),
browser: ['Ubuntu', 'Chrome', '20.0.04'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: false,
syncFullHistory: false,
version
}
global.conn = makeWASocket(connectionOptions)
if (!fs.existsSync(`./${authFile}/creds.json`)) {
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(`Ingrese el número de WhatsApp.\nEjemplo: +59899022028\n---> `)
phoneNumber = phoneNumber.replace(/\D/g, '')
} while (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v)))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')
setTimeout(async () => {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
console.log(`CÓDIGO DE VINCULACIÓN:`, (codeBot))
}, 2000)
}}}
conn.isInit = false
conn.well = false
async function connectionUpdate(update) {
const {connection, lastDisconnect, isNewLogin} = update
global.stopped = connection
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error)
global.timestamp.connect = new Date
}
if (connection == 'open') {
console.log(`\n🟢 Se ha conectado con WhatsApp.\n`)}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(`\n⚠️ SIN CONEXIÓN, BORRE LA CARPETA ${global.authFile} ⚠️\n`)
} else if (reason === DisconnectReason.connectionClosed) {
console.log(`\n⚠️ CONEXION CERRADA, RECONECTANDO...\n`)
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionLost) {
console.log(`\n⚠️ CONEXIÓN PERDIDA CON EL SERVIDOR, RECONECTANDO...\n`)
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionReplaced) {
console.log(`\n⚠️ CONEXIÓN REEMPLAZADA, SE HA ABIERTO OTRA NUEVA SESION, POR FAVOR, CIERRA LA SESIÓN ACTUAL PRIMERO.\n`)
} else if (reason === DisconnectReason.loggedOut) {
console.log(`\n⚠️ SIN CONEXIÓN, BORRE LA CARPETA ${global.authFile} ⚠️\n`)
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.restartRequired) {
console.log(`\nCONECTANDO AL SERVIDOR...\n`)
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.timedOut) {
console.log(`\n⌛ TIEMPO DE CONEXIÓN AGOTADO, RECONECTANDO...\n`)
await global.reloadHandler(true).catch(console.error)
} else {
console.log(`\n⚠️❗ RAZON DE DESCONEXIÓN DESCONOCIDA: ${reason || ''} >> ${connection || ''}\n`)
}}}
process.on('uncaughtException', console.error)
let isInit = true
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
if (restatConn) {
const oldChats = global.conn.chats
try {
global.conn.ws.close()
} catch {}
conn.ev.removeAllListeners()
global.conn = makeWASocket(connectionOptions, {chats: oldChats})
isInit = true
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler)
conn.ev.off('message.delete', conn.onDelete)
conn.ev.off('connection.update', conn.connectionUpdate)
conn.ev.off('creds.update', conn.credsUpdate)
}
conn.handler = handler.handler.bind(global.conn)
conn.onDelete = handler.deleteUpdate.bind(global.conn)
conn.connectionUpdate = connectionUpdate.bind(global.conn)
conn.credsUpdate = saveCreds.bind(global.conn, true)
conn.ev.on('messages.upsert', conn.handler)
conn.ev.on('message.delete', conn.onDelete)
conn.ev.on('connection.update', conn.connectionUpdate)
conn.ev.on('creds.update', conn.credsUpdate)
isInit = false
return true
}
const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename))
const module = await import(file)
global.plugins[filename] = module.default || module
} catch (e) {
conn.logger.error(e)
delete global.plugins[filename]
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)
Object.freeze(global.reload)
await global.reloadHandler()
function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
const filePath = join(tmpDir, file)
unlinkSync(filePath)})
}
function purgeOldFiles() {
const directories = ['./LiteSession/']
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
if (file !== 'creds.json') {
const filePath = path.join(dir, file)
unlinkSync(filePath, err => {
if (err) {
console.log(`\n🔴 ARCHIVO 🔴\n ${file} NO SE LOGRÓ BORRAR\n` + err)
} else {
console.log(`\n🟣 ARCHIVO 🟣\n ${file} BORRADO CON ÉXITO\n`)
} }) }
}) }) }) }
function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function() {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
arguments[0] = ""
}
originalConsoleMethod.apply(console, arguments)
}}
setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await clearTmp()
await purgeOldFiles()
}, 1000 * 60 * 60)