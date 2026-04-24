import { setGroup } from '../../database/db.js'

export default {
  name: 'delleft',
  aliases: ['resetleft'],
  category: 'group',
  description: 'Hapus pesan left custom',
  usage: '.delleft',
  permission: 'admin',
  groupOnly: true,

  run: async ({ m }) => {
    setGroup(m.from, {
      leftMsg: '',
      leftTitle: '',
      leftBody: '',
    })

    m.reply('Pesan left/goodbye berhasil dihapus/direset.')
  }
}
