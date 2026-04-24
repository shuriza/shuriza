import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setwelcomebody',
  aliases: [],
  category: 'group',
  description: 'Set body pesan welcome',
  usage: 'setwelcomebody <body>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      const groupData = getGroup(m.from)
      const current = groupData.welcomeBody || '(belum diatur)'
      return m.reply(
        `❌ Teks body belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setwelcomebody <body>\n\n` +
        `📝 *Contoh:*\n` +
        `setwelcomebody Silakan baca rules grup dan perkenalkan diri.\n` +
        `setwelcomebody Hai {user}, selamat bergabung di {groupname}! Total member: {member}\n\n` +
        `🔤 *Placeholder yang tersedia:*\n` +
        `• {user} → Mention member baru\n` +
        `• {groupname} → Nama grup\n` +
        `• {desc} → Deskripsi grup\n` +
        `• {member} → Jumlah member\n\n` +
        `📋 *Body saat ini:* ${current}`
      )
    }

    setGroup(m.from, { welcomeBody: text })
    m.reply(`✅ Welcome body berhasil diatur!\n\n📋 *Preview:*\n${text}`)
  }
}
