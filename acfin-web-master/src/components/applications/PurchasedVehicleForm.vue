<template>
  <v-container>
    <div class="pb-3">
      <b>Motor Vehicle To Be Purchased</b>
    </div>
    <div
      v-if="bankTransferRemarks"
      class="pb-3"
    >
      <b>Note:</b> {{ bankTransferRemarks }}
    </div>
    <v-row>
      <v-col
        cols="12"
        md="6"
        sm="6"
      >
        <LookUpSelect
          id="vehicleBranch"
          v-model="branch"
          name="branch"
          item-text="name"
          label="Branch"
          text-field-class="required-field"
          :is-dense="false"
          :outlined="editable"
          :can-edit="editable"
          :error-messages="genericError('branch','Branch')"
          @input="$v.branch.$touch()"
          @blur="$v.branch.$touch()"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-select
          id="vehicleBrand"
          v-model="brand"
          :items="brands"
          class="black--text required-field"
          label="Brand"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('brand','Brand')"
          @input="$v.brand.$touch()"
          @blur="$v.brand.$touch()"
          @change="() => {
            model = ''
            variant = ''
            year = ''
          }"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          id="vehicleModel"
          v-model="model"
          item-text="model"
          item-value="model"
          :items="vehicleModelList"
          label="Model"
          class="required-field"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('model','Model/Variant')"
          @input="$v.model.$touch()"
          @blur="$v.model.$touch()"
          @change="() => {
            variant = ''
            year = ''
          }"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          id="vehicleUnit"
          v-model="variant"
          item-text="variant"
          item-value="_id"
          :items="vehicleVariantList"
          label="Variant"
          class="required-field"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('variant','Variant')"
          @input="$v.variant.$touch()"
          @blur="$v.variant.$touch()"
          @change="() => {
            year = ''
          }"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <LookUpSelect
          id="vehicleYear"
          v-model="year"
          name="vehicle"
          item-text="year"
          label="Year"
          text-field-class="required-field"
          :is-dense="false"
          :outlined="false"
          :can-edit="false"
          :error-messages="genericError('year','Year')"
          @input="$v.year.$touch()"
          @blur="$v.year.$touch()"
        />
      </v-col>
      <v-col>
        <v-text-field
          id="bodyConversion"
          v-model="bodyConversion"
          label="Body Conversion"
          :outlined="editable"
          :disabled="!editable"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          id="vehicleSellingPrice"
          v-model="sellingPrice"
          prepend-inner-icon="₱"
          class="required-field"
          type="text"
          label="Selling Price"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('sellingPrice','Selling Price')"
          @input="$v.sellingPrice.$touch()"
          @blur="$v.sellingPrice.$touch()"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        sm="3"
      >
        <v-text-field
          id="vehicleAmountFinance"
          v-model="amountFinance"
          class="required-field"
          prepend-inner-icon="₱"
          label="Amount Financed"
          :outlined="editable"
          :disabled="!editable"
          :error-messages="genericError('amountFinance','Amount Financed')"
          @input="$v.amountFinance.$touch()"
          @blur="$v.amountFinance.$touch()"
        />
      </v-col>
    </v-row>
    <v-row
      justify="space-between"
    >
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-text-field
          id="vehicleDownpayment"
          v-model="downpayment"
          class="required-field"
          label="Downpayment"
          :outlined="editable"
          prepend-inner-icon="%"
          type="number"
          :disabled="!editable"
          :error-messages="genericError('downpayment','Downpayment')"
          @input="$v.downpayment.$touch()"
          @blur="$v.downpayment.$touch()"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        md="6"
      >
        <v-radio-group
          id="vehicleTerm"
          v-model="term"
          row
          mandatory
          :disabled="!editable"
        >
          <template v-slot:label>
            <div><strong>Term: </strong></div>
          </template>
          <v-radio
            v-for="item in ['12', '18', '24', '36', '48', '60']"
            id="vehicleTermItems"
            :key="item"
            :label="`${item} months`"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <LookUpSelect
          id="vehicleSalesExecutive"
          v-model="salesExecutive"
          name="auh"
          item-text="name"
          label="Sales Executive"
          :query="{ userRole: 'salesExecutive', singleBranch: branch }"
          text-field-class="required-field"
          :is-dense="false"
          :outlined="editable && !isSalesExecutive"
          :can-edit="editable && !isSalesExecutive"
          :error-messages="genericError('salesExecutive','Sales Executive')"
          @input="$v.salesExecutive.$touch()"
          @blur="$v.salesExecutive.$touch()"
        />
      </v-col>
      <v-col>
        <div class="d-flex">
          <v-file-input
            id="validID"
            v-model="validID"
            accept="image/*"
            :outlined="editable"
            label="Valid ID (file size must be less than 3 mb)"
            small-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="validID && [validID].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('validID','Valid ID')"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, validID)"
            @input="$v.validID.$touch()"
            @blur="$v.validID.$touch()"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="validID && [validID].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, validID)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        md="12"
        sm="12"
      >
        <v-radio-group
          id="type"
          v-model="type"
          row
          mandatory
          :disabled="!editable"
        >
          <template v-slot:label>
            <div><strong>Type: </strong></div>
          </template>
          <v-radio
            v-for="item in ['Local Based', 'OFW Land Based', 'OFW Sea Based']"
            id="type"
            :key="item"
            :label="item"
            :value="item"
          />
        </v-radio-group>
      </v-col>
    </v-row>
    <v-row
      v-if="type === 'Local Based'"
    >
      <v-col
        cols="12"
        sm="11"
        md="11"
      >
        <div
          class="d-flex"
        >
          <v-file-input
            id="localCOE"
            v-model="localCOE"
            :class="local.coe.required ? 'required-field' : ''"
            :outlined="editable"
            label="COE with compensation details issued not more than 1 month + authorization letter to verify (file size must be less than 3 mb)"
            small-chips
            :disabled="!editable"
            deletable-chips
            :clearable="true"
            :append-icon="localCOE && [localCOE].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('localCOE','COE with compensation details issued not more than 1 month + authorization letter to verify')"
            @input="$v.localCOE.$touch()"
            @blur="$v.localCOE.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, localCOE)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="localCOE && [localCOE].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, localCOE)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="localPayslip"
            v-model="localPayslip"
            :class="local.payslip.required ? 'required-field' : ''"
            :outlined="editable"
            label="Copy of latest 3 months payslips (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="localPayslip && [localPayslip].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('localPayslip','Copy of latest 3 months payslips')"
            @input="$v.localPayslip.$touch()"
            @blur="$v.localPayslip.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, localPayslip)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="localPayslip && [localPayslip].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, localPayslip)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="localITR"
            v-model="localITR"
            :outlined="editable"
            label="Copy of latest income tax return (Form 2316) (file size must be less than 3 mb)"
            small-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="localITR && [localITR].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('localITR','Copy of latest income tax return (Form 2316)')"
            @input="$v.localITR.$touch()"
            @blur="$v.localITR.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, localITR)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="localITR && [localITR].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, localITR)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row
      v-if="type === 'OFW Land Based'"
    >
      <v-col
        cols="12"
        sm="11"
        md="11"
      >
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwLandCOE"
            v-model="ofwLandCOE"
            :outlined="editable"
            label="Latest contract / COE with compensation details (file size must be less than 3 mb)"
            small-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwLandCOE && [ofwLandCOE].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwLandCOE','Latest contract / COE with compensation details')"
            @input="$v.ofwLandCOE.$touch()"
            @blur="$v.ofwLandCOE.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwLandCOE)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwLandCOE && [ofwLandCOE].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwLandCOE)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwLandPayslip"
            v-model="ofwLandPayslip"
            :outlined="editable"
            label="Copy of Latest 3 months Payslips (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwLandPayslip && [ofwLandPayslip].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwLandPayslip','Latest contract / COE with compensation details')"
            @input="$v.ofwLandPayslip.$touch()"
            @blur="$v.ofwLandPayslip.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwLandPayslip)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwLandPayslip && [ofwLandPayslip].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwLandPayslip)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwLandRemittance"
            v-model="ofwLandRemittance"
            :outlined="editable"
            label="Proof of remittance and latest 3 months bank statement of remittance account + authorization letter to verify (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwLandRemittance && [ofwLandRemittance].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwLandRemittance', 'Proof of remittance and latest 3 months bank statement of remittance account + authorization letter to verify')"
            @input="$v.ofwLandRemittance.$touch()"
            @blur="$v.ofwLandRemittance.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwLandRemittance)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwLandRemittance && [ofwLandRemittance].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwLandRemittance)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <div
      v-if="type === 'OFW Land Based'"
      class="pb-3"
    >
      <b>Note: If client is currently on vacation please provide return ticket and Copy of passport all pages</b>
    </div>
    <v-row
      v-if="type === 'OFW Sea Based'"
    >
      <v-col
        cols="12"
        sm="11"
        md="11"
      >
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwSeaCOE"
            v-model="ofwSeaCOE"
            :outlined="editable"
            label="Latest contract / COE with compensation details + authorization letter to verify (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwSeaCOE && [ofwSeaCOE].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwSeaCOE', 'Latest contract / COE with compensation details + authorization letter to verify')"
            @input="$v.ofwSeaCOE.$touch()"
            @blur="$v.ofwSeaCOE.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaCOE)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwSeaCOE && [ofwSeaCOE].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaCOE)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwSeaPayslip"
            v-model="ofwSeaPayslip"
            :outlined="editable"
            label="Copy of latest 3 months payslip (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwSeaPayslip && [ofwSeaPayslip].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwSeaPayslip', 'Copy of latest 3 months payslip')"
            @input="$v.ofwSeaPayslip.$touch()"
            @blur="$v.ofwSeaPayslip.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaPayslip)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwSeaPayslip && [ofwSeaPayslip].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaPayslip)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwSeaAllotment"
            v-model="ofwSeaAllotment"
            :outlined="editable"
            label="Proof of allotment and bank statement of remittance account + authorization letter to verify (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwSeaAllotment && [ofwSeaAllotment].length && editable? 'mdi-download' : ''"
            :error-messages="genericError('ofwSeaAllotment', 'Proof of allotment and bank statement of remittance account + authorization letter to verify')"
            @input="$v.ofwSeaAllotment.$touch()"
            @blur="$v.ofwSeaAllotment.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaAllotment)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwSeaAllotment && [ofwSeaAllotment].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaAllotment)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <div
      v-if="type === 'OFW Sea Based'"
      class="pb-3"
    >
      <b>Additional Requirement for OFW Sea Based</b>
    </div>
    <v-row
      v-if="type === 'OFW Sea Based'"
    >
      <v-col
        cols="12"
        sm="11"
        md="11"
      >
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwSeaTip"
            v-model="ofwSeaTip"
            :outlined="editable"
            label="Tipping Position (ex: F&B and Hotel Operation) (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwSeaTip && [ofwSeaTip].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwSeaTip', 'Proof of allotment and bank statement of remittance account + authorization letter to verify')"
            @input="$v.ofwSeaTip.$touch()"
            @blur="$v.ofwSeaTip.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaTip)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwSeaTip && [ofwSeaTip].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaTip)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
        <div
          class="d-flex"
        >
          <v-file-input
            id="ofwSeaVoucher"
            v-model="ofwSeaVoucher"
            :outlined="editable"
            label="Voucher or three (3) months latest bank statements reflecting commision / Tipping income (file size must be less than 3 mb)"
            small-chips
            deletable-chips
            :disabled="!editable"
            :clearable="true"
            :append-icon="ofwSeaVoucher && [ofwSeaVoucher].length && editable ? 'mdi-download' : ''"
            :error-messages="genericError('ofwSeaVoucher', 'Proof of allotment and bank statement of remittance account + authorization letter to verify')"
            @input="$v.ofwSeaVoucher.$touch()"
            @blur="$v.ofwSeaVoucher.$touch()"
            @click:append="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaVoucher)"
          >
            <template v-slot:selection="{ index, text, file }">
              <v-chip
                close
                color="primary"
                @click:close="deleteChip(index)"
              >
                {{ text || file.originalname }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn
            v-if="ofwSeaVoucher && [ofwSeaVoucher].length && !editable"
            icon
            class="mt-3"
            @click="download(`attachment/${$route.params.bank ? `bankApplication/${$route.params.bank}` : `${$s.userRole.includes('bankApprover') ? 'bankApplication' : 'application'}/${$route.params.id}`}`, ofwSeaVoucher)"
          >
            <v-icon>
              mdi-download
            </v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-container>
      <v-row
        justify="center"
      >
        <v-col
          cols="12"
          sm="12"
          md="12"
          align="start"
        >
          <div class="py-3">
            <p>*Accredited Banks and Financial Institutions pertain to the following chosen institutions and their affliates:</p>
          </div>
        </v-col>
      </v-row>
      <v-row
        justify="center"
      >
        <v-col
          cols="12"
          sm="12"
          md="12"
          align="justify"
        >
          <v-autocomplete
            id="banks"
            v-model="banks"
            class="required-field"
            label="Banks"
            :items="bankListFiltered"
            item-text="name"
            item-value="_id"
            multiple
            small-chips
            deletable-chips
            :outlined="editable"
            :disabled="!editable"
            :error-messages="genericError('banks','Banks')"
            @input="$v.banks.$touch()"
            @blur="$v.banks.$touch()"
          >
            <template v-slot:prepend-item>
              <v-list-item
                ripple
                @click="selectAllBank"
              >
                <v-list-item-action>
                  <v-icon
                    :color="banks && banks.length > 0 ? 'blue darken-4' : ''"
                  >
                    {{ selectAllIcon }}
                  </v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    Select All
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider class="mt-2" />
            </template>
            <template v-slot:selection="{ index, item }">
              <v-chip
                close
                color="primary"
                @click:close="() => {
                  banks.splice(index, 1)
                }"
              >
                {{ item.name }}
              </v-chip>
            </template>
          </v-autocomplete>
          <div class="pb-3">
            <p>(Unless otherwise indicated, you consent to the endorsement of your personal information to all of the foregoing banking and financial institutions.)</p>
          </div>
          <div
            class="d-flex"
          >
            <v-checkbox
              v-model="consentClause"
              :disabled="!editable"
            />
            <span class="mt-5">
              I agree to follow the
              <a
                class="blue--text text-decoration-underline"
                :style="`pointer-events: ${editable ? '' : 'none' }`"
                :readOnly="!editable"
                @click.stop="consentDialog = true"
              >
                Consent Clause
              </a>
              <ConsentClause
                v-model="consentDialog"
                :brand="getBrand"
                :branch="getBranch"
                :editable="editable"
                @agree="(obj) => {
                  agree(obj)
                }"
              />
            </span>
          </div>
          <p class="text-bold text-italic">
            *You must view the consent clause and add your signature before submitting this application*
          </p>
          <p>
            The consent and authorization will remain valid throughout the existence of my account(s) unless
            withdrawn in writing or withheld due to changes of information given by the company.
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { LookUpSelect } from 'maroon-vue-components'
import { validationMixin, custom, validationErrors } from '@/utils/validations'
import fileInputMixin from '@/mixins/fileInputMixin'
import ConsentClause from '@/components/applications/ConsentClause'
import { convertToCurrency } from '@/utils/helpers'

export default {
  name: 'PurchasedVehicleForm',
  components: {
    LookUpSelect,
    ConsentClause
  },
  mixins: [validationMixin, fileInputMixin],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean
  },
  data: () => ({
    brands: [
      'Honda',
      'Isuzu',
      'KIA',
      'KTM',
      'Maxus',
      'Volkswagen'
    ],
    consentDialog: false,
    signature: undefined
  }),
  computed: {
    ...validationErrors,
    ...mapFields('application', {
      bankTransferRemarks: 'bankTransferRemarks',
      branch: 'vehiclePurchased.branch',
      brand: 'vehiclePurchased.brand',
      model: 'vehiclePurchased.model',
      variant: 'vehiclePurchased.variant',
      bodyConversion: 'vehiclePurchased.bodyConversion',
      year: 'vehiclePurchased.year',
      sellingPrice: 'vehiclePurchased.sellingPrice',
      amountFinance: 'vehiclePurchased.amountFinance',
      downpayment: 'vehiclePurchased.downpayment',
      term: 'vehiclePurchased.term',
      salesExecutive: 'vehiclePurchased.salesExecutive',
      validID: 'vehiclePurchased.validID',
      localCOE: 'vehiclePurchased.local.coe.attachment',
      localPayslip: 'vehiclePurchased.local.payslip.attachment',
      localITR: 'vehiclePurchased.local.itr.attachment',
      ofwLandCOE: 'vehiclePurchased.ofwLandBased.coe.attachment',
      ofwLandPayslip: 'vehiclePurchased.ofwLandBased.payslip.attachment',
      ofwLandRemittance: 'vehiclePurchased.ofwLandBased.remittance.attachment',
      ofwSeaCOE: 'vehiclePurchased.ofwSeaBased.coe.attachment',
      ofwSeaPayslip: 'vehiclePurchased.ofwSeaBased.payslip.attachment',
      ofwSeaAllotment: 'vehiclePurchased.ofwSeaBased.allotment.attachment',
      ofwSeaTip: 'vehiclePurchased.ofwSeaBased.tip.attachment',
      ofwSeaVoucher: 'vehiclePurchased.ofwSeaBased.voucher.attachment',
      banks: 'vehiclePurchased.banks',
      type: 'vehiclePurchased.type',
      local: 'vehiclePurchased.local',
      ofwLandBased: 'vehiclePurchased.ofwLandBased',
      ofwSeaBased: 'vehiclePurchased.ofwSeaBased',
      consentClause: 'consentClause'
    }),
    ...mapFields('masterData', {
      bankList: 'financingPartner',
      bankListIsLoading: 'financingPartnerIsLoading',
      vehicleList: 'vehicle'
    }),
    isCreate () {
      return this.$route.params.operation === 'create'
    },
    isSalesExecutive () {
      return this.$s.userRole && this.$s.userRole.includes('salesExecutive')
    },
    getBrand () {
      return this.brand
    },
    getBranch () {
      return this.branch
    },
    bankListFiltered () {
      return this.bankList.filter((x) => {
        if ((x.brand && x.brand.includes(this.brand)) && (x.branch && x.branch.includes(this.branch))) {
          return x
        }
      })
    },
    vehicleModelList () {
      return this.vehicleList.filter((x) => {
        if (x.brand === this.brand) {
          return x
        }
      })
    },
    vehicleVariantList () {
      return this.vehicleList.filter((x) => {
        if (x.model === this.model) {
          return x
        }
      })
    },
    allBanksSelected () {
      return this.banks && this.banks.length === this.bankListFiltered.length
    },
    someBanksSelected () {
      return this.banks && this.banks.length > 0 && !this.allBanksSelected
    },
    selectAllIcon () {
      if (this.allBanksSelected) return 'mdi-close-box'
      if (this.someBanksSelected) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    }
  },
  watch: {
    downpayment: {
      handler (obj) {
        this.computeAmountFinance(this.sellingPrice, obj)
      }
    },
    sellingPrice: {
      handler (obj) {
        if (this.allowDigits(obj)) {
          this.parseAmountToCurrency(obj, 'sellingPrice')
          this.computeAmountFinance(obj, this.downpayment)
        }
      }
    },
    amountFinance: {
      handler (obj) {
        this.parseAmountToCurrency(obj.toString(), 'amountFinance')
      }
    },
    variant: {
      handler (obj) {
        this.year = obj
      },
      deep: true
    }
  },
  beforeDestroy () {
    this.$store.dispatch('masterData/reset', ['financingPartner'])
  },
  beforeUpdate () {
    if (this.isCreate) {
      if (this.$s.userRole && this.$s.userRole.length && this.$s.userRole.includes('salesExecutive')) {
        this.salesExecutive = this.$s.user
      }
    }
  },
  async created () {
    this.$store.dispatch('masterData/initOpts', { mds: ['financingPartner'] })
    this.$store.dispatch('masterData/initOpts', { mds: ['vehicle'] })
  },
  methods: {
    selectAllBank () {
      if (this.allBanksSelected) {
        this.banks = []
      } else {
        this.banks = this.bankListFiltered.slice()
      }
    },
    computeAmountFinance (sellingPrice, downpayment) {
      const sellingPriceInt = !sellingPrice ? 0 : this.convertToNum(sellingPrice)
      const downpaymentInt = !downpayment ? 0 : Number(downpayment)
      const downpaymentToDecimal = downpaymentInt / 100
      this.amountFinance = sellingPriceInt - (sellingPriceInt * downpaymentToDecimal)
    },
    agree (obj) {
      this.$nextTick(() => {
        this.consentClause = obj
      })
    },
    async fileToBlob (file) {
      const fileToBlob = new Blob([new Uint8Array(await file.arrayBuffer())], { type: file.type })
      return fileToBlob
    },
    parseAmountToCurrency (value, key) {
      this[key] = convertToCurrency(value)
    },
    convertToNum (value) {
      return Number.parseInt(value.replace(/,/g, ''))
    },
    allowDigits (obj) {
      return obj.match(/\d/g) && obj.match(/\d/g).length
    },
    signatureDisplay (key) {
      let display = ''
      if (this[key]) {
        if (this[key].name) {
          display = this[key].name
        } else {
          const isArray = Array.isArray(this[key])
          if (isArray) {
            this[key].forEach((x) => {
              display = x.filename
            })
          }
        }
      }
      return display
    }
  },
  validations () {
    return custom.purchasedVehicleForm(this)
  }
}
</script>
<style scoped>
#signature {
  border: double 3px transparent;
  border-radius: 5px;
  background-image: linear-gradient(white, white),
    radial-gradient(circle at top left, #4bc5e8, #9f6274);
  background-origin: border-box;
  background-clip: content-box, border-box;
}

.text-bold {
  font-weight: bold;
}

.text-italic {
  font-style: italic;
}
</style>
