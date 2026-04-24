import { getGroup } from '../database/db.js'

/**
 * Handle group participant events (join/leave)
 */
export default async function groupEvents(sock, update) {
  const { id, participants, action } = update

  const groupData = getGroup(id)

  let groupMeta
  try {
    groupMeta = await sock.groupMetadata(id)
  } catch {
    groupMeta = { subject: 'Group', desc: '', participants: [] }
  }

  for (const participant of participants) {
    const userTag = `@${participant.split('@')[0]}`

    if (action === 'add' && groupData.welcome) {
      let text = ''

      if (groupData.welcomeTitle) text += `*${groupData.welcomeTitle}*\n\n`

      const welcomeMsg = groupData.welcomeMsg || `Selamat datang ${userTag} di *${groupMeta.subject}*!`
      text += welcomeMsg
        .replace(/{user}/gi, userTag)
        .replace(/{groupname}/gi, groupMeta.subject)
        .replace(/{desc}/gi, groupMeta.desc || '-')
        .replace(/{member}/gi, groupMeta.participants?.length || '0')

      if (groupData.welcomeBody) text += `\n\n${groupData.welcomeBody}`

      await sock.sendMessage(id, {
        text,
        mentions: [participant],
      })
    }

    if ((action === 'remove' || action === 'leave') && groupData.goodbye) {
      let text = ''

      if (groupData.leftTitle) text += `*${groupData.leftTitle}*\n\n`

      const leftMsg = groupData.leftMsg || `Sayonara ${userTag}! Semoga kita bertemu lagi.`
      text += leftMsg
        .replace(/{user}/gi, userTag)
        .replace(/{groupname}/gi, groupMeta.subject)
        .replace(/{member}/gi, groupMeta.participants?.length || '0')

      if (groupData.leftBody) text += `\n\n${groupData.leftBody}`

      await sock.sendMessage(id, {
        text,
        mentions: [participant],
      })
    }
  }
}
