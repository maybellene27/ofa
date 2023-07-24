<template>
  <div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Name:
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
        style="margin-right: 5px"
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
        style="width: 12%; margin-right: 10px"
      >
        <div
          class="field"
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
        style="width: 10%; margin-right: 10px"
      >
        <div
          class="field"
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
        style="width: 10%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.mobile || 'n/a' }}
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
        Email Address:
      </div>
      <div
        style="width: 27%; margin-right: 10px"
      >
        <div
          class="field"
        >
          {{ data && data.email || 'n/a' }}
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
