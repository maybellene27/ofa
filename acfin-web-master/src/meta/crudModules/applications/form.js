import admin from '@/utils/validations/users/admin'

export default function (vm) {
  const info = {
    consentClause: vm.vuex.fields.consentClause,
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
    recommendDate: vm.vuex.fields.recommendDate,
    cancellationLetter: vm.vuex.fields.cancellationLetter,
    typeOfSeparation: vm.vuex.fields.typeOfSeparation
  }
  const bank = vm.$route.params.bank
  return {
    collectionName: 'application',
    routerName: 'UserView',
    label: 'Admin User',
    flatToolBar: true,
    validations: admin(vm),
    excludeRouteId: !!bank,
    schema: info,
    redirect: {
      name: vm.$s.userType === 'Internal' ? 'ApplicationView' : 'ApplicantApplicationView',
      params: {
        step: 1,
        operation: 'view'
      }
    },
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
      createForm: bank ? 'attachment/bankApplication' : 'attachment/application',
      cancelLetterForm: 'attachment/application',
      read: bank ? `bankApplication/${bank}` : 'application',
      update: bank ? 'bankApplication' : 'application',
      updateForm: bank ? 'bankApplication' : 'attachment/application',
      delete: bank ? 'bankApplication' : 'application',
      upload: bank ? 'bankApplication' : 'application',
      getImage: bank ? 'bankApplication' : 'application',
      recommend: `application/status/${vm.$route.params.id}/recommend`,
      deleteRecommend: `application/status/${vm.$route.params.id}/deleteRecommend`,
      recommendSendMail: `application/status/${vm.$route.params.id}/recommendSendMail`,
      return: `application/status/${vm.$route.params.id}/return`,
      approve: `application/status/${vm.$route.params.id}/approve`,
      unreleased: `application/status/${vm.$route.params.id}/unreleased`,
      reject: `application/status/${vm.$route.params.id}/reject`,
      submit: `application/status/${vm.$route.params.id}/submit`,
      transfer: `application/status/${vm.$route.params.id}/transfer`,
      bankApprove: `bankApplication/status/${bank || vm.$route.params.id}/approve`,
      bankReject: `bankApplication/status/${bank || vm.$route.params.id}/reject`,
      bankReturn: `bankApplication/status/${bank}/return`,
      bankApplication: 'bankApplication',
      application: 'application',
      cancel: `application/status/${vm.$route.params.id}/cancel`,
      sendMail: `application/status/${vm.$route.params.id}/sendmail`,
      submitSendMail: 'application/status'
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
