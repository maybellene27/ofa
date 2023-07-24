<template>
  <div>
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
          style="width: 30%; margin-right: 10px"
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
                  Employment
                </div> [<div
                  v-if="applicant && applicant.type === 'Employment'"
                  class="mx"
                >
                  *
                </div>]
              </div>
              <div style="display: flex; margin-right: 10px">
                <div
                  style="font-weight: normal; margin-right: 5px"
                >
                  Business
                </div> [<div
                  v-if="applicant && applicant.type === 'Business'"
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
          Emp / Bus Name:
        </div>
        <div
          style="width: 40%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ applicant && applicant.name || 'n/a' }}
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
          Address:
        </div>
        <div
          style="width: 90%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ applicant && applicant.address || 'n/a' }}
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
          Position:
        </div>
        <div
          style="width:20%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ applicant && applicant.position || 'n/a' }}
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
          style="width:15%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ applicant && applicant.telephone || 'n/a' }}
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
          Yrs.:
        </div>
        <div
          style="width:10%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ applicant && applicant.years || 'n/a' }}
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
          Monthly Income:
        </div>
        <div
          style="width:15%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ applicant && applicant.monthlyIncome || 'n/a' }}
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
      v-for="(content, index) in spouse"
      :key="index"
    >
      <div
        class="main"
      >
        <div
          class="field-label"
          style="margin-right: 5px"
        >
          Spouse/Co-Maker {{ index+1 }}:
        </div>
        <div
          style="width: 30%; margin-right: 10px"
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
                  Employment
                </div> [<div
                  v-if="content.type === 'Employment'"
                  class="mx"
                >
                  *
                </div>]
              </div>
              <div style="display: flex; margin-right: 10px">
                <div
                  style="font-weight: normal; margin-right: 5px"
                >
                  Business
                </div> [<div
                  v-if="content.type === 'Business'"
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
          Emp / Bus Name:
        </div>
        <div
          style="width: 30%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ content.name || 'n/a' }}
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
          Address:
        </div>
        <div
          style="width: 90%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ content.address || 'n/a' }}
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
          Position:
        </div>
        <div
          style="width:20%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ content.position || 'n/a' }}
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
          style="width:15%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ content.telephone || 'n/a' }}
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
          Yrs.:
        </div>
        <div
          style="width:10%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ content.years || 'n/a' }}
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
          Monthly Income:
        </div>
        <div
          style="width:15%; margin-right: 10px"
        >
          <div
            class="field-not-center"
          >
            {{ content.monthlyIncome || 'n/a' }}
          </div>
          <div
            class="caption-2"
          >
            &nbsp;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  props: {
    applicant: {
      type: Object,
      default: () => {}
    },
    spouse: {
      type: Array,
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
