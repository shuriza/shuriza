import { getGroup, setGroup } from '../../database/db.js'

export default {
  name: 'setopen',
  aliases: [],
  category: 'group',
  description: 'Set pesan custom saat grup dibuka',
  usage: 'setopen <pesan>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      const groupData = getGroup(m.from)
      const current = groupData.openMsg || '(default)'
      return m.reply(
        `❌ Teks pesan belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setopen <pesan baru>\n\n` +
        `📝 *Contoh:*\n` +
        `setopen Selamat pagi! Grup sudah dibuka, silakan chat.\n` +
        `setopen Grup *OPEN* - Silakan berdiskusi dengan sopan.\n\n` +
        `📋 *Pesan open saat ini:*\n` +
        `${current}`
      )
    }

    setGroup(m.from, { openMsg: text })
    m.reply(`✅ Pesan open berhasil diatur!\n\n📋 *Preview:*\n${text}`)
  }
}
