/**
 * Utility functions untuk bot
 */

/**
 * Format angka ke Rupiah
 */
export function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID')
}

/**
 * Sleep / delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Generate random string
 */
export function randomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Format tanggal Indonesia
 */
export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

/**
 * Format waktu singkat
 */
export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  }).format(date)
}

/**
 * Cek apakah string adalah URL
 */
export function isUrl(str) {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

/**
 * Parse nomor WA dari berbagai format
 */
export function parsePhoneNumber(text) {
  let num = text.replace(/[^0-9]/g, '')
  if (num.startsWith('0')) num = '62' + num.slice(1)
  if (num.startsWith('+')) num = num.slice(1)
  return num
}

/**
 * Format nomor ke JID
 */
export function toJid(number) {
  const num = parsePhoneNumber(number)
  return num + '@s.whatsapp.net'
}

/**
 * Extract nomor dari JID
 */
export function fromJid(jid) {
  return jid?.split('@')[0] || ''
}

/**
 * Ucapan berdasarkan waktu
 */
export function getGreeting() {
  const hour = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', hour: 'numeric', hour12: false })
  const h = parseInt(hour)
  if (h >= 3 && h < 11) return 'Selamat Pagi'
  if (h >= 11 && h < 15) return 'Selamat Siang'
  if (h >= 15 && h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
}

/**
 * Escape regex special characters
 */
export function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
