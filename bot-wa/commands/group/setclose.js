import { setGroup, getGroup } from '../../database/db.js'

export default {
  name: 'setclose',
  aliases: [],
  category: 'group',
  description: 'Set pesan custom saat grup ditutup',
  usage: 'setclose <pesan>',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m, text }) => {
    if (!text) {
      const groupData = getGroup(m.from)
      const current = groupData.closeMsg || '(default)'
      return m.reply(
        `❌ Teks pesan belum diisi!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setclose <pesan baru>\n\n` +
        `📝 *Contoh:*\n` +
        `setclose Grup ditutup. Selamat istirahat!\n` +
        `setclose Grup *CLOSED* - Sampai jumpa besok.\n\n` +
        `📋 *Pesan close saat ini:*\n` +
        `${current}`
      )
    }

    setGroup(m.from, { closeMsg: text })
    m.reply(`✅ Pesan close berhasil diatur!\n\n📋 *Preview:*\n${text}`)
  }
}
