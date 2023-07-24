import store from '@/store'
import * as html2pdf from 'html2pdf.js'

export const capitalize = (value) => {
  if (value) return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
  return ''
}

export function getFullName (data) {
  if (data && data.firstName && data.lastName) return `${data.firstName} ${data.middleName} ${data.lastName}`
  return ''
}

export const downloadFile = (blob, name) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.download = name
  document.body.appendChild(link)
  link.click()
  window.URL.revokeObjectURL(url)
  link.parentNode.removeChild(link)
}

export const convertToTSV = (arr) => {
  if (arr.length === 0 || arr[0] === undefined) return 'No such report found.'
  const headers = [...arr].sort((a, b) => Object.keys(a).length - Object.keys(b).length).reverse()
  const array = [Object.keys(headers[0])].concat(arr)
  return array.map(it => Object.values(it).join('\t').toString()).join('\n')
}

export const dataURLToFile = (url, filename, mimeType) => {
  const file = fetch(url).then((res) => {
    return res.arrayBuffer()
  }).then((buf) => {
    return new File([buf], filename, { type: mimeType })
  })
  return file
}

export const uploadNestedForm = (data, nestedSchema = []) => {
  const form = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && !nestedSchema.includes(key)) {
      value.forEach((entry) => {
        form.append(key, entry)
      })
    }
    if (nestedSchema.includes(key)) {
      form.append(key, JSON.stringify(value))
    } else {
      form.append(key, value)
    }
  })
  return form
}

export const fileUploadForm = (keys, data, arrayList = []) => {
  const form = new FormData()
  keys.forEach((key) => {
    const val = data[key]
    if (Array.isArray(val) && !arrayList.includes(key)) {
      val.forEach((entry) => {
        form.append(key, entry)
      })
    }
    if (val && arrayList.includes(key)) {
      form.append(key, JSON.stringify(val))
    } else {
      form.append(key, val)
    }
  })
  return form
}

export function toDateString (dt) {
  let date = new Date()
  if (dt && dt !== '') date = new Date(dt)
  return `${monthName(date.getMonth())} ${date.getDate()}, ${date.getFullYear()}`
}

export function monthName (i) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return monthNames[i]
}

export function getScYr (dt) {
  let date = new Date()
  if (dt && dt !== '') date = new Date(dt)

  const year = date.getFullYear()
  if (date.getMonth() < 8) return `SY ${year - 1} - ${year}` // august
  else return `SY ${year} - ${year + 1}`
}

export function dateAndTimeCreated (date) {
  const d = new Date(date)
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
}

export function avgCharacter (arr) {
  if (!arr || !arr.length) return ''
  const behavior = store.state.defaults.behavior
  const sorted = [...arr].sort((a, b) => behavior.indexOf(a) - behavior.indexOf(b))
    .map((i) => {
      return {
        char: i.split('-')[0],
        int: arr.filter((a) => a === i).length
      }
    })
  return sorted.find((i) => i.int === Math.max(...sorted.map((i) => i.int))).char
}

export function html2Pdf (element, opt) {
  html2pdf().from(element).set(opt).toPdf().get('pdf').then(function (pdf) {
    const totalPages = pdf.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)
      pdf.setFontSize(9)
      pdf.setLineWidth(2)
      pdf.rect(20, 10, 558, 800)
      pdf.text(`Page ${i} of ${totalPages}`, (pdf.internal.pageSize.getWidth()) - 75, pdf.internal.pageSize.getHeight() - 20)
    }

    window.open(pdf.output('bloburl'), '_blank')
  })
}

export function convertToCurrency (value) {
  const result = value.replace(/,/g, '')
  const parts = result.toString().split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function parseCurrency (item, currency) {
  const totalCost = item ? item.replace(/[$,]+/g, '') : 0
  const parsedCost = new Intl.NumberFormat('fil-PH', { style: 'currency', currency }).format(totalCost)
  return parsedCost
}

export function encodeReqQuery (query) {
  const keys = Object.keys(query)
  const req = keys
    .filter((k) => query[k])
    .reduce((acc, curr, i) => curr ? `${acc}${curr}=${query[curr]}&` : acc, '?')
  return encodeURI(req)
}

export const toChar = (length) => String.fromCharCode(97 + length).toUpperCase()

export const testItemChoice = (length) => {
  return {
    letter: toChar(length),
    plaintext: ''
  }
}

export const examSegment = (length) => {
  return {
    order: length + 1,
    totalTime: 0,
    items: []
  }
}

export const testItem = () => {
  return {
    _id: '',
    question: '',
    time: ''
  }
}
