import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import { createInterface } from 'readline'
const __dirname = dirname(fileURLToPath(import.meta.url))
const rl = createInterface(process.stdin, process.stdout)
var isRunning = false
async function start(file) {
if (isRunning) return
isRunning = true
let args = [join(__dirname, file), ...process.argv.slice(2)]
setupMaster({exec: args[0], args: args.slice(1)
})
let p = fork()
p.on('message', data => {
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break
}})
p.on('exit', (_, code) => {
isRunning = false
console.error('⚠️ ERROR ⚠️ >> ', code)
start('main.js')
if (code === 0) return
watchFile(args[0], () => {
unwatchFile(args[0])
start(file)
})})
try {
setInterval(() => {}, 1000)
} catch (err) {
console.error(`❌ No se pudo leer el archivo package.json: ${err}`)
}
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())
})}
start('main.js')