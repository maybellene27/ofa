export default function (vm) {
  return {
    label: 'Users',
    collectionName: 'user',
    dataView: 'table',
    asc: -1,
    route: {
      updateMultiple: 'admin/users',
      list: 'admin/users',
      deleteMultiple: 'admin/user',
      upload: 'admin/users'
    },
    filterActions: [
      {
        label: 'Role',
        value: 'userRole',
        filterArray: [
          'Sales Executive',
          'Customer',
          'Finance',
          'Sales Manager',
          'Bank Approver',
          'System Admin',
          'Super User'
        ]
      },
      {
        label: 'Status',
        value: 'status',
        filterArray: [
          'active',
          'inactive'
        ]
      }
    ],
    customTableDesign: {
      is: 'CustomTable',
      vBind: {
        crudFormMethods: vm
      }
    },
    hideSelect: false,
    privilege: 'canReadUsers',
    fields: [
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
          text: 'Name',
          value: 'name'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Role',
          value: 'userRole'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Date Created',
          value: 'dateCreated'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Status',
          value: 'status'
        }
      }
    ],
    tableActions: [
      {
        id: 'create',
        label: 'Create',
        icon: 'mdi-plus-circle-outline',
        color: 'blue darken-4',
        class: 'white--text',
        privilege: 'canCreateUsers',
        action: () => {
          vm.$router.push({
            name: 'UserCreate',
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
        privilege: 'canSoftDeleteMultipleUsers',
        deleteSuccessMessage: 'User/s successfully deleted!'
      }
    ],
    entryActions: [
      {
        id: 'view',
        icon: 'mdi-eye',
        privilege: 'canReadUserByUserRole',
        action: (item) => {
          vm.$router.push({
            name: 'UserView',
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
          text: 'Admin Users'
        }
      ]
    }
  }
}
