import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const { branches, logo, ...info } = vm.vuex.fields
  return {
    collectionName: 'company',
    label: 'Branch',
    validations: admin(vm),
    routerName: 'CompanyView',
    hideToolbar: true,
    route: {
      create: 'company',
      createForm: 'attachment/company',
      read: 'company',
      update: 'company',
      updateForm: 'attachment/company',
      delete: 'company',
      upload: 'company',
      getImage: 'company'
    },
    schema: {
      ...info,
      children: branches
    },
    formParams: {
      query: {},
      fields: {
        logo: vm.vuex.fields.logo
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
                      name: 'CompanyTable',
                      params: {
                        page: vm.$route.params.page
                      }
                    })
                  }
                }
              },
              deleteBtn: {
                redirectRoute: () => vm.$router.push({
                  name: 'CompanyTable'
                })
              },
              createBtn: {
                action: () => {
                  if (!vm.$refs.companyForm.$v.branches.$invalid) {
                    vm.confirmDialog({
                      title: 'Create AC Motors Branch',
                      message: 'Are you sure you want to create this branch?',
                      callback: () => vm.save((id) => {
                        vm.$router.push({
                          name: 'CompanyView',
                          params: {
                            page: vm.$route.params.page,
                            operation: 'view',
                            id
                          }
                        })
                      }),
                      showDialog: true
                    })
                  } else {
                    vm.$store.dispatch('showAlert', {
                      message: 'You must create branches first',
                      type: 'error'
                    })
                  }
                }
              },
              editBtn: {
                action: () => {
                  if (!vm.$refs.companyForm.$v.branches.$invalid) {
                    vm.save()
                  } else {
                    vm.$store.dispatch('showAlert', {
                      message: 'You must create branches first',
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
                is: 'CompanyForm',
                formKey: 'info',
                vBind: {
                  operation: vm.$route.params.operation,
                  editable: !vm.readOnly,
                  ref: 'companyForm'
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
