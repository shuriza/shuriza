import { getBot } from '../../database/db.js'
import config from '../../config.js'
import { formatDate, getGreeting } from '../../lib/utils.js'
import os from 'os'

export default {
  name: 'bot',
  aliases: ['info', 'botinfo'],
  category: 'bot',
  description: 'Tampilkan info bot',
  usage: 'bot',
  permission: 'user',

  run: async ({ sock, m }) => {
    const botData = getBot()
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)

    let text = `═[ ${botData.name || config.botName} ]═───···\n\n`
    text += `${getGreeting()}!\n\n`
    text += `Nama Bot  : ${botData.name || config.botName}\n`
    text += `Store     : ${botData.storeName || config.storeName}\n`
    text += `Uptime    : ${hours}j ${minutes}m ${seconds}s\n`
    text += `Platform  : ${os.platform()}\n`
    text += `Tanggal   : ${formatDate()}\n`

    if (botData.info) {
      text += `\n${botData.info}\n`
    }

    text += `\n───···\n`
    text += `Ketik *menu* untuk melihat daftar perintah.`

    m.reply(text)
  }
}
