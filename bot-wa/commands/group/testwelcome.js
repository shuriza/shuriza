import { getGroup } from '../../database/db.js'

export default {
  name: 'testwelcome',
  aliases: [],
  category: 'group',
  description: 'Test pesan welcome',
  usage: '.testwelcome',
  permission: 'admin',
  groupOnly: true,

  run: async ({ sock, m }) => {
    const groupData = getGroup(m.from)

    if (!groupData.welcomeMsg && !groupData.welcomeTitle) {
      return m.reply('Pesan welcome belum diatur! Gunakan .setwelcome terlebih dahulu.')
    }

    let groupMeta
    try {
      groupMeta = await sock.groupMetadata(m.from)
    } catch {
      groupMeta = { subject: 'Test Group', desc: '', participants: [] }
    }

    let text = ''
    if (groupData.welcomeTitle) text += `*${groupData.welcomeTitle}*\n\n`

    const welcomeMsg = groupData.welcomeMsg || 'Selamat datang {user} di {groupname}!'
    text += welcomeMsg
      .replace(/{user}/gi, `@${m.sender.split('@')[0]}`)
      .replace(/{groupname}/gi, groupMeta.subject)
      .replace(/{desc}/gi, groupMeta.desc || '-')
      .replace(/{member}/gi, groupMeta.participants?.length || '0')

    if (groupData.welcomeBody) text += `\n\n${groupData.welcomeBody}`

    await sock.sendMessage(m.from, {
      text: `[TEST WELCOME]\n\n${text}`,
      mentions: [m.sender],
    })
  }
}
