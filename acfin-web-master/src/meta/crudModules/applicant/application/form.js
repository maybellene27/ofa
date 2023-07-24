import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const info = {
    application: vm.vuex.fields.application
  }
  return {
    collectionName: 'user',
    label: 'Application',
    dataView: 'table',
    validations: admin(vm),
    excludeRouteId: true,
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
    schema: {
      info
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
                  editable: false,
                  ref: 'pF'
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
                is: 'ApplicationForm',
                formKey: 'info',
                vBind: {
                  operation: vm.$route.params.operation,
                  editable: !vm.readOnly,
                  ref: 'aF'
                }
              }
            ]
          }
        ]
      }
    ],
    formActions: [
      {
        id: 'edit',
        label: 'Edit',
        privilege: 'canUpdateOwnProfile'
      }
    ],
    breadcrumbs: {
      divider: '/',
      large: true,
      items: [
        {
          text: 'Application'
        }
      ]
    }
  }
}
