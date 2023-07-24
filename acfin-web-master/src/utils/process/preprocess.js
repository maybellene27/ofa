import meta from '@/meta/tables'

const preprocess = {
  query: ({ searchText, tab, showInactive, page, itemsPerPage, additionalQuery = '', populate }) => {
    const start = (page - 1) * itemsPerPage
    const advancedQuery = preprocess.advancedQuery({ searchText, tab, showInactive, additionalQuery })
    let query = `?count=${itemsPerPage}&start=${start}`
    if (populate) query = `?count=${itemsPerPage}&start=${start}&populate=true`
    if (advancedQuery !== '') {
      query = `${query}${advancedQuery}`
    }
    return query
  },
  formColumnQuery: ({ searchText, tab }) => meta[tab].columns.map((c) => {
    const col = c.value
    let colName = preprocess.setColName(col)
    if (['pshsusers', 'division'].includes(tab) && ['unit', 'division'].includes(colName)) {
      colName = `${colName}.name`
    }
    return {
      [colName]: {
        $regex: searchText,
        $options: 'i'
      }
    }
  }),
  advancedQuery: ({ searchText, tab, showInactive, additionalQuery }) => {
    const qObj = {
      $and: []
    }
    meta[tab] && meta[tab].userRole && qObj.$and.push({ userRole: meta[tab].userRole })
    showInactive || qObj.$and.push({ _status: { $ne: 'inactive' } })
    searchText && qObj.$and.push(
      { $or: preprocess.formColumnQuery({ searchText, tab }) }
    )
    if (additionalQuery !== '') {
      qObj.$and.push(additionalQuery)
    }
    if (!qObj.$and.length) delete qObj.$and
    const aQuery = JSON.stringify(qObj)
    return `&advancedQuery=${encodeURI(aQuery)}`
  },
  setColName: (col) => {
    if (col.startsWith('$')) {
      return col.replace('$', '')
    } else if (col.includes('[0]')) {
      const colName = col.replace('[0]', '')
      const colNameArr = colName.split('.')
      if (colNameArr[1] === 'fullName') return `${colNameArr[0]}.firstName`
      else return colName
    } else return col
  }
}

export default preprocess
