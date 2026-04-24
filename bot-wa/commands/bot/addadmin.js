import { getUserRole, setUserRole } from '../../database/db.js'
import { fromJid } from '../../lib/utils.js'

export default {
  name: 'addadmin',
  aliases: ['setadmin'],
  category: 'bot',
  description: 'Tambah admin bot',
  usage: 'addadmin @tag atau addadmin 08xxxx',
  permission: 'owner',

  run: async ({ m, text }) => {
    let target = m.mentionedJid[0]

    if (!target && text) {
      let num = text.replace(/[^0-9]/g, '')
      if (num.startsWith('0')) num = '62' + num.slice(1)
      if (num) target = num + '@s.whatsapp.net'
    }

    if (!target && m.quoted) {
      target = m.quoted.sender
    }

    if (!target) {
      return m.reply(
        `❌ Target tidak ditemukan!\n\n` +
        `📌 *Cara pakai:*\n` +
        `addadmin @tag\n` +
        `addadmin 08xxxx\n\n` +
        `📝 *Contoh:*\n` +
        `addadmin @user\n` +
        `addadmin 081234567890\n\n` +
        `ℹ️ Bisa juga reply pesan orang yang ingin dijadikan admin.`
      )
    }

    const currentRole = getUserRole(target)
    if (currentRole === 'admin') {
      return m.reply(`ℹ️ @${fromJid(target)} sudah menjadi admin bot.`)
    }

    setUserRole(target, 'admin')
    m.reply(`✅ @${fromJid(target)} berhasil dijadikan *Admin Bot*!`)
  }
}
