import { getBot, setBot } from '../../database/db.js'

export default {
  name: 'setbot',
  aliases: [],
  category: 'bot',
  description: 'Set info bot (nama, store, info)',
  usage: 'setbot <field> | <value>',
  permission: 'owner',

  run: async ({ m, text }) => {
    if (!text) {
      const botData = getBot()
      return m.reply(
        `═[ SET BOT ]═───···\n\n` +
        `ℹ️ *Info bot saat ini:*\n` +
        `• Nama  : ${botData.name || '-'}\n` +
        `• Store : ${botData.storeName || '-'}\n` +
        `• Info  : ${botData.info || '-'}\n\n` +
        `📌 *Cara pakai:*\n` +
        `setbot <field> | <value>\n\n` +
        `*Field yang tersedia:* nama, store, info\n\n` +
        `📝 *Contoh:*\n` +
        `setbot nama | Bot Keren\n` +
        `setbot store | Toko Saya\n` +
        `setbot info | Bot store terpercaya sejak 2024`
      )
    }

    const parts = text.split('|').map(s => s.trim())
    if (parts.length < 2) {
      return m.reply(
        `❌ Format salah!\n\n` +
        `📌 *Cara pakai:*\n` +
        `setbot <field> | <value>\n\n` +
        `📝 *Contoh:*\n` +
        `setbot nama | Bot Keren`
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
    m.reply(`✅ Bot ${field} berhasil diatur menjadi: *${value}*`)
  }
}
