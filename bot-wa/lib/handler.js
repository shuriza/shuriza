import { readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { serialize } from './serialize.js'
import config from '../config.js'
import { getUserRole } from '../database/db.js'
import { checkAnti } from './antichecker.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const commandsPath = join(__dirname, '..', 'commands')

// Command registry
const commands = new Map()

/**
 * Load semua command dari folder commands/
 */
export async function loadCommands() {
  const categories = readdirSync(commandsPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)

  for (const category of categories) {
    const catPath = join(commandsPath, category)
    const files = readdirSync(catPath).filter(f => f.endsWith('.js'))

    for (const file of files) {
      try {
        const filePath = join(catPath, file)
        const fileUrl = 'file:///' + filePath.replace(/\\/g, '/')
        const mod = await import(fileUrl)
        const cmd = mod.default

        if (!cmd || !cmd.name || !cmd.run) {
          console.log(`[CMD] Skip ${file}: missing name or run`)
          continue
        }

        cmd.category = cmd.category || category
        commands.set(cmd.name, cmd)

        // Register aliases
        if (cmd.aliases && Array.isArray(cmd.aliases)) {
          for (const alias of cmd.aliases) {
            commands.set(alias, cmd)
          }
        }

        console.log(`[CMD] Loaded: ${cmd.name} (${category})`)
      } catch (err) {
        console.error(`[CMD] Error loading ${file}:`, err.message)
      }
    }
  }

  console.log(`[CMD] Total commands loaded: ${commands.size}`)
}

/**
 * Get all unique commands (tanpa alias)
 */
export function getAllCommands() {
  const unique = new Map()
  for (const [key, cmd] of commands) {
    if (cmd.name === key) {
      unique.set(cmd.name, cmd)
    }
  }
  return unique
}

/**
 * Handler utama untuk setiap pesan masuk
 */
export async function handler(sock, rawMsg) {
  const m = serialize(sock, rawMsg)
  if (!m) return

  // Auto read
  if (config.autoRead) {
    await sock.readMessages([m.key])
  }

  // Check anti-link & anti-wame (sebelum command processing)
  try {
    const blocked = await checkAnti(sock, m)
    if (blocked) return
  } catch {
    // skip anti check error
  }

  // Skip jika bukan command
  if (!m.isCommand) return

  // Cari command
  const cmd = commands.get(m.command)
  if (!cmd) return

  // Check group only
  if (cmd.groupOnly && !m.isGroup) {
    return m.reply('Perintah ini hanya bisa digunakan di grup!')
  }

  // Check private only
  if (cmd.privateOnly && m.isGroup) {
    return m.reply('Perintah ini hanya bisa digunakan di private chat!')
  }

  // Permission check
  const userRole = m.isOwner ? 'owner' : getUserRole(m.sender)
  const permLevel = { owner: 3, admin: 2, user: 1 }
  const requiredLevel = permLevel[cmd.permission || 'user'] || 1
  const userLevel = permLevel[userRole] || 1

  if (userLevel < requiredLevel) {
    const roleNames = { 3: 'Owner', 2: 'Admin', 1: 'User' }
    return m.reply(`Akses ditolak! Perintah ini membutuhkan role *${roleNames[requiredLevel]}* atau lebih tinggi.`)
  }

  // Check if bot admin in group (for group management commands)
  if (cmd.botAdmin && m.isGroup) {
    try {
      const groupMeta = await sock.groupMetadata(m.from)
      const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net'
      const botIsAdmin = groupMeta.participants.find(p => p.id === botJid)?.admin
      if (!botIsAdmin) {
        return m.reply('Bot harus menjadi admin grup untuk menggunakan perintah ini!')
      }
    } catch {
      // skip check
    }
  }

  // Check if sender is group admin (for group admin commands)
  if (cmd.groupAdmin && m.isGroup) {
    try {
      const groupMeta = await sock.groupMetadata(m.from)
      const senderIsAdmin = groupMeta.participants.find(p => p.id === m.sender)?.admin
      if (!senderIsAdmin && !m.isOwner) {
        return m.reply('Perintah ini hanya untuk admin grup!')
      }
    } catch {
      // skip check
    }
  }

  // Execute command
  try {
    await cmd.run({ sock, m, msg: rawMsg, args: m.args, text: m.text, command: m.command })
  } catch (err) {
    console.error(`[CMD] Error executing ${m.command}:`, err)
    m.reply(`Terjadi error saat menjalankan perintah: ${err.message}`)
  }
}

export default handler
