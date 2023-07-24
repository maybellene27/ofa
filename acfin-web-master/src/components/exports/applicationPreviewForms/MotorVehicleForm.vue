<template>
  <div>
    <div
      class="main"
    >
      <div
        class="field-label"
        style="margin-right: 5px"
      >
        Unit/Model/Year:
      </div>
      <div
        style="width: 40%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && (`${data.model} / ${data.variant} / ${data.year}`) }}
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
        Selling Price:
      </div>
      <div
        style="width: 30%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          ₱{{ data && data.sellingPrice }}
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
        Amount Financed:
      </div>
      <div
        style="width: 30%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          ₱{{ data && data.amountFinance }}
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
        <div style="display: flex; margin-right: 10px">
          <div
            style="font-weight: bold; margin-right: 5px"
          >
            Downpayment
          </div> [<div
            v-if="data && data.downpayment"
            class="mx"
          >
            {{ data && data.downpayment }} %
          </div>]
        </div>
      </div>
      <div
        style="width: 30%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.downpayment || 'n/a' }}
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
        Term:
      </div>
      <div
        style="width: 40%; margin-right: 10px"
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
                12
              </div> [<div
                v-if="data && data.term === '12'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                18
              </div> [<div
                v-if="data && data.term === '18'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                24
              </div> [<div
                v-if="data && data.term === '24'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                36
              </div> [<div
                v-if="data && data.term === '36'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                48
              </div> [<div
                v-if="data && data.term === '48'"
                class="mx"
              >
                *
              </div>]
            </div>
            <div style="display: flex; margin-right: 10px">
              <div
                style="font-weight: normal; margin-right: 5px"
              >
                60
              </div> [<div
                v-if="data && data.term === '60'"
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
        Sales Executive:
      </div>
      <div
        style="width: 25%; margin-right: 10px"
      >
        <div
          class="field-not-center"
        >
          {{ data && data.salesExecutive }}
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
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
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
