import { validationMixin } from 'vuelidate'
import { required, email, maxLength, minLength, requiredIf, maxValue } from 'vuelidate/lib/validators'
import { fileSize, fileFormat, isNameLike, isCurrency, isValidDate } from './custom'
import validationErrors from './errors'

const custom = {
  email: {
    email,
    required,
    maxLength: maxLength(50)
  },
  password: {
    minLength: minLength(10),
    maxLength: maxLength(15),
    required
  },
  username: {
    minLength: minLength(5),
    required
  },
  monthInvoice: {
    required,
    isValidDate
  },
  users: (vm) => ({
    firstName: {
      required,
      maxLength: maxLength(100),
      isNameLike
    },
    middleName: {
      maxLength: maxLength(30),
      isNameLike
    },
    lastName: {
      required,
      maxLength: maxLength(50),
      isNameLike
    },
    email: {
      email,
      required,
      maxLength: maxLength(50)
    },
    telephone: {},
    userRole: {
      required
    },
    userType: {
      required
    },
    mobile: {
      required
    },
    multipleBranch: {
      required: requiredIf(() => {
        return ['bankApprover', 'salesManager', 'finance'].includes(vm.userRole)
      })
    },
    singleBranch: {
      required: requiredIf(() => {
        return !['bankApprover', 'salesManager', 'finance', 'customer', 'superUser'].includes(vm.userRole)
      })
    },
    brand: {
      required: requiredIf(() => {
        return ['admin', 'bankApprover', 'finance', 'salesExecutive', 'salesManager', 'systemAdmin'].includes(vm.userRole)
      })
    },
    password: {
      minLength: minLength(10),
      maxLength: maxLength(15),
      required
    },
    bank: {
    },
    superUserBank: {
      required: requiredIf(() => {
        return ['superUser'].includes(vm.userRole)
      })
    }
  }),
  financingPartner: {
    name: { required },
    branch: { required },
    brand: { required },
    contactPerson: { required },
    designation: { required },
    department: { required },
    email: {
      email,
      required,
      maxLength: maxLength(50)
    },
    mobileNo: { required }
  },
  vehicle: {
    brand: {
      required
    },
    model: {
      required
    },
    variant: {
      required
    },
    year: {
      required
    },
    price: {
      required,
      isCurrency
    },
    freights: {
      required
    }
  },
  freight: {
    $each: {
      branch: {
        required
      },
      freightCost: {
        required,
        isCurrency
      }
    }
  },
  applicants: {
    user: {
      required
    },
    applicantLastName: {
    },
    applicantFirstName: {
    },
    applicantMiddleName: {
    },
    applicantEmail: {
    },
    applicantTelephone: {
    },
    applicantMobile: {
    },
    applicantBirthday: {
      required
    },
    applicantAge: {
      required
    },
    applicantTin: {
      required
    },
    applicantMaritalStatus: {
      required
    },
    applicantCitizenship: {
      required
    },
    presentAddressLengthOfStay: {
      required
    },
    presentAddressNoOfDependents: {
      required
    },
    presentAddressOwnership: {
      required
    },
    previousAddressLengthOfStay: {
      required
    },
    spouse: {
      $each: {
        lastName: {
        },
        firstName: {
        },
        middleName: {
        },
        email: {
          email,
          maxLength: maxLength(50)
        },
        birthday: {
        },
        age: {
        },
        tin: {
        },
        telephone: {
        },
        mobile: {
        }
      }
    }
  },
  employment: (vm) => ({
    type: {
      required: requiredIf(() => {
        return vm.fieldRequired
      })
    },
    name: {
      required: requiredIf(() => {
        return vm.fieldRequired
      })
    },
    address: {
      required: requiredIf(() => {
        return vm.fieldRequired
      })
    },
    position: {
      required: requiredIf(() => {
        return vm.fieldRequired
      })
    },
    telephone: {
    },
    years: {
      required: requiredIf(() => {
        return vm.fieldRequired
      })
    },
    monthlyIncome: {
      required: requiredIf(() => {
        return vm.fieldRequired
      }),
      isCurrency
    },
    otherSourceOfIncome: {}
  }),
  employmentArray: (vm) => ({
    $each: {
      type: {
        required: requiredIf(() => {
          return vm.fieldRequired
        })
      },
      name: {
        required: requiredIf(() => {
          return vm.fieldRequired
        })
      },
      address: {
        required: requiredIf(() => {
          return vm.fieldRequired
        })
      },
      position: {
        required: requiredIf(() => {
          return vm.fieldRequired
        })
      },
      telephone: {
      },
      years: {
        required: requiredIf(() => {
          return vm.fieldRequired
        })
      },
      monthlyIncome: {
        required: requiredIf(() => {
          return vm.fieldRequired
        }),
        isCurrency
      },
      otherSourceOfIncome: {}
    }
  }),
  purchasedVehicleForm: (vm) => ({
    branch: {
      required
    },
    brand: {
      required
    },
    model: {
      required
    },
    variant: {
      required
    },
    year: {
      required
    },
    sellingPrice: {
      required,
      isCurrency
    },
    amountFinance: {
      required,
      isCurrency
    },
    downpayment: {
      required,
      isCurrency,
      maxValue: maxValue(100)
    },
    salesExecutive: {
      required
    },
    validID: {
      required,
      fileSize: fileSize({ max: 3 }),
      fileFormat: fileFormat({ format: ['jpg', 'jpeg', 'png'] })
    },
    banks: {
      required
    },
    localCOE: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.local.coe.required
      })
    },
    localPayslip: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.local.payslip.required
      })
    },
    localITR: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.local.itr.required
      })
    },
    ofwLandCOE: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwLandBased.coe.required
      })
    },
    ofwLandPayslip: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwLandBased.payslip.required
      })
    },
    ofwLandRemittance: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwLandBased.remittance.required
      })
    },
    ofwSeaCOE: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwSeaBased.coe.required
      })
    },
    ofwSeaPayslip: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwSeaBased.payslip.required
      })
    },
    ofwSeaAllotment: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwSeaBased.allotment.required
      })
    },
    ofwSeaTip: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwSeaBased.tip.required
      })
    },
    ofwSeaVoucher: {
      fileSize: fileSize({ max: 3 }),
      required: requiredIf(() => {
        return vm.ofwSeaBased.voucher.required
      })
    }
  }),
  address: {
    street: {
      required
    },
    region: {
    },
    province: {
      required
    },
    city: {
      required
    },
    barangay: {
    }
  },
  company: {
    name: {
      required
    },
    address: {
      required
    },
    email: {
      email,
      required,
      maxLength: maxLength(50)
    },
    mobile: {
      required
    },
    logo: {
      required,
      fileSize: fileSize({ max: 3 }),
      fileFormat: fileFormat({ format: ['jpg', 'jpeg', 'png'] })
    },
    branches: {
      required
    }
  },
  branch: {
    $each: {
      name: {
        required
      },
      address: {
        required
      },
      email: {
        email,
        required,
        maxLength: maxLength(50)
      },
      mobile: {
        required
      }
    }
  }
}

export {
  validationMixin,
  custom,
  validationErrors
}
