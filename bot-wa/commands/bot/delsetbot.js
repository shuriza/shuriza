import { getBot, setBot } from '../../database/db.js'
import config from '../../config.js'

export default {
  name: 'delsetbot',
  aliases: ['resetbot'],
  category: 'bot',
  description: 'Reset setting bot ke default',
  usage: 'delsetbot',
  permission: 'owner',

  run: async ({ m }) => {
    const botData = {
      name: config.botName,
      storeName: config.storeName,
      info: '',
      sewa: [],
    }

    setBot(botData)
    m.reply(
      `✅ Setting bot berhasil direset ke default!\n\n` +
      `ℹ️ *Nilai default:*\n` +
      `• Nama  : ${config.botName}\n` +
      `• Store : ${config.storeName}\n` +
      `• Info  : -`
    )
  }
}
