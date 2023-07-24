
export default function (vm) {
  const filterArray = vm.vuex.financingPartners && vm.vuex.financingPartners.map((obj) => {
    return {
      value: obj.name,
      text: obj.name
    }
  })
  return {
    collectionName: 'FinancingPartnerTable',
    dataView: 'table',
    label: 'Financing Partners',
    asc: -1,
    route: {
      updateMultiple: 'financingPartner',
      list: 'financingPartner',
      deleteMultiple: 'financingPartner',
      upload: 'financingPartner'
    },
    filterActions: [
      {
        label: 'Name',
        value: 'name',
        filterArray
      }
    ],
    customTableDesign: {
      is: 'CustomTable',
      vBind: {
        crudFormMethods: vm,
        tableName: 'FinancingPartnerTable'
      }
    },
    hideSelect: false,
    privilege: 'canReadUsers',
    fields: [
      {
        columnHeader: {
          sortable: true,
          text: 'Name',
          value: 'name'
        }
      },
      {
        columnHeader: {
          sortable: false,
          text: 'Branch',
          value: 'branch'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Contact Person',
          value: 'contactPerson'
        }
      },
      {
        columnHeader: {
          sortable: false,
          text: 'Email Address',
          value: 'email'
        }
      },
      {
        columnHeader: {
          sortable: false,
          text: 'Mobile Number',
          value: 'mobileNo'
        }
      }
    ],
    tableActions: [
      {
        id: 'create',
        label: 'Add Partner',
        icon: 'mdi-plus-circle-outline',
        color: 'blue darken-4',
        class: 'white--text',
        privilege: 'canPostFinancingPartner',
        action: () => {
          vm.$router.push({
            name: 'FinancingPartnerCreate',
            params: {
              page: vm.$route.params.page,
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
        privilege: 'canPostFinancingPartner'
      }
    ],
    entryActions: [
      {
        id: 'view',
        icon: 'mdi-eye',
        privilege: 'canViewFinancingPartner',
        action: (item) => {
          vm.$router.push({
            name: 'FinancingPartnerView',
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
          text: ['Financing Partner']
        }
      ]
    }
  }
}
