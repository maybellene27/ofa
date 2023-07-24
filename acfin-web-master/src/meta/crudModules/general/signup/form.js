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
    status: vm.vuex.fields.status,
    userType: vm.vuex.fields.userType,
    userRole: vm.vuex.fields.userRole,
    password: vm.vuex.fields.password,
    userKey: vm.vuex.fields.userKey
  }
  return {
    collectionName: 'user',
    routerName: 'UserView',
    label: 'Admin User',
    dataView: 'table',
    validations: admin(vm),
    hideToolbar: true,
    schema: {
      info
    },
    route: {
      create: 'admin/users/',
      createForm: 'admin/users/',
      read: 'admin/user/profile',
      update: 'admin/user/profile',
      updateForm: 'admin/user/profile',
      delete: 'admin/user/profile',
      upload: 'admin/user/profile',
      getImage: 'admin/user/profile'
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
                is: 'SignUpForm',
                formKey: 'info',
                vBind: {
                  operation: 'create',
                  editable: true,
                  ref: 'pF',
                  create: vm
                }
              }
            ]
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
                is: 'RecordDetailsForm',
                formKey: 'info',
                vBind: {
                  operation: 'create',
                  editable: true,
                  ref: 'rDF'
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
