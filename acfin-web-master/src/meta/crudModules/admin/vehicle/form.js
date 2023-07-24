import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const { freights, ...info } = vm.vuex.fields
  return {
    collectionName: 'vehicle',
    label: 'Vehicle',
    validations: admin(vm),
    routerName: 'VehicleView',
    route: {
      create: 'vehicle',
      createForm: 'attachment/vehicle',
      read: 'vehicle',
      update: 'vehicle',
      updateForm: 'attachment/vehicle',
      delete: 'vehicle',
      upload: 'vehicle',
      getImage: 'vehicle'
    },
    hideToolbar: true,
    schema: {
      ...info,
      children: freights
    },
    formParams: {
      query: {},
      fields: {
        badgeImage: vm.vuex.fields.badgeImage
      }
    },
    fields: [
      {
        is: 'v-row',
        properties: {
          justify: 'center'
        },
        children: [
          {
            is: 'CustomToolbar',
            vBind: {
              operation: vm.$route.params.operation,
              editable: !vm.readOnly,
              crudFormMethods: vm,
              props: {
                class: 'mx-5'
              },
              cancelBtn: {
                redirectRoute: () => {
                  if (vm.readOnly === false && vm.operation !== 'create') {
                    vm.readOnly = true
                    vm.cancelled = true
                    vm.view()
                  } else {
                    vm.$router.push({
                      name: 'VehicleTable',
                      params: {
                        page: vm.$route.params.page
                      }
                    })
                  }
                }
              },
              deleteBtn: {
                redirectRoute: () => vm.$router.push({
                  name: 'VehicleTable',
                  params: {
                    page: vm.$route.params.page
                  }
                })
              },
              createBtn: {
                action: () => {
                  if (!vm.$refs.vehicleForm.$v.freights.$invalid) {
                    vm.confirmDialog({
                      title: 'Create Vehicle',
                      message: 'Are you sure you want to create this vehicle?',
                      callback: () => vm.save((id) => {
                        vm.$router.push({
                          name: 'VehicleView',
                          params: {
                            page: vm.$route.params.page,
                            operation: 'view',
                            id: id
                          }
                        })
                      }),
                      showDialog: true
                    })
                  } else {
                    vm.$store.dispatch('showAlert', {
                      message: 'You must create branch and freight cost first',
                      type: 'error'
                    })
                  }
                }
              },
              editBtn: {
                action: () => {
                  if (!vm.$refs.vehicleForm.$v.freights.$invalid) {
                    vm.$refs.vehicleForm.$refs.freightForm.$v.$touch()
                    if (!vm.$refs.vehicleForm.$refs.freightForm.$v.$invalid) {
                      vm.save()
                    } else {
                      vm.$store.dispatch('showAlert', {
                        message: 'Branch and Freight cost field is required',
                        type: 'error'
                      })
                    }
                  } else {
                    vm.$store.dispatch('showAlert', {
                      message: 'You must create branch and freight cost first',
                      type: 'error'
                    })
                  }
                }
              }
            }
          }
        ]
      },
      {
        is: 'v-row',
        properties: {
          justify: 'center'
        },
        children: [
          {
            is: 'v-col',
            children: [
              {
                is: 'VehicleForm',
                formKey: 'info',
                vBind: {
                  operation: vm.$route.params.operation,
                  editable: !vm.readOnly,
                  ref: 'vehicleForm',
                  crudFormMethods: vm
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
