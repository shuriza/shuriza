import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setwelcometitle',
  aliases: [],
  category: 'group',
  description: 'Set title/header pesan welcome',
  usage: 'setwelcometitle <title>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      const groupData = getGroup(m.from)
      const current = groupData.welcomeTitle || '(belum diatur)'
      return m.reply(
        `❌ Teks title belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setwelcometitle <title>\n\n` +
        `📝 *Contoh:*\n` +
        `setwelcometitle Selamat Datang!\n` +
        `setwelcometitle Member Baru Bergabung\n\n` +
        `🔤 *Placeholder yang tersedia:*\n` +
        `• {user} → Mention member baru\n` +
        `• {groupname} → Nama grup\n` +
        `• {member} → Jumlah member\n\n` +
        `📋 *Title saat ini:* ${current}`
      )
    }

    setGroup(m.from, { welcomeTitle: text })
    m.reply(`✅ Welcome title berhasil diatur!\n\n📋 *Preview:*\n*${text}*`)
  }
}
