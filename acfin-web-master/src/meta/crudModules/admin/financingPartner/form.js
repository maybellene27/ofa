import admin from '@/utils/validations/users/admin'

export default function (vm) {
  return {
    collectionName: 'financingPartner',
    label: 'Financing Partner',
    validations: admin(vm),
    routerName: 'FinancingPartnerView',
    route: {
      create: 'financingPartner',
      createForm: 'attachment/financingPartner',
      read: 'financingPartner',
      update: 'financingPartner',
      updateForm: 'attachment/financingPartner',
      delete: 'financingPartner',
      upload: 'financingPartner',
      getImage: 'financingPartner'
    },
    hideToolbar: true,
    schema: vm.vuex.fields,
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
                      name: 'FinancingPartnerTable',
                      params: {
                        page: vm.$route.params.page
                      }
                    })
                  }
                }
              },
              deleteBtn: {
                redirectRoute: () => vm.$router.push({
                  name: 'FinancingPartnerTable',
                  params: {
                    page: vm.$route.params.page
                  }
                })
              },
              createBtn: {
                redirectRoute: (id) => {
                  vm.$router.push({
                    name: 'FinancingPartnerView',
                    params: {
                      page: vm.$route.params.page,
                      operation: 'view',
                      id
                    }
                  })
                }
              }
            }
          }
        ]
      },
      {
        is: 'v-row',
        vBind: {
          justify: 'center'
        },
        children: [
          {
            is: 'v-col',
            children: [
              {
                is: 'FinancingPartnerForm',
                formKey: 'info',
                vBind: {
                  operation: vm.$route.params.operation,
                  editable: !vm.readOnly,
                  ref: 'financingPartnerForm'
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
