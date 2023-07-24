import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const info = {
    concentClause: vm.vuex.fields.concentClause,
    bankTransferRemarks: vm.vuex.fields.bankTransferRemarks,
    user: vm.vuex.fields.user,
    status: vm.vuex.fields.status,
    age: vm.vuex.fields.age,
    birthday: vm.vuex.fields.birthday,
    tin: vm.vuex.fields.tin,
    maritalStatus: vm.vuex.fields.maritalStatus,
    citizenship: vm.vuex.fields.citizenship,
    presentAddress: vm.vuex.fields.presentAddress,
    previousAddress: vm.vuex.fields.previousAddress,
    spouse: vm.vuex.fields.spouse,
    applicantEmployment: vm.vuex.fields.applicantEmployment,
    spouseEmployment: vm.vuex.fields.spouseEmployment,
    vehiclePurchased: vm.vuex.fields.vehiclePurchased,
    dateSubmitted: vm.vuex.fields.dateSubmitted,
    recommendDate: vm.vuex.fields.recommendDate
  }

  return {
    collectionName: 'bankApplication',
    routerName: 'UserView',
    label: 'Admin User',
    flatToolBar: true,
    dataview: 'applicationView',
    validations: admin(vm),
    schema: info,
    hideToolbar: true,
    formParams: {
      query: {},
      fields: {
        validID: vm.vuex.fields.vehiclePurchased.validID,
        localCOE: vm.vuex.fields.vehiclePurchased.local.coe.attachment,
        localPayslip: vm.vuex.fields.vehiclePurchased.local.payslip.attachment,
        localITR: vm.vuex.fields.vehiclePurchased.local.itr.attachment,
        ofwLandCOE: vm.vuex.fields.vehiclePurchased.ofwLandBased.coe.attachment,
        ofwLandPayslip: vm.vuex.fields.vehiclePurchased.ofwLandBased.payslip.attachment,
        ofwLandRemittance: vm.vuex.fields.vehiclePurchased.ofwLandBased.remittance.attachment,
        ofwSeaCOE: vm.vuex.fields.vehiclePurchased.ofwSeaBased.coe.attachment,
        ofwSeaPayslip: vm.vuex.fields.vehiclePurchased.ofwSeaBased.payslip.attachment,
        ofwSeaAllotment: vm.vuex.fields.vehiclePurchased.ofwSeaBased.allotment.attachment,
        ofwSeaTip: vm.vuex.fields.vehiclePurchased.ofwSeaBased.tip.attachment,
        ofwSeaVoucher: vm.vuex.fields.vehiclePurchased.ofwSeaBased.voucher.attachment,
        borrowerSignature: vm.vuex.fields.vehiclePurchased.borrowerSignature,
        spouseSignature: vm.vuex.fields.vehiclePurchased.spouseSignature
      }
    },
    route: {
      create: 'application',
      createForm: 'attachment/application',
      read: 'bankApplication',
      update: 'application',
      updateForm: 'attachment/application',
      delete: 'application',
      upload: 'application',
      getImage: 'application',
      recommend: `application/status/${vm.$route.params.id}/recommend`,
      return: `application/status/${vm.$route.params.id}/return`,
      approve: `application/status/${vm.$route.params.id}/approve`,
      reject: `application/status/${vm.$route.params.id}/reject`,
      bankApprove: `bankApplication/status/${vm.$route.params.id}/approve`,
      bankReject: `bankApplication/status/${vm.$route.params.id}/reject`,
      bankReturn: `bankApplication/status/${vm.$route.params.id}/return`
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
                is: 'ApplicationStepper',
                formKey: 'info',
                vBind: {
                  operation: vm.$route.params.operation,
                  editable: !vm.readOnly,
                  ref: 'aS',
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
