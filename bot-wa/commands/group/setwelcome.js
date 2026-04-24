import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setwelcome',
  aliases: [],
  category: 'group',
  description: 'Set pesan welcome',
  usage: 'setwelcome <pesan>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Teks pesan belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setwelcome <pesan>\n\n` +
        `📝 *Contoh:*\n` +
        `setwelcome Selamat datang {user} di {groupname}!\n` +
        `setwelcome Halo {user}! Kamu member ke-{member}. Baca deskripsi grup ya.\n\n` +
        `🔤 *Placeholder yang tersedia:*\n` +
        `• {user} → Mention member baru\n` +
        `• {groupname} → Nama grup\n` +
        `• {desc} → Deskripsi grup\n` +
        `• {member} → Jumlah member saat ini\n\n` +
        `ℹ️ Pastikan fitur welcome sudah aktif dengan mengetik: welcome on`
      )
    }

    setGroup(m.from, { welcomeMsg: text })
    m.reply(`✅ Pesan welcome berhasil diatur!\n\n📋 *Preview:*\n${text}`)
  }
}
