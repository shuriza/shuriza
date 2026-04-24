import { getBot, setBot } from '../../database/db.js'

export default {
  name: 'updatesetbot',
  aliases: [],
  category: 'bot',
  description: 'Update setting bot',
  usage: 'updatesetbot <field> | <value>',
  permission: 'owner',

  run: async ({ m, text }) => {
    if (!text) {
      const botData = getBot()
      return m.reply(
        `═[ UPDATE BOT ]═───···\n\n` +
        `ℹ️ *Setting saat ini:*\n` +
        `• Nama  : ${botData.name || '-'}\n` +
        `• Store : ${botData.storeName || '-'}\n` +
        `• Info  : ${botData.info || '-'}\n\n` +
        `📌 *Cara pakai:*\n` +
        `updatesetbot <field> | <value baru>\n\n` +
        `*Field yang tersedia:* nama, store, info\n\n` +
        `📝 *Contoh:*\n` +
        `updatesetbot nama | Bot Baru\n` +
        `updatesetbot store | Toko Baru\n` +
        `updatesetbot info | Deskripsi baru untuk bot`
      )
    }

    const parts = text.split('|').map(s => s.trim())
    if (parts.length < 2) {
      return m.reply(
        `❌ Format salah!\n\n` +
        `📌 *Cara pakai:*\n` +
        `updatesetbot <field> | <value baru>\n\n` +
        `📝 *Contoh:*\n` +
        `updatesetbot nama | Bot Baru`
      )
    }

    const [field, value] = parts
    const botData = getBot()

    switch (field.toLowerCase()) {
      case 'nama':
      case 'name':
        botData.name = value
        break
      case 'store':
      case 'storename':
        botData.storeName = value
        break
      case 'info':
        botData.info = value
        break
      default:
        return m.reply(
          `❌ Field *${field}* tidak valid!\n\n` +
          `ℹ️ Field yang tersedia: *nama*, *store*, atau *info*`
        )
    }

    setBot(botData)
    m.reply(`✅ Bot ${field} berhasil diupdate menjadi: *${value}*`)
  }
}
