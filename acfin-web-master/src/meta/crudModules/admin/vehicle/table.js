export default function (vm) {
  return {
    collectionName: 'VehicleTable',
    dataView: 'table',
    label: 'Vehicles',
    asc: -1,
    route: {
      updateMultiple: 'vehicle',
      list: 'vehicle',
      deleteMultiple: 'vehicle',
      upload: 'vehicle'
    },
    filterActions: [
      {
        label: 'Brand',
        value: 'brand',
        filterArray: [
          'Honda',
          'Isuzu',
          'KIA',
          'KTM',
          'Maxus',
          'Volkswagen'
        ]
      }
    ],
    customTableDesign: {
      is: 'CustomTable',
      vBind: {
        crudFormMethods: vm,
        tableName: 'VehicleTable'
      }
    },
    hideSelect: false,
    privilege: 'canReadUsers',
    fields: [
      {
        columnHeader: {
          sortable: true,
          text: 'Brand',
          value: 'brand'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Model',
          value: 'model'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Variant',
          value: 'variant'
        }
      },
      {
        columnHeader: {
          sortable: true,
          text: 'Year',
          value: 'year'
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
        privilege: 'canPostVehicle',
        action: () => {
          vm.$router.push({
            name: 'VehicleCreate',
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
        privilege: 'canPostVehicle'
      }
    ],
    entryActions: [
      {
        id: 'view',
        icon: 'mdi-eye',
        privilege: 'canViewVehicle',
        action: (item) => {
          vm.$router.push({
            name: 'VehicleView',
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
          text: 'Vehicle'
        }
      ]
    }
  }
}
