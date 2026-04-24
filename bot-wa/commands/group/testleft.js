import { getGroup } from '../../database/db.js'

export default {
  name: 'testleft',
  aliases: ['testgoodbye'],
  category: 'group',
  description: 'Test pesan left/goodbye',
  usage: '.testleft',
  permission: 'admin',
  groupOnly: true,

  run: async ({ sock, m }) => {
    const groupData = getGroup(m.from)

    if (!groupData.leftMsg && !groupData.leftTitle) {
      return m.reply('Pesan left belum diatur! Gunakan .setleft terlebih dahulu.')
    }

    let groupMeta
    try {
      groupMeta = await sock.groupMetadata(m.from)
    } catch {
      groupMeta = { subject: 'Test Group', participants: [] }
    }

    let text = ''
    if (groupData.leftTitle) text += `*${groupData.leftTitle}*\n\n`

    const leftMsg = groupData.leftMsg || 'Sayonara {user}!'
    text += leftMsg
      .replace(/{user}/gi, `@${m.sender.split('@')[0]}`)
      .replace(/{groupname}/gi, groupMeta.subject)
      .replace(/{member}/gi, groupMeta.participants?.length || '0')

    if (groupData.leftBody) text += `\n\n${groupData.leftBody}`

    await sock.sendMessage(m.from, {
      text: `[TEST LEFT]\n\n${text}`,
      mentions: [m.sender],
    })
  }
}
