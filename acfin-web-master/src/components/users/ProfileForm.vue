<template>
  <v-col>
    <v-row
      class="ma-5"
    >
      <v-col>
        <v-btn
          :id="operation !== 'create' && editable ? 'cancelBtn' : 'backBtn'"
          outlined
          :color="operation !== 'create' && editable ? 'error' : 'grey'"
          class="px-12"
          :loading="crudFormMethods.loading"
          @click="cancelButton"
        >
          {{ operation !== 'create' && editable ? 'Cancel' : 'Back' }}
        </v-btn>
      </v-col>
      <v-col
        class="d-flex justify-end"
      >
        <div
          v-if="operation !== 'create'"
        >
          <v-btn
            v-if="showLabel('canUpdateUserByUserRole') && !editable"
            id="editBtn"
            color="success"
            class="px-10"
            :loading="crudFormMethods.loading"
            @click="edit"
          >
            <v-icon
              class="pr-2"
            >
              mdi-pencil
            </v-icon>
            <span>{{ getLabel('canUpdateUserByUserRole', 'Edit') }}</span>
          </v-btn>
          <v-btn
            v-if="showLabel('canUpdateUserByUserRole') && editable && (operation !== 'create')"
            id="saveBtn"
            color="success"
            class="px-10"
            :loading="crudFormMethods.loading"
            @click="() => {
              crudFormMethods.save()
            }"
          >
            <v-icon
              class="pr-2"
            >
              mdi-pencil
            </v-icon>
            <span>{{ getLabel('canUpdateUserByUserRole', 'Save') }}</span>
          </v-btn>
        </div>
        <div
          v-if="operation !== 'create'"
          class="ml-2"
        >
          <v-btn
            v-if="showLabel('canSoftDeleteUserByUserRole') && !editable && (operation !== 'create') && operation"
            id="deleteBtn"
            color="error"
            class="px-5"
            :loading="crudFormMethods.loading"
            outlined
            @click="() => {
              deleteUser()
            }"
          >
            <v-icon
              class="pr-2"
            >
              mdi-delete
            </v-icon>
            <span>Delete User</span>
          </v-btn>
        </div>
        <div
          v-if="operation === 'create'"
          class="ml-2"
        >
          <v-btn
            id="createBtn"
            color="success"
            class="px-5"
            :loading="crudFormMethods.loading"
            @click="submit"
          >
            <v-icon
              class="pr-2"
            >
              mdi-plus-circle-outline
            </v-icon>
            <span>Create User</span>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-card
      class="ma-5"
      :flat="operation === 'create'"
    >
      <v-system-bar
        v-if="operation !== 'create'"
        color="light-blue darken-4"
        lights-out
        dark
        height="50"
        class="pa-5"
      >
        <h3> User Record </h3>
      </v-system-bar>
      <v-card-title>
        <div
          v-if="operation === 'create'"
          class="py-5 pl-3"
        >
          <p>Create User</p>
        </div>
        <div
          v-else
        >
          <span
            class="light-blue--text text--darken-4"
          >
            {{ editable ? 'Update Details' : 'Details' }}
          </span>
        </div>
      </v-card-title>
      <v-col
        class="pa-5"
      >
        <v-row>
          <v-col>
            <v-select
              id="userRole"
              v-model.trim="userRole"
              label="Designation"
              class="black--text required-field"
              :clearable="false"
              :outlined="canEditUserRole()"
              :disabled="!canEditUserRole()"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('userRole', 'User role')"
              :items="filteredUserRoles"
              @input=" () => {
                $v.userRole.$touch()
                multipleBranch = undefined
                singleBranch = undefined
              }"
              @blur="$v.userRole.$touch()"
            />
          </v-col>
          <v-col
            v-if="userRole !== 'customer'"
          >
            <SelectAll
              v-if="['bankApprover', 'finance', 'salesManager', 'superUser'].includes(userRole)"
              id="branch"
              v-model="multipleBranch"
              label="Branch"
              :items="branches"
              item-text="name"
              item-value="_id"
              :editable="editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('multipleBranch','Branch')"
              @input="$v.multipleBranch.$touch(), clearBank()"
              @blur="$v.multipleBranch.$touch()"
            />
            <v-autocomplete
              v-if="['admin', 'customer', 'salesExecutive', 'systemAdmin'].includes(userRole)"
              id="branch"
              v-model="singleBranch"
              class="black--text required-field"
              label="Branch"
              :items="branches"
              item-text="name"
              item-value="_id"
              :outlined="editable"
              :disabled="!editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('singleBranch','Branch')"
              @input="$v.singleBranch.$touch(), clearBank()"
              @blur="$v.singleBranch.$touch()"
            />
          </v-col>
          <v-col>
            <SelectAll
              v-if="['admin', 'bankApprover', 'finance', 'salesExecutive', 'salesManager', 'systemAdmin', 'superUser'].includes(userRole)"
              id="brand"
              v-model="brand"
              label="Brands"
              :items="brands"
              :editable="editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('brand','Brand')"
              @input="$v.brand.$touch()"
              @blur="$v.brand.$touch()"
            />
          </v-col>
          <v-col
            v-if="userRole === 'bankApprover'"
          >
            <v-select
              id="bank"
              v-model="bank"
              class="black--text required-field"
              label="Bank"
              :items="bankListFiltered"
              item-text="name"
              item-value="_id"
              :outlined="editable"
              :disabled="!editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('bank','Bank')"
              @input="$v.bank.$touch()"
              @blur="$v.bank.$touch()"
            />
          </v-col>
          <v-col
            v-if="userRole === 'superUser'"
          >
            <SelectAll
              id="superUserBank"
              v-model="superUserBank"
              label="Bank"
              item-text="name"
              item-value="_id"
              :items="bankListFiltered"
              :editable="editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('superUserBank','Bank')"
              @input="$v.superUserBank.$touch()"
              @blur="$v.superUserBank.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          v-if="getPrivilege('canActivateUserByUserRole')"
        >
          <v-col>
            <v-switch
              v-if="operation !== 'create' && !editable"
              id="userActivation"
              v-model="status"
              color="primary"
              :label="activationLabel"
              :loading="switchLoading"
              value="active"
              @change="handleChangeActive"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12">
            <v-text-field
              id="lastName"
              v-model="lastName"
              class="black--text required-field"
              label="Last Name"
              type="text"
              :outlined="editable"
              :disabled="!editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('lastName','Last name')"
              @input="$v.lastName.$touch()"
              @blur="$v.lastName.$touch()"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12">
            <v-text-field
              id="firstName"
              v-model="firstName"
              class="black--text required-field"
              label="First Name"
              type="text"
              :outlined="editable"
              :disabled="!editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('firstName','First name')"
              @input="$v.firstName.$touch()"
              @blur="$v.firstName.$touch()"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12">
            <v-text-field
              id="middleName"
              v-model="middleName"
              class="black--text"
              label="Middle Name"
              type="text"
              :outlined="editable"
              :disabled="!editable"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('middleName', 'Middle name')"
              @input="$v.middleName.$touch()"
              @blur="$v.middleName.$touch()"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12">
            <v-text-field
              id="telephone"
              v-model="telephone"
              class="black--text"
              label="Telephone No."
              :loading="crudFormMethods.loading"
              :outlined="editable && !profile"
              :disabled="!editable || profile"
            />
          </v-col>
        </v-row>
        <v-row class="mt-n5">
          <v-col cols="12">
            <v-text-field
              id="mobile"
              v-model="mobile"
              class="black--text required-field"
              label="Mobile"
              :outlined="editable && !profile"
              :disabled="!editable || profile"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('mobile', 'Mobile')"
              @input="$v.mobile.$touch()"
              @blur="$v.mobile.$touch()"
            />
          </v-col>
        </v-row>
        <v-row
          align-self="start"
          justify="center"
          class="mt-n5"
        >
          <v-col cols="12">
            <v-text-field
              id="email"
              v-model="email"
              class="black--text required-field"
              label="Email"
              type="email"
              :outlined="editable && !profile"
              :disabled="!editable || profile"
              :loading="crudFormMethods.loading"
              :error-messages="genericError('email', 'Email')"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
            />
          </v-col>
        </v-row>
        <template v-if="!editable && !checkStatus">
          <v-row
            align-self="start"
            justify="center"
            class="mt-n5"
          >
            <v-col cols="12">
              <v-text-field
                id="reason"
                v-model="reason"
                class="black--text required-field"
                label="Reason"
                type="text"
                disabled
                :loading="crudFormMethods.loading"
                @input="$v.email.$touch()"
                @blur="$v.email.$touch()"
              />
            </v-col>
          </v-row>
        </template>
        <v-divider
          v-if="!operation && !editable"
          class="my-10"
        />
        <v-row
          v-if="!operation && !editable"
          class="my-5"
        >
          <v-btn
            id="changePasswordBtn"
            text
            color="light-blue darken-4"
            :loading="crudFormMethods.loading"
            @click="() => {
              $router.push({
                name: $s.userType === 'Internal' ? 'AdminSecurity' : 'ApplicantAdminSecurity'
              })
            }"
          >
            Change Password
          </v-btn>
        </v-row>
        <v-row
          v-if="!editable && operation === 'view' && ($s.userRole.includes('admin') || $s.userRole.includes('superUser'))"
          class="my-5"
        >
          <v-btn
            id="resetPasswordBtn"
            text
            color="light-blue darken-4"
            :loading="crudFormMethods.loading"
            @click="resetPasswordDialog = true"
          >
            Reset Password
          </v-btn>
        </v-row>
        <v-row
          v-if="operation === 'create'"
        >
          <v-col
            class="d-flex justify-end"
          >
            <v-btn
              id="bottomCreateBtn"
              class="px-5"
              color="success"
              :loading="crudFormMethods.loading"
              @click.stop="submit()"
            >
              <v-icon
                class="pr-2"
              >
                mdi-plus-circle-outline
              </v-icon>
              Create User
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <CustomDialog
        v-model="openCustomModal"
        :status="setCustomStatus"
        @reason="getReasonValue"
      />
      <reset-password-dialog
        v-model="resetPasswordDialog"
        :email="email"
      />
    </v-card>
  </v-col>
</template>

<script>
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import { mapFields } from 'vuex-map-fields'
import crud from '@/rest/crud'
import { privilegeMixin } from 'session-plugin'
import CustomDialog from './CustomDialog.vue'
import ResetPasswordDialog from './ResetPasswordDialog.vue'
import mD from '@/mixins/masterData'
import SelectAll from '@/components/users/SelectAll'

export default {
  components: {
    CustomDialog,
    ResetPasswordDialog,
    SelectAll
  },
  mixins: [
    validationMixin,
    privilegeMixin
  ],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean,
    profile: {
      type: Boolean,
      default: false
    },
    crudFormMethods: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    reasonVal: '',
    resetPasswordDialog: false,
    activeEvent: null,
    setCustomStatus: false,
    openCustomModal: false,
    switchLoading: false,
    readOnly: true,
    listOfRoles: []
  }),
  computed: {
    ...validationErrors,
    ...mapFields('users', {
      lastName: 'info.lastName',
      firstName: 'info.firstName',
      middleName: 'info.middleName',
      suffix: 'info.suffix',
      telephone: 'info.telephone',
      email: 'info.email',
      mobile: 'info.mobile',
      status: 'info._status',
      userRole: 'info.userRole',
      designation: 'info.designation',
      multipleBranch: 'info.multipleBranch',
      singleBranch: 'info.singleBranch',
      brand: 'info.brand',
      reason: 'info.reason',
      bank: 'info.bank',
      userType: 'info.userType',
      attachments: 'attachments',
      superUserBank: 'info.superUserBank'
    }),
    ...mapFields('masterData', {
      branches: 'branch',
      branchesLoading: 'branchIsLoading',
      banks: 'financingPartner',
      bankListIsLoading: 'financingPartnerIsLoading'
    }),
    activationLabel () {
      return this.status === 'active' ? 'Active' : 'Inactive'
    },
    id () {
      return this.$route.params.id
    },
    designations () {
      return ['Software Engineer', 'Manager', 'Assistant Manager']
    },
    brands () {
      return ['Honda', 'Isuzu', 'KIA', 'KTM', 'Maxus', 'Volkswagen']
    },
    checkStatus () {
      return this.status === 'active'
    },
    filteredUserRoles () {
      const data = this.listOfRoles.filter((x) => {
        if (this.operation !== 'create') {
          if (['bankApprover', 'customer', 'finance'].includes(this.userRole)) {
            if (this.userRole === x.value) {
              return x
            }
          } else {
            if (['salesExecutive', 'salesManager', 'admin', 'systemAdmin', 'superUser'].includes(x.value)) {
              return x
            }
          }
        } else {
          if (this.$s.userRole.includes('salesManager')) {
            if (['salesExecutive', 'salesManager', 'admin', 'systemAdmin', 'bankApprover', 'customer', 'finance'].includes(x.value)) {
              return x
            }
          } else {
            return x
          }
        }
      })
      return data
    },
    bankListFiltered () {
      return this.banks.filter(x => {
        if (this.multipleBranch && this.multipleBranch.length && this.multipleBranch.some((r) => x.branch && x.branch.includes(r))) {
          return x
        }
      })
    }
  },
  watch: {
    multipleBranch: {
      async handler (obj) {
        if (this.operation === 'create') {
          await this.multipleEmailAttachments(obj)
        }
      },
      deep: true
    },
    singleBranch: {
      async handler (obj) {
        if (this.operation === 'create') {
          await this.singleEmailAttachments(obj)
        }
      },
      deep: true
    }
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['branch'])
    this.$store.dispatch('masterData/reset', ['financingPartner'])
  },
  async created () {
    await this.fetchUsers()
    if (this.operation === 'create') {
      if (this.$s.userRole && this.$s.userRole.length && this.$s.userRole.includes('salesExecutive')) {
        this.userRole = 'customer'
      }
    }
    this.$store.dispatch('masterData/initOpts', { mds: ['branch'] })
    this.$store.dispatch('masterData/initOpts', { mds: ['financingPartner'], dataview: { financingPartner: 'select' } })
  },
  methods: {
    clearBank () {
      this.superUserBank = null
      this.brand = null
      this.bank = undefined
    },
    async multipleEmailAttachments (obj) {
      const attachments = []
      if (obj && obj.length) {
        const company = []
        obj.forEach((x) => {
          const branchDetails = this.branches.find((branch) => branch._id === x)
          branchDetails && company.push(branchDetails.company)
        })
        const uniqueCompany = [...new Set(company)]
        uniqueCompany.forEach(async (x, index) => {
          const branchDetails = this.branches.find((branch) => branch.company === x)
          const companyLogo = branchDetails && branchDetails.companyData && branchDetails.companyData.logo
          const url = `attachment/company/${branchDetails && branchDetails.company}`
          const fieldname = companyLogo && companyLogo.length && companyLogo[0].fieldname
          const filename = companyLogo && companyLogo.length && companyLogo[0].filename
          if (fieldname && filename) {
            const image = await this.getImage(url, fieldname, filename)
            attachments.push({
              filename: `app-logo${index + 1}`,
              path: image,
              cid: `app-logo${index + 1}`
            })
          }
        })
      }
      this.attachments = attachments
    },
    async singleEmailAttachments (obj) {
      const attachments = []
      if (obj) {
        const branchDetails = this.branches.filter((branch) => branch._id === obj)[0]
        const companyLogo = branchDetails && branchDetails.companyData && branchDetails.companyData.logo
        const url = `attachment/company/${branchDetails && branchDetails.company}`
        const fieldname = companyLogo && companyLogo.length && companyLogo[0].fieldname
        const filename = companyLogo && companyLogo.length && companyLogo[0].filename
        if (fieldname && filename) {
          const image = await this.getImage(url, fieldname, filename)
          attachments.push({
            filename: 'app-logo1',
            path: image,
            cid: 'app-logo1'
          })
        }
        this.attachments = attachments
      }
    },
    async getImage (url, fieldname, filename) {
      const resp = await crud(`${url}/${fieldname}/${filename}`).get()
      const data = await resp.json()
      return data.file
    },
    formQuery (query) {
      return `?advancedQuery=${encodeURI(JSON.stringify(query))}`
    },
    async fetchUsers () {
      const query = this.formQuery({ _configType: { $nin: ['guest', 'default'] } })
      const resp = await mD.roles(query)
      if (resp.ok) {
        const data = await resp.json()
        const rolesDictionary = {
          superUser: 'Super User',
          customer: 'Customer',
          bankApprover: 'Bank Approver',
          finance: 'Finance',
          salesManager: 'Sales Manager',
          admin: 'Platform Admin',
          salesExecutive: 'Sales Executive',
          systemAdmin: 'System Admin'
        }
        this.listOfRoles = data.entries.map((x) => {
          return {
            value: x._configType,
            text: rolesDictionary[x._configType]
          }
        })
      }
    },
    edit () {
      this.crudFormMethods.readOnly = false
      this.crudFormMethods.cancelled = false
    },
    async deleteUser () {
      this.$store.dispatch('showDialog', {
        title: 'Delete user?',
        message: 'This will delete the user and can not be undone.',
        buttonLabel: 'Delete',
        callback: async () => {
          this.crudFormMethods.loading = true
          const resp = await this.crudFormMethods.api('delete').update(`${this.crudFormMethods.vuex.fields.userRole}/${this.crudFormMethods.id}/delete`)
          if (resp.ok) {
            this.$store.dispatch('showAlert', {
              message: 'User successfully deleted!',
              type: 'success'
            })
            this.$router.push({
              name: 'UserTable',
              params: {
                page: this.$route.params.page
              }
            })
          } else {
            this.$store.dispatch('showAlert', {
              message: (await resp.json()).error,
              type: 'error'
            })
          }
        }
      })
      this.crudFormMethods.loading = false
    },
    async cancelButton () {
      if (this.operation === 'create') {
        this.$router.go(-1)
      } else {
        if (this.editable) {
          this.crudFormMethods.readOnly = true
          this.crudFormMethods.cancelled = true
          await this.crudFormMethods.view()
        } else {
          if (this.id) {
            this.$router.push({
              name: 'UserTable',
              params: {
                page: this.$route.params.page
              }
            })
          } else {
            this.$router.go(-1)
          }
        }
      }
    },
    submit () {
      this.crudFormMethods.confirmDialog({
        title: 'Create user?',
        message: 'This will create a new user to the system.',
        callback: () => this.crudFormMethods.save((id) => {
          this.$router.push({
            name: 'UserView',
            params: {
              page: this.$route.params.page,
              operation: 'view',
              id
            }
          })
        }),
        showDialog: true
      })
    },
    async getReasonValue (event) {
      this.reasonVal = await event
      await this.activate(this.activeEvent)
    },
    handleChangeActive (obj) {
      const activateDialog = !!obj
      this.activeEvent = obj
      this.activateConfimationDialog(activateDialog)
    },
    async activateConfimationDialog (obj) {
      this.crudFormMethods.view()

      this.setCustomStatus = obj
      this.openCustomModal = true
    },
    async activate (obj) {
      this.switchLoading = true
      this.crudFormMethods.loading = true
      let resp
      let action
      if (obj) {
        resp = await crud('admin/user').update(`${this.userRole}/${this.id}/activate`)
        action = 'activated'
      } else {
        resp = await crud('admin/user').update(`${this.userRole}/${this.id}`, {
          info: {
            reason: this.reasonVal,
            _status: 'inactive'
          }
        })
        action = 'deactivated'
      }
      if (resp.ok) {
        this.$store.dispatch('showAlert', {
          message: `User successfully ${action}.`,
          type: 'success'
        })
      } else {
        this.$store.dispatch('showAlert', {
          message: (await resp.json()).error,
          type: 'error'
        })
      }
      this.switchLoading = false
      this.crudFormMethods.loading = false
      this.crudFormMethods.view()
    },
    canEditUserRole () {
      return this.editable && (this.$s.userRole && !this.$s.userRole.includes('salesExecutive'))
    }
  },
  validations () {
    const {
      firstName,
      middleName,
      lastName,
      email,
      mobile,
      multipleBranch,
      singleBranch,
      brand,
      userRole,
      bank,
      superUserBank
    } = custom.users(this)
    return {
      firstName,
      middleName,
      lastName,
      email,
      mobile,
      brand,
      multipleBranch,
      singleBranch,
      userRole,
      bank,
      superUserBank
    }
  }
}
</script>

<style scoped>
p {
  font-weight: 1000;
  color: #005C9F;
  font-size: 40px;
}
</style>
