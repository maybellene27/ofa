import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const info = {
    firstName: vm.vuex.fields.firstName,
    middleName: vm.vuex.fields.middleName,
    lastName: vm.vuex.fields.lastName,
    suffix: vm.vuex.fields.suffix,
    email: vm.vuex.fields.email,
    userType: vm.vuex.fields.userType,
    userRole: vm.vuex.fields.userRole,
    mobile: vm.vuex.fields.mobile,
    telephone: vm.vuex.fields.telephone,
    multipleBranch: vm.vuex.fields.multipleBranch,
    singleBranch: vm.vuex.fields.singleBranch,
    brand: vm.vuex.fields.brand,
    reason: vm.vuex.fields.reason,
    bank: vm.vuex.fields.bank,
    superUserBank: vm.vuex.fields.superUserBank,
    attachments: vm.vuex.fields.attachments
  }
  return {
    collectionName: 'user',
    routerName: 'UserView',
    label: 'Admin User',
    hideToolbar: true,
    validations: admin(vm),
    schema: {
      info
    },
    route: {
      create: 'admin/users/',
      createForm: 'admin/users/',
      read: 'admin/user/profile',
      update: 'admin/user/profile',
      updateForm: 'admin/user/profile',
      delete: 'admin/user',
      upload: 'admin/user/profile',
      getImage: 'admin/user/profile',
      requestReset: 'user/password/requestreset'
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
