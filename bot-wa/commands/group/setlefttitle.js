import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setlefttitle',
  aliases: [],
  category: 'group',
  description: 'Set title pesan left',
  usage: 'setlefttitle <title>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      const groupData = getGroup(m.from)
      const current = groupData.leftTitle || '(belum diatur)'
      return m.reply(
        `❌ Teks title belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setlefttitle <title>\n\n` +
        `📝 *Contoh:*\n` +
        `setlefttitle Sampai Jumpa!\n` +
        `setlefttitle Ada Member Keluar\n\n` +
        `🔤 *Placeholder yang tersedia:*\n` +
        `• {user} → Mention member yang keluar\n` +
        `• {groupname} → Nama grup\n` +
        `• {member} → Jumlah member\n\n` +
        `📋 *Title saat ini:* ${current}`
      )
    }

    setGroup(m.from, { leftTitle: text })
    m.reply(`✅ Left title berhasil diatur!\n\n📋 *Preview:*\n*${text}*`)
  }
}
