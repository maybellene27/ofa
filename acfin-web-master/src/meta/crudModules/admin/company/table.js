export default function (vm) {
  const filterArray = vm.vuex.companies && vm.vuex.companies.map((obj) => {
    return {
      value: obj.name,
      text: obj.name
    }
  })
  return {
    collectionName: 'CompanyTable',
    dataView: 'table',
    label: 'AC Motors Branches',
    asc: -1,
    route: {
      updateMultiple: 'company',
      list: 'company',
      deleteMultiple: 'company',
      upload: 'company'
    },
    filterActions: [
      {
        label: 'Company',
        value: 'name',
        filterArray
      }
    ],
    customTableDesign: {
      is: 'CustomTable',
      vBind: {
        crudFormMethods: vm,
        tableName: 'CompanyTable'
      }
    },
    hideSelect: false,
    privilege: 'canReadUsers',
    fields: [
      {
        columnHeader: {
          sortable: true,
          text: 'Company',
          value: 'name'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Branches',
          value: 'branches'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Email',
          value: 'email'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Contact Number',
          value: 'mobile'
        }
      }
    ],
    tableActions: [
      {
        id: 'create',
        label: 'Create',
        icon: 'mdi-plus-circle-outline',
        class: 'white--text px-5',
        color: 'blue darken-4',
        privilege: 'canPostCompany',
        action: () => {
          vm.$router.push({
            name: 'CompanyCreate',
            params: {
              operation: 'create'
            }
          })
        }
      },
      {
        id: 'delete',
        label: 'Delete',
        icon: 'mdi-delete',
        color: 'red',
        class: 'white--text',
        privilege: 'canPostCompany'
      }
    ],
    entryActions: [
      {
        id: 'view',
        icon: 'mdi-eye',
        privilege: 'canViewCompany',
        action: (item) => {
          vm.$router.push({
            name: 'CompanyView',
            params: {
              operation: 'view',
              id: item._id
            }
          })
        }
      }
    ],
    breadcrumbs: {
      divider: '/',
      large: true,
      items: [
        {
          text: 'Company'
        }
      ]
    }
  }
}
