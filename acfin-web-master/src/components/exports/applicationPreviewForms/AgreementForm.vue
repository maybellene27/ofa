<template>
  <div
    style="display: flex; margin-top: 10px"
  >
    <div
      style="width: 25%; margin-right: 20px"
    >
      <div
        class="p"
      >
        {{ $metaData.agreement.firstAgreement }}
      </div>
      <div
        style="margin-top: 20px"
      >
        <div
          class="field"
          style="margin-left: 20%"
        >
          <v-img
            :src="borrowerSignature || null"
            height="75"
            width="150"
          />
        </div>
        <div
          class="caption-2"
        >
          SIGNATURE OF BORROWER
        </div>
      </div>
      <div
        style="margin-top: 30px"
      >
        <div
          class="field"
          style="margin-left: 20%"
        >
          <v-img
            :src="spouseSignature || null"
            height="75"
            width="150"
          />
        </div>
        <div
          class="caption-2"
        >
          SIGNATURE OF SPOUSE/CO-MAKER
        </div>
      </div>
      <div
        class="main"
        style="margin-top: 50px"
      >
        <div
          class="field-label"
          style="margin-right: 5px;"
        >
          Date:
        </div>
        <div
          style="width: 80%;"
        >
          <div
            class="field"
          >
            {{ vehiclePurchased && vehiclePurchased.date }}
          </div>
          <div
            class="caption-2"
          >
            &nbsp;
          </div>
        </div>
      </div>
    </div>
    <div
      style="width: 70%"
    >
      <div
        class="p"
      >
        {{ $metaData.agreement.secondAgreement(companyName) }}
      </div>
      <div
        class="p"
        style="margin-top: 15px"
      >
        I confirm that my personal information may be used by the Company for the following purpose:
      </div>
      <div
        class="p"
        style="text-indent: 5px;"
      >
        <div
          v-for="(content, index) in $metaData.agreement.purpose"
          :key="index"
        >
          {{ index+1 }}. {{ content }}
        </div>
      </div>
      <div
        class="p"
        style="margin-top: 15px"
      >
        I confirm that I have placed a check mark beside the relevant provisions below to indicate my consent to the following
        processing of my personal information and the corresponding declared purposes thereof:
      </div>
      <div
        class="p"
        style="text-indent: 5px;"
      >
        __ Endorsement of my personal information to Accredited Banks* and Financial Institutions in order for the latter
        to market their car loan products and offers in connection with the bank financing of my purchase of the vehicle.
      </div>
      <div
        class="p"
        style="margin-top: 15px"
      >
        *Accredited Banks and Financial Institutions pertain to the following chosen institutions and their affiliates:
      </div>
      <div
        class="p-1"
        style="margin: 12px; text-indent: 10px;"
      >
        <v-row>
          <v-col
            v-for="(x, index) in banksSelected"
            :key="index"
            cols="4"
            md="4"
            sm="4"
            style="padding: 4px 10px;"
          >
            <p>{{ x.dot }}<span style="padding-left: 5px;">{{ x.name }}</span></p>
          </v-col>
        </v-row>
      </div>
      <!-- <div
        class="p-1"
        style="margin-top: 2px; text-indent: 10px; display: flex"
      >
        <div
          style="width: 30%"
        >
          __ BPI Family Savings Bank
        </div>
        <div
          style="width: 35%"
        >
          __ Rizal Commercial Banking Corp.
        </div>
        <div
          style="width: 40%"
        >
          __ China Savings Bank
        </div>
      </div>
      <div
        class="p-1"
        style="margin-top: 2px; text-indent: 10px; display: flex"
      >
        <div
          style="width: 30%"
        >
          __ Banco de Oro
        </div>
        <div
          style="width: 35%"
        >
          __ Security Bank Corp.
        </div>
        <div
          style="width: 40%"
        >
          __ United Coconut Planters Bank
        </div>
      </div>
      <div
        class="p-1"
        style="margin-top: 2px; text-indent: 10px; display: flex"
      >
        <div
          style="width: 30%"
        >
          __ Philippine Savings Bank
        </div>
        <div
          style="width: 35%"
        >
          __ Bank of Commerce
        </div>
        <div
          style="width: 40%"
        >
          __ EastWest Bank
        </div>
      </div>
      <div
        class="p-1"
        style="margin-top: 2px; text-indent: 10px; display: flex"
      >
        <div
          style="width: 30%"
        >
          __ Sterling Bank
        </div>
        <div
          style="width: 35%"
        >
          __ Maybank
        </div>
        <div
          style="width: 40%"
        >
          __ PNB Savings Bank
        </div>
      </div>
      <div
        class="p-1"
        style="margin-top: 2px; text-indent: 10px; display: flex"
      >
        <div
          style="width: 30%"
        >
          __ Robinsons Bank
        </div>
        <div
          style="width: 35%"
        >
          __ Send to all banks above
        </div>
        <div
          style="width: 40%"
        >
          __ Others, specify ______________
        </div>
      </div> -->
      <div
        style="margin-top: 5px; font-size: 8px; font-style: italic; text-indent: 20px;"
      >
        (Unless otherwise indicated, you consent to the endorsement of your personal information to all of the foregoing banking and financial institutions.)
      </div>
      <div
        class="p"
        style="margin-top: 15px"
      >
        The consent and authorization will remain valid throughout the existence of my account(s) unless withdrawn in
        writing or withheld due to changes of information given by the company.
      </div>
      <div
        class="main"
        style="margin-top: 40px"
      >
        <div
          style="width: 30%;"
        >
          <div
            class="field"
            style="margin-left: 20%"
          >
            <v-img
              :src="borrowerSignature || null"
              height="75"
              width="150"
            />
          </div>
          <div
            class="caption-2"
          >
            SIGNATURE OF BORROWER
          </div>
        </div>
        <div
          style="width: 30%; margin-left: 20px"
        >
          <div
            class="field"
            style="margin-left: 20%"
          >
            <v-img
              :src="spouseSignature || null"
              height="75"
              width="150"
            />
          </div>
          <div
            class="caption-2"
          >
            SIGNATURE OF SPOUSE/CO-MAKER
          </div>
        </div>
        <div
          style="width: 30%; margin-left: 20px; margin-top: 62px"
        >
          <div
            class="field"
          >
            {{ vehiclePurchased && vehiclePurchased.date }}
          </div>
          <div
            class="caption-2"
          >
            DATE
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    borrowerSignature: {
      type: String,
      default: ''
    },
    spouseSignature: {
      type: String,
      default: ''
    },
    vehiclePurchased: {
      type: Object,
      default: () => {}
    },
    companyName: {
      type: String,
      default: ''
    },
    bankList: {
      type: Array,
      default: () => {}
    }
  },
  computed: {
    banksSelected () {
      return this.bankList.map(x => {
        if (this.vehiclePurchased && this.vehiclePurchased.banks && this.vehiclePurchased.banks.some((r) => x.name && x.name.includes(r))) {
          return {
            dot: '[ * ]',
            name: x.name
          }
        } else {
          return {
            dot: '[   ]',
            name: x.name
          }
        }
      })
    }
  },
  methods: {
    hasBankActive (selectBank) {
      let isActive = false
      this.vehiclePurchased.banks.map(bank => {
        isActive = bank === selectBank
      })
      return isActive
    }
  }
}
</script>
<style scoped>
  .mx {
    margin-left: 5px;
    margin-right: 5px;
  }
  .main {
    display: flex;
    margin-top: 10px;
  }
  .field-label {
    font-size: 12px;
    font-weight: bold;
  }
  .field {
    font-size: 12px;
    font-weight: bold;
    text-align: center;
  }
  .field-not-center {
    font-size: 12px;
    font-weight: bold;
  }
  .p {
    font-size: 9px;
    text-align: justify;
    letter-spacing: 0.1em;
  }
  .p-1 {
    font-size: 9px;
  }
  .caption-2 {
    font-size: 7px;
    font-weight: bold;
    border-top: 1px solid;
    text-align: center;
  }
  .caption-2-no-border {
    font-size: 7px;
    font-weight: bold;
    text-align: center;
  }
</style>
