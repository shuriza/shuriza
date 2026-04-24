import { getUserRole, setUserRole } from '../../database/db.js'
import { fromJid } from '../../lib/utils.js'

export default {
  name: 'deladmin',
  aliases: ['removeadmin', 'unadmin'],
  category: 'bot',
  description: 'Hapus admin bot',
  usage: 'deladmin @tag atau deladmin 08xxxx',
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
        `deladmin @tag\n` +
        `deladmin 08xxxx\n\n` +
        `📝 *Contoh:*\n` +
        `deladmin @user\n` +
        `deladmin 081234567890\n\n` +
        `ℹ️ Bisa juga reply pesan orang yang ingin dicopot dari admin.`
      )
    }

    const currentRole = getUserRole(target)
    if (currentRole !== 'admin') {
      return m.reply(`ℹ️ @${fromJid(target)} bukan admin bot.`)
    }

    setUserRole(target, 'user')
    m.reply(`✅ @${fromJid(target)} berhasil dicopot dari *Admin Bot*.`)
  }
}
