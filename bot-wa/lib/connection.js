import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'
import pino from 'pino'
import qrcode from 'qrcode-terminal'
import config from '../config.js'

const logger = pino({ level: 'silent' })

async function startConnection(handler) {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath)
  const { version } = await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
    browser: [config.botName, 'Chrome', '4.0.0'],
    generateHighQualityLinkPreview: true,
  })

  // Handle connection update
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update

    if (qr) {
      console.log('\n[QR] Scan QR code di bawah ini dengan WhatsApp:')
      qrcode.generate(qr, { small: true })
    }

    if (connection === 'close') {
      const reason = lastDisconnect?.error?.output?.statusCode
      console.log(`[CONN] Koneksi terputus. Reason: ${reason}`)

      if (reason !== DisconnectReason.loggedOut) {
        console.log('[CONN] Reconnecting...')
        startConnection(handler)
      } else {
        console.log('[CONN] Logged out. Hapus folder auth/ dan scan ulang.')
      }
    }

    if (connection === 'open') {
      console.log('[CONN] Bot berhasil terhubung!')
      console.log(`[CONN] Bot Name: ${config.botName}`)
    }
  })

  // Save credentials on update
  sock.ev.on('creds.update', saveCreds)

  // Handle incoming messages
  sock.ev.on('messages.upsert', async (m) => {
    if (m.type !== 'notify') return
    for (const msg of m.messages) {
      if (!msg.message) continue
      if (msg.key.fromMe && !config.selfMode) continue
      try {
        await handler(sock, msg)
      } catch (err) {
        console.error('[ERROR] Handler error:', err)
      }
    }
  })

  // Handle group participants update (welcome/goodbye)
  sock.ev.on('group-participants.update', async (update) => {
    try {
      const { default: groupEvents } = await import('./groupEvents.js')
      await groupEvents(sock, update)
    } catch (err) {
      // groupEvents belum ada, skip
    }
  })

  return sock
}

export default startConnection
