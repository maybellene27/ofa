/*
  ####
  Insert all states to be used in the feature/s by creating an object for the state (ex. adminState: {...})
  Create separate folders for each feature, with an index.js file
  Import state/s from this file to the index.js file of the feature
  Include functionalities to be reused on the app
  ####
*/

// sample state

export const rawState = {
  // copied from nfaps $meta
  $meta: {
    userRole: null,
    username: '',
    status: '',
    readOnly: true,
    isLoading: true,
    delimiters: [' ', ','],
    menu: false
  }
}

// insert filename/s needed to be uploaded here
export const files = [

]

// copied from nfaps meta.js file, to edit messages; can either add status message in this object or create a new object specific for the feature
export const statusMessages = {
  approve: {
    success: 'Application approved.',
    confirm: (fullName) => `Are you sure you want to approve application of the user ${fullName}?`
  },
  reject: {
    success: 'Application rejected.'
  },
  return: {
    success: 'Application returned.'
  },
  archiveUser: {
    success: 'Application was archived',
    confirm: (fullName) => `Are you sure you want to archive the application of ${fullName}?`
  },
  approvePayment: {
    success: 'Application has been marked as paid.',
    confirm: (fullName) => `Are you sure you want to mark payment of the user ${fullName} as paid?`
  },
  deleteApplication: {
    success: 'Successfully deleted applicant record.',
    confirm: (fullName) => `Are you sure you want to delete the application of ${fullName}?`
  },
  resetPassword: {
    success: 'Admin reset password successful.',
    confirm: (fullName) => `Are you sure you want to reset the user ${fullName}?`
  }
}
