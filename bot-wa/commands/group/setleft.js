import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setleft',
  aliases: ['setgoodbye'],
  category: 'group',
  description: 'Set pesan left/goodbye',
  usage: 'setleft <pesan>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      return m.reply(
        `❌ Teks pesan belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setleft <pesan>\n\n` +
        `📝 *Contoh:*\n` +
        `setleft Sayonara {user}! Semoga kita bertemu lagi.\n` +
        `setleft {user} telah keluar dari {groupname}. Sisa member: {member}\n\n` +
        `🔤 *Placeholder yang tersedia:*\n` +
        `• {user} → Mention member yang keluar\n` +
        `• {groupname} → Nama grup\n` +
        `• {member} → Jumlah member saat ini\n\n` +
        `ℹ️ Pastikan fitur goodbye sudah aktif dengan mengetik: goodbye on`
      )
    }

    setGroup(m.from, { leftMsg: text })
    m.reply(`✅ Pesan left/goodbye berhasil diatur!\n\n📋 *Preview:*\n${text}`)
  }
}
