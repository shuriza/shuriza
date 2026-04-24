import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setleftbody',
  aliases: [],
  category: 'group',
  description: 'Set body pesan left',
  usage: 'setleftbody <body>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      const groupData = getGroup(m.from)
      const current = groupData.leftBody || '(belum diatur)'
      return m.reply(
        `❌ Teks body belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setleftbody <body>\n\n` +
        `📝 *Contoh:*\n` +
        `setleftbody Semoga sukses di luar sana!\n` +
        `setleftbody {user} pamit dari {groupname}. Tinggal {member} member.\n\n` +
        `🔤 *Placeholder yang tersedia:*\n` +
        `• {user} → Mention member yang keluar\n` +
        `• {groupname} → Nama grup\n` +
        `• {member} → Jumlah member\n\n` +
        `📋 *Body saat ini:* ${current}`
      )
    }

    setGroup(m.from, { leftBody: text })
    m.reply(`✅ Left body berhasil diatur!\n\n📋 *Preview:*\n${text}`)
  }
}
