import crud from '@/rest/crud'

export default {
  methods: {
    deleteChip (index) {
      this.attachments.splice(index, 1)
    },
    async download (url, files) {
      files.forEach(async (file) => {
        const resp = await crud(`${url}/${file.fieldname}/${file.filename}`).get()
        const data = await resp.json()
        const downloadLink = document.createElement('a')
        downloadLink.href = data.file
        downloadLink.download = file.originalname
        downloadLink.click()
      })
    }
  }
}
