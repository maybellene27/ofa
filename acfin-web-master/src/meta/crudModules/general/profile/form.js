import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const info = {
    firstName: vm.vuex.fields.firstName,
    middleName: vm.vuex.fields.middleName,
    lastName: vm.vuex.fields.lastName,
    suffix: vm.vuex.fields.suffix,
    email: vm.vuex.fields.email,
    mobile: vm.vuex.fields.mobile,
    telephone: vm.vuex.fields.telephone,
    singleBranch: vm.vuex.fields.singleBranch,
    multipleBranch: vm.vuex.fields.multipleBranch,
    brand: vm.vuex.fields.brand,
    superUserBank: vm.vuex.fields.superUserBank
  }
  return {
    collectionName: 'user',
    label: 'Profile',
    dataView: 'table',
    excludeRouteId: true,
    validations: admin(vm),
    hideToolbar: true,
    schema: {
      info
    },
    route: {
      getImage: 'user/myprofile',
      read: 'user/myprofile',
      createForm: 'user/myprofile',
      updateForm: 'user/myprofile',
      create: 'user/myprofile',
      update: 'user/myprofile',
      delete: 'user/myprofile',
      upload: 'user/myprofile'
    },
    fields: [
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
                is: 'ProfileForm',
                formKey: 'info',
                vBind: {
                  operation: vm.$route.params.operation,
                  editable: !vm.readOnly,
                  ref: 'pF',
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
