import { getStore } from '../../database/db.js'
import config from '../../config.js'
import { formatDate } from '../../lib/utils.js'

export default {
  name: 'proses',
  aliases: ['process'],
  category: 'store',
  description: 'Tandai order sedang diproses',
  usage: 'proses @tag keterangan',
  permission: 'admin',

  run: async ({ sock, m, text, args }) => {
    const store = getStore()

    let target = m.mentionedJid[0]
    let keterangan = text

    if (!target && args[0]) {
      const num = args[0].replace(/[^0-9]/g, '')
      if (num) {
        target = (num.startsWith('0') ? '62' + num.slice(1) : num) + '@s.whatsapp.net'
        keterangan = args.slice(1).join(' ')
      }
    }

    if (!target) {
      return m.reply(
        `❌ Tag atau tulis nomor customer!\n\n` +
        `📌 *Cara pakai:*\n` +
        `proses @tag keterangan\n` +
        `proses 08xxxx keterangan\n\n` +
        `📝 *Contoh:*\n` +
        `proses @user Akun Netflix sedang diproses\n` +
        `proses 081234567890 Pesanan sedang disiapkan\n\n` +
        `ℹ️ Keterangan bersifat opsional`
      )
    }

    let message = ''
    if (store.prosesTemplate) {
      message = store.prosesTemplate
        .replace(/{target}/gi, `@${target.split('@')[0]}`)
        .replace(/{keterangan}/gi, keterangan || '-')
        .replace(/{tanggal}/gi, formatDate())
        .replace(/{storename}/gi, config.storeName)
        .replace(/{botname}/gi, config.botName)
    } else {
      message = `═[ ORDER PROSES ⏳ ]═───···\n\n`
      message += `👤 Customer: @${target.split('@')[0]}\n`
      if (keterangan) message += `📝 Keterangan: ${keterangan}\n`
      message += `📅 Tanggal: ${formatDate()}\n`
      message += `\n───···\n`
      message += `Pesanan Anda sedang diproses. Mohon ditunggu!`
    }

    await sock.sendMessage(m.from, {
      text: message,
      mentions: [target],
    }, { quoted: m.msg })
  }
}
