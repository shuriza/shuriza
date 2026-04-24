import axios from 'axios'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { randomId } from '../../lib/utils.js'

export default {
  name: 'tourl',
  aliases: ['tolink', 'upload'],
  category: 'tools',
  description: 'Upload media ke URL (support img & vid)',
  usage: 'tourl (reply/kirim media)',
  permission: 'user',

  run: async ({ sock, m }) => {
    const hasMedia = m.isMedia || (m.quoted && m.quoted.isMedia)

    if (!hasMedia) {
      return m.reply(`❌ *Media tidak ditemukan!*\n\n📌 *Cara pakai:*\nKirim/reply media lalu ketik *tourl*\n\n📝 *Contoh:*\n> Kirim gambar/video lalu tulis: tourl\n> Atau reply media lalu ketik: tourl\n\nℹ️ Support: gambar, video, audio`)
    }

    try {
      m.reply('⏳ Sedang mengupload media...')

      const buffer = m.isMedia ? await m.download() : await m.downloadQuoted()

      // Upload ke tmpfiles.org (free, no API key needed)
      const FormData = (await import('form-data')).default || (await import('form-data'))
      const form = new FormData()

      const ext = m.isImage || m.quoted?.isImage ? 'jpg'
        : m.isVideo || m.quoted?.isVideo ? 'mp4'
        : m.isAudio || m.quoted?.isAudio ? 'mp3'
        : 'bin'

      form.append('file', buffer, { filename: `upload.${ext}` })

      const res = await axios.post('https://tmpfiles.org/api/v1/upload', form, {
        headers: form.getHeaders(),
        maxContentLength: 50 * 1024 * 1024,
      })

      if (res.data?.data?.url) {
        // Convert tmpfiles URL ke direct link
        const url = res.data.data.url.replace('tmpfiles.org/', 'tmpfiles.org/dl/')
        m.reply(`✅ *Upload berhasil!*\n\n🔗 URL: ${url}\n\nℹ️ _Link berlaku sementara_`)
      } else {
        m.reply('❌ Gagal mengupload media. Coba lagi nanti.')
      }

    } catch (err) {
      m.reply(`❌ Gagal upload: ${err.message}`)
    }
  }
}
