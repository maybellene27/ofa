<template>
  <div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Applicant:
      </div>
      <div
        style="width: 18%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.lastName || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          Last Name
        </div>
      </div>
      <div
        style="width: 18%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.firstName || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          First Name
        </div>
      </div>
      <div
        style="width: 18%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.middleName || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          Middle Name
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px;"
      >
        Age:
      </div>
      <div
        style="width: 5%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.age || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Birthday:
      </div>
      <div
        style="width: 18%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.birthday ? toLongDate(data.birthday) : 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px;"
      >
        TIN:
      </div>
      <div
        style="width: 23%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.tin || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Tel. No.:
      </div>
      <div
        style="width: 25%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.telephone || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Mobile No.:
      </div>
      <div
        style="width: 25%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.mobile || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Email Address:
      </div>
      <div
        style="width: 40%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.email || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Citizenship:
      </div>
      <div
        style="width: 32%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.citizenship || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Marital Status:
      </div>
      <div
        style="width: 50%; margin-right: 10px"
      >
        <div
          class="field"
        >
          <div
            style="display: flex; white-space: nowrap;"
          >
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Single
              </div> [<div
                v-if="data && data.maritalStatus.status === 'Single'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Married
              </div> [<div
                v-if="data && data.maritalStatus.status === 'Married'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Separated
              </div> [<div
                v-if="data && data.maritalStatus.status === 'Separated'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Widow/er
              </div> [<div
                v-if="data && data.maritalStatus.status === 'Widow/er'"
                class="mx"
              >
                *
              </div>]
            </div>
          </div>
        </div>
        <div
          class="caption-2-no-border"
        >
          &nbsp;
        </div>
      </div>
      <div
        v-if="data && data.maritalStatus.status === 'Separated'"
        class="field-label"
        style="margin-right: 5px"
      >
        Type of Separation:
      </div>
      <div
        style="width: 17%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.maritalStatus.typeOfSeparation }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
    <!-- <div
      class="main"
    >
    </div> -->
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Present Address:
      </div>
      <div
        style="width: 55%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ (data && data.presentAddress && data.presentAddress.name) || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Length of Stay:
      </div>
      <div
        style="width: 10%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ (data && data.presentAddress && data.presentAddress.lengthOfStay) || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Ownership:
      </div>
      <div
        style="width: 50%; margin-right: 10px"
      >
        <div
          class="field"
        >
          <div
            style="display: flex; white-space: nowrap;"
          >
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Owned
              </div> [<div
                v-if="data && data.presentAddress && data.presentAddress.ownership === 'Owned'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Mortgage
              </div> [<div
                v-if="data && data.presentAddress && data.presentAddress.ownership === 'Mortgage'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Rented
              </div> [<div
                v-if="data && data.presentAddress && data.presentAddress.ownership === 'Rented'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                Used Free
              </div> [<div
                v-if="data && data.presentAddress && data.presentAddress.ownership === 'Used Free'"
                class="mx"
              >
                *
              </div>]
            </div>
          </div>
        </div>
        <div
          class="caption-2-no-border"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        No. of Dependents:
      </div>
      <div
        style="width: 20%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ (data && data.presentAddress && data.presentAddress.noOfDependents) || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Permanent Address:
      </div>
      <div
        style="width: 55%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ (data && data.previousAddress && data.previousAddress.name) || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Length of Stay:
      </div>
      <div
        style="width: 10%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ (data && data.previousAddress && data.previousAddress.lengthOfStay) || 'n/a' }}
        </div>
        <div
          class="caption-2"
        >
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { toDateString } from '@/utils/helpers'

export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    toLongDate (date) {
      return toDateString(date)
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
