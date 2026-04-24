import { jidNormalizedUser, extractMessageContent, areJidsSameUser } from '@whiskeysockets/baileys'
import config from '../config.js'

/**
 * Serialize pesan dari Baileys jadi format yang lebih mudah dipakai
 */
export function serialize(sock, msg) {
  const m = {}

  // Basic info
  m.key = msg.key
  m.id = msg.key.id
  m.from = msg.key.remoteJid
  m.fromMe = msg.key.fromMe
  m.isGroup = m.from?.endsWith('@g.us') || false
  m.sender = m.isGroup
    ? (msg.key.participant || '')
    : m.fromMe
      ? jidNormalizedUser(sock.user?.id)
      : m.from
  m.sender = jidNormalizedUser(m.sender)
  m.pushName = msg.pushName || 'Unknown'

  // Extract message content
  const content = extractMessageContent(msg.message)
  if (!content) return null

  // Determine message type
  const types = Object.keys(content)
  m.type = types[0]

  // Get text body
  m.body = ''
  if (m.type === 'conversation') {
    m.body = content.conversation || ''
  } else if (m.type === 'extendedTextMessage') {
    m.body = content.extendedTextMessage?.text || ''
  } else if (m.type === 'imageMessage') {
    m.body = content.imageMessage?.caption || ''
  } else if (m.type === 'videoMessage') {
    m.body = content.videoMessage?.caption || ''
  } else if (m.type === 'documentMessage') {
    m.body = content.documentMessage?.caption || ''
  } else if (m.type === 'listResponseMessage') {
    m.body = content.listResponseMessage?.singleSelectReply?.selectedRowId || ''
  } else if (m.type === 'buttonsResponseMessage') {
    m.body = content.buttonsResponseMessage?.selectedButtonId || ''
  } else if (m.type === 'templateButtonReplyMessage') {
    m.body = content.templateButtonReplyMessage?.selectedId || ''
  }

  // Check if message has media
  m.isMedia = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(m.type)
  m.isImage = m.type === 'imageMessage'
  m.isVideo = m.type === 'videoMessage'
  m.isSticker = m.type === 'stickerMessage'
  m.isAudio = m.type === 'audioMessage'
  m.isDocument = m.type === 'documentMessage'

  // View once message
  if (m.type === 'viewOnceMessageV2' || m.type === 'viewOnceMessage') {
    const viewOnce = content.viewOnceMessageV2?.message || content.viewOnceMessage?.message
    if (viewOnce) {
      const innerType = Object.keys(viewOnce)[0]
      m.type = innerType
      m.body = viewOnce[innerType]?.caption || ''
      m.isViewOnce = true
      m.isImage = innerType === 'imageMessage'
      m.isVideo = innerType === 'videoMessage'
      m.isMedia = true
    }
  }

  // Quoted message
  const contextInfo = content[m.type]?.contextInfo
  m.quoted = null
  if (contextInfo?.quotedMessage) {
    const quotedContent = extractMessageContent(contextInfo.quotedMessage)
    if (quotedContent) {
      const qType = Object.keys(quotedContent)[0]
      m.quoted = {
        key: {
          remoteJid: m.from,
          fromMe: areJidsSameUser(contextInfo.participant, jidNormalizedUser(sock.user?.id)),
          id: contextInfo.stanzaId,
          participant: contextInfo.participant,
        },
        sender: jidNormalizedUser(contextInfo.participant || ''),
        type: qType,
        body: quotedContent[qType]?.text || quotedContent[qType]?.caption || quotedContent.conversation || '',
        isMedia: ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(qType),
        isImage: qType === 'imageMessage',
        isVideo: qType === 'videoMessage',
        isSticker: qType === 'stickerMessage',
        isViewOnce: qType === 'viewOnceMessageV2' || qType === 'viewOnceMessage',
        message: contextInfo.quotedMessage,
      }
    }
  }

  // Mentioned JIDs
  m.mentionedJid = contextInfo?.mentionedJid || []

  // Parse command (tanpa prefix - langsung dari kata pertama)
  const prefix = config.prefix
  const bodyTrimmed = m.body.trim()

  if (prefix && prefix.length > 0) {
    // Mode pakai prefix
    m.isCommand = bodyTrimmed.startsWith(prefix)
    if (m.isCommand) {
      const full = bodyTrimmed.slice(prefix.length).trim()
      const parts = full.split(/\s+/)
      m.command = parts[0].toLowerCase()
      m.args = parts.slice(1)
      m.text = m.args.join(' ')
    } else {
      m.command = ''
      m.args = []
      m.text = bodyTrimmed
    }
  } else {
    // Mode tanpa prefix - kata pertama = command
    if (bodyTrimmed.length > 0) {
      const parts = bodyTrimmed.split(/\s+/)
      m.command = parts[0].toLowerCase()
      m.args = parts.slice(1)
      m.text = m.args.join(' ')
      m.isCommand = true // akan dicek di handler apakah command valid
    } else {
      m.command = ''
      m.args = []
      m.text = ''
      m.isCommand = false
    }
  }

  // Permission checks
  m.isOwner = config.owner.includes(m.sender.split('@')[0]) || m.fromMe

  // Helper: download media
  m.download = async () => {
    const { downloadMediaMessage } = await import('@whiskeysockets/baileys')
    return downloadMediaMessage(msg, 'buffer', {})
  }

  // Helper: download quoted media
  m.downloadQuoted = async () => {
    if (!m.quoted) return null
    const { downloadMediaMessage } = await import('@whiskeysockets/baileys')
    return downloadMediaMessage({ key: m.quoted.key, message: m.quoted.message }, 'buffer', {})
  }

  // Helper: reply
  m.reply = async (text) => {
    return sock.sendMessage(m.from, { text }, { quoted: msg })
  }

  // Raw message
  m.msg = msg
  m.message = content

  return m
}

export default serialize
