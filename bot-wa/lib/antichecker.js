import { getGroup } from '../database/db.js'
import { jidNormalizedUser } from '@whiskeysockets/baileys'
import config from '../config.js'

const linkRegex = /https?:\/\/[^\s]+/gi
const wameRegex = /wa\.me\/[^\s]+/gi

/**
 * Check anti-link dan anti-wame pada pesan grup
 * Dipanggil dari handler sebelum command processing
 */
export async function checkAnti(sock, m) {
  if (!m.isGroup) return false
  if (m.isOwner) return false

  const groupData = getGroup(m.from)

  // Cek apakah sender adalah admin grup
  let senderIsAdmin = false
  try {
    const groupMeta = await sock.groupMetadata(m.from)
    senderIsAdmin = groupMeta.participants.find(p => p.id === m.sender)?.admin
  } catch {
    // skip
  }

  if (senderIsAdmin) return false

  const body = m.body || ''

  // Anti wa.me check
  if ((groupData.antiwame || groupData.antiwame2) && wameRegex.test(body)) {
    try {
      await sock.sendMessage(m.from, { delete: m.key })

      if (groupData.antiwame2) {
        await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove')
        await sock.sendMessage(m.from, {
          text: `@${m.sender.split('@')[0]} telah di-kick karena mengirim link wa.me!`,
          mentions: [m.sender],
        })
      } else {
        await sock.sendMessage(m.from, {
          text: `@${m.sender.split('@')[0]} jangan kirim link wa.me di grup ini!`,
          mentions: [m.sender],
        })
      }
    } catch (err) {
      console.error('[ANTI] Error handling antiwame:', err.message)
    }
    return true
  }

  // Anti link check
  if ((groupData.antilink || groupData.antilink2) && linkRegex.test(body)) {
    // Exclude WhatsApp group link dari grup sendiri
    try {
      const groupCode = await sock.groupInviteCode(m.from)
      if (body.includes(groupCode)) return false
    } catch {
      // skip
    }

    try {
      await sock.sendMessage(m.from, { delete: m.key })

      if (groupData.antilink2) {
        await sock.groupParticipantsUpdate(m.from, [m.sender], 'remove')
        await sock.sendMessage(m.from, {
          text: `@${m.sender.split('@')[0]} telah di-kick karena mengirim link!`,
          mentions: [m.sender],
        })
      } else {
        await sock.sendMessage(m.from, {
          text: `@${m.sender.split('@')[0]} jangan kirim link di grup ini!`,
          mentions: [m.sender],
        })
      }
    } catch (err) {
      console.error('[ANTI] Error handling antilink:', err.message)
    }
    return true
  }

  return false
}
