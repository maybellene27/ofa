import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: 'home'
  },
  {
    path: '/home',
    name: 'LandingPage',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/general/LandingPage.vue')
    }
  },
  {
    path: '',
    name: 'Guest',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/general/Guest.vue')
    },
    children: [
      {
        path: '/login',
        name: 'Login',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/Login.vue')
        },
        meta: {
          title: 'Login Page',
          metaTags: [
            {
              name: 'description',
              content: 'Login to Web Application'
            }
          ]
        }
      },
      {
        path: '/passreset',
        name: 'PassReset',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/PassReset.vue')
        }
      },
      {
        path: '/user/account/signup/:operation',
        name: 'Signup',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/SignupForm.vue')
        }
      },
      {
        path: '/user/account/verify/email',
        name: 'EmailVerified',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/EmailVerified.vue')
        }
      },
      {
        path: '/user/password/reset',
        name: 'PassResetLink',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/PassResetLink.vue')
        }
      }
    ]
  },
  {
    path: '/admin',
    name: 'Admin',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/adminPages/base/Admin.vue')
    },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/adminPages/base/AdminDashboard.vue')
        }
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/adminPages/base/AdminDashboard.vue')
        }
      },
      {
        path: 'account',
        name: 'ProfileView',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/ProfileView.vue')
        }
      },
      {
        path: 'security',
        name: 'AdminSecurity',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/Security.vue')
        }
      },
      {
        path: 'user/:page',
        name: 'UserTable',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/adminPages/users/UserTable.vue')
        }
      },
      {
        path: 'user/:page/:operation',
        name: 'UserCreate',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/adminPages/users/UserView.vue')
        }
      },
      {
        path: 'user/:page/:operation/:id',
        name: 'UserView',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/adminPages/users/UserView.vue')
        }
      },
      {
        path: 'financingPartner/:page',
        name: 'FinancingPartnerTable',
        component: function () {
          return import('../views/adminPages/financingPartner/FinancingPartnerTable.vue')
        }
      },
      {
        path: 'financingPartner/:page/:operation',
        name: 'FinancingPartnerCreate',
        component: function () {
          return import('../views/adminPages/financingPartner/FinancingPartnerView.vue')
        }
      },
      {
        path: 'financingPartner/:page/:operation/:id',
        name: 'FinancingPartnerView',
        component: function () {
          return import('../views/adminPages/financingPartner/FinancingPartnerView.vue')
        }
      },
      {
        path: 'vehicle/:page',
        name: 'VehicleTable',
        component: function () {
          return import('../views/adminPages/vehicle/VehicleTable.vue')
        }
      },
      {
        path: 'vehicle/:page/:operation',
        name: 'VehicleCreate',
        component: function () {
          return import('../views/adminPages/vehicle/VehicleView.vue')
        }
      },
      {
        path: 'vehicle/:page/:operation/:id',
        name: 'VehicleView',
        component: function () {
          return import('../views/adminPages/vehicle/VehicleView.vue')
        }
      },
      {
        path: 'application/:page',
        name: 'ApplicationTable',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationTable.vue')
        }
      },
      {
        path: 'application/:page/:step/:operation',
        name: 'ApplicationCreate',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationView.vue')
        }
      },
      {
        path: 'application/:page/:step/:operation/:id',
        name: 'ApplicationView',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationView.vue')
        }
      },
      {
        path: 'application/:page/:step/:operation/:id/:bank',
        name: 'ApplicationViewBank',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationView.vue')
        }
      },
      {
        path: 'company/:page',
        name: 'CompanyTable',
        component: function () {
          return import('../views/adminPages/company/CompanyTable.vue')
        }
      },
      {
        path: 'company/:page/:operation',
        name: 'CompanyCreate',
        component: function () {
          return import('../views/adminPages/company/CompanyView.vue')
        }
      },
      {
        path: 'company/:page/:operation/:id',
        name: 'CompanyView',
        component: function () {
          return import('../views/adminPages/company/CompanyView.vue')
        }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: function () {
          return import('../views/adminPages/reports/ReportsView.vue')
        }
      }
    ]
  },
  {
    path: '/applicant',
    name: 'Applicant',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/applicantPages/base/Applicant.vue')
    },
    children: [
      {
        path: 'dashboard',
        name: 'ApplicantDashboard',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/applicantPages/base/ApplicantDashboard.vue')
        }
      },
      {
        path: 'profile',
        name: 'ApplicantProfileView',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/ProfileView.vue')
        }
      },
      {
        path: 'application/:page',
        name: 'ApplicantApplicationTable',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationTable.vue')
        }
      },
      {
        path: 'application/:page/:step/:operation',
        name: 'ApplicantApplicationCreate',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationView.vue')
        }
      },
      {
        path: 'application/:page/:step/:operation/:id',
        name: 'ApplicantApplicationView',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationView.vue')
        }
      },
      {
        path: 'application/:page/:step/:operation/:id/:bank',
        name: 'ApplicantApplicationViewBank',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/ApplicationView.vue')
        }
      },
      {
        path: 'security',
        name: 'ApplicantAdminSecurity',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/Security.vue')
        }
      },
      {
        path: 'reports',
        name: 'ApplicantReports',
        component: function () {
          return import('../views/adminPages/reports/ReportsView.vue')
        }
      }
    ]
  },
  {
    path: '/bankapplication',
    name: 'BankApplication',
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/applicantPages/base/Applicant.vue')
    },
    children: [
      {
        path: 'bankapplication/:page',
        name: 'BankApproverApplicationTable',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/BankApproverApplicationTable.vue')
        }
      },
      {
        path: 'bankapplication/:page/:step/:operation',
        name: 'BankApproverApplicationCreate',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/BankApproverApplicationView.vue')
        }
      },
      {
        path: 'bankapplication/:page/:step/:operation/:id',
        name: 'BankApproverApplicationView',
        component: function () {
          return import(/* webpackChunkName: "about" */ '../views/general/applications/BankApproverApplicationView.vue')
        }
      }
    ]
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_PREFIX || '',
  routes
})

export default router
