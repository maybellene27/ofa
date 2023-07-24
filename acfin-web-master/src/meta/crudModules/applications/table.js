export default function (vm) {
  const statusDictionary = {
    recommended: 'Recommended for submission to banks',
    draft: 'Draft',
    submitted: 'Submitted',
    returned: 'Pending Document',
    approved: 'Approved and Release',
    rejected: 'Rejected',
    unreleased: 'Approved and Unreleased',
    transferred: 'Approved and Unreleased',
    cancelled: 'Cancelled Approval',
    recommendExpired: 'Recommend Expired'
  }
  vm.list && vm.list.map((x) => {
    x.status = statusDictionary[x.status]
    x.isSelectable = x.status === 'Draft'
  })
  if (vm.$s.userRole && vm.$s.userRole.includes('customer')) {
    vm.options.sortBy = ['_id']
    vm.options.sortDesc = [true]
  } else {
    vm.options.sortBy = ['dateSubmitted']
    vm.options.sortDesc = [true]
  }
  return {
    label: 'Applications',
    collectionName: 'application',
    dataView: 'table',
    advancedQuery: {},
    route: {
      updateMultiple: 'application',
      list: 'application',
      deleteMultiple: 'application',
      upload: 'application'
    },
    filterActions: [
      {
        label: 'Status',
        value: 'status',
        filterArray: [
          {
            value: 'draft',
            text: 'Draft'
          },
          {
            value: 'submitted',
            text: 'Submitted'
          },
          {
            value: 'recommended',
            text: 'Recommended'
          },
          {
            value: 'returned',
            text: 'Pending Document'
          },
          {
            value: 'approved',
            text: 'Approved and Release'
          },
          {
            value: 'unreleased',
            text: 'Approved and Unreleased'
          },
          {
            value: 'cancelled',
            text: 'Cancelled Approval'
          },
          {
            value: 'recommendExpired',
            text: 'Recommend Expired'
          },
          {
            value: 'rejected',
            text: 'Rejected'
          }
        ]
      }
    ],
    customTableDesign: {
      is: 'CustomTable',
      vBind: {
        crudFormMethods: vm,
        tableName: vm.$s.userType === 'Internal' ? 'ApplicationTable' : 'ApplicantApplicationTable'
      }
    },
    hideSelect: false,
    privilege: 'canReadUsers',
    fields: [
      {
        columnHeader: {
          sortable: false,
          text: 'Applicant Name',
          value: 'name'
        }
      },
      {
        columnHeader: {
          sortable: false,
          text: 'SE Name',
          value: 'salesExecutive'
        }
      },
      {
        columnHeader: {
          sortable: false,
          text: 'Unit Required',
          value: 'unitRequired'
        }
      },
      {
        columnHeader: {
          sortable: false,
          text: 'Application Status',
          value: 'status'
        }
      }
      // {
      //   columnHeader: {
      //     sortable: false,
      //     text: 'Date Created',
      //     value: 'dateCreated'
      //   }
      // }
    ],
    tableActions: [
      {
        id: 'create',
        label: 'Add Application',
        privilege: 'canPostApplication',
        color: 'blue darken-4',
        class: 'white--text',
        action: () => {
          vm.$router.push({
            name: vm.$s.userType === 'Internal' ? 'ApplicationCreate' : 'ApplicantApplicationCreate',
            params: {
              operation: 'create',
              step: 1
            }
          })
        }
      },
      {
        id: 'delete',
        label: 'Delete',
        privilege: 'canDeleteApplication',
        color: 'red',
        class: 'white--text'
      }
    ],
    entryActions: [
      {
        id: 'view',
        icon: 'mdi-eye',
        privilege: 'canViewApplication',
        action: (item) => {
          vm.$router.push({
            name: vm.$s.userType === 'Internal' ? 'ApplicationView' : 'ApplicantApplicationView',
            params: {
              operation: 'view',
              step: '1',
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
          text: 'Applications'
        }
      ]
    }
  }
}
