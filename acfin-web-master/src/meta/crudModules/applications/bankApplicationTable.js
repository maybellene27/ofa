export default function (vm) {
  vm.list && vm.list.map((x) => {
    x.isSelectable = x.status === 'Draft'
  })
  vm.options.sortBy = ['recommendDate']
  return {
    label: 'Applications',
    collectionName: 'bankApplication',
    // eslint-disable-next-line eqeqeq
    dataView: 'application',
    asc: -1,
    route: {
      updateMultiple: 'application',
      list: 'bankApplication',
      deleteMultiple: 'application',
      upload: 'application'
    },
    filterActions: [
      {
        label: 'Ownership',
        value: 'presentAddress.ownership',
        filterArray: [
          'Owned',
          'Mortgage',
          'Rented',
          'Used Free'
        ]
      },
      {
        label: 'Employment',
        value: 'applicantEmployment.type',
        filterArray: [
          'Employment',
          'Business'
        ]
      },
      {
        label: 'Status',
        value: 'bankStatus',
        filterArray: [
          'Pending Approval',
          'Approved and Unreleased',
          'Approved and Released',
          'Not Applicable',
          'Declined',
          'Returned',
          'Expired',
          'Release Expired',
          'Cancelled'
        ]
      }
    ],
    customTableDesign: {
      is: 'CustomTable',
      vBind: {
        crudFormMethods: vm,
        tableName: 'BankApproverApplicationTable'
      }
    },
    hideSelect: false,
    privilege: 'canReadUsers',
    fields: [
      {
        columnHeader: {
          sortable: true,
          text: 'Applicant Name',
          value: 'name'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Ownership',
          value: 'presentAddress.ownership'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Employment',
          value: 'applicantEmployment.type'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Application Status',
          value: 'bankStatus'
        }
      }
    ],
    tableActions: [
      {
        id: 'delete',
        label: 'Delete',
        privilege: 'canCreateUsers'
      }
    ],
    entryActions: [
      {
        id: 'view',
        icon: 'mdi-eye',
        privilege: 'canViewApplication',
        action: (item) => {
          vm.$router.push({
            name: 'BankApproverApplicationView',
            params: {
              operation: 'view',
              step: '1',
              id: item._id
            }
          })
        }
      }
    ]
  }
}
