import { getUsers } from '../../database/db.js'
import { fromJid } from '../../lib/utils.js'

export default {
  name: 'listadmin',
  aliases: ['adminlist'],
  category: 'bot',
  description: 'Lihat daftar admin bot',
  usage: 'listadmin',
  permission: 'owner',

  run: async ({ m }) => {
    const users = getUsers()
    const admins = Object.entries(users)
      .filter(([_, data]) => data.role === 'admin')
      .map(([jid]) => jid)

    if (admins.length === 0) {
      return m.reply(
        `═[ DAFTAR ADMIN BOT ]═───···\n\n` +
        `ℹ️ Belum ada admin bot saat ini.\n\n` +
        `📌 Tambahkan admin dengan:\n` +
        `addadmin @tag\n` +
        `addadmin 08xxxx`
      )
    }

    let text = `═[ DAFTAR ADMIN BOT ]═───···\n\n`
    admins.forEach((jid, i) => {
      text += `${i + 1}. @${fromJid(jid)}\n`
    })
    text += `\nTotal: ${admins.length} admin`

    m.reply(text)
  }
}
