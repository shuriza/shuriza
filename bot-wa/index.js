import startConnection from './lib/connection.js'
import { handler, loadCommands } from './lib/handler.js'
import config from './config.js'

console.log('═══════════════════════════════════════')
console.log('         BOT WA STORE - Starting       ')
console.log('═══════════════════════════════════════')
console.log(`Bot Name  : ${config.botName}`)
console.log(`Store     : ${config.storeName}`)
console.log(`Prefix    : ${config.prefix}`)
console.log(`Owner     : ${config.owner.join(', ')}`)
console.log('═══════════════════════════════════════')

// Load semua commands
await loadCommands()

// Start WhatsApp connection
await startConnection(handler)
