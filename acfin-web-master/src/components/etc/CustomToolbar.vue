<template>
  <v-row
    v-bind="props"
  >
    <v-col
      v-if="!cancelBtn.hide"
    >
      <v-btn
        v-if="cancelBtn.onlyBackBtn"
        :id="'onlyBackBtn'"
        outlined
        color="grey"
        class="px-12"
        :loading="crudFormMethods.loading"
        @click="cancelButton(cancelBtn.redirectRoute)"
      >
        Back
      </v-btn>
      <v-btn
        v-else
        :id="operation !== 'create' && editable ? 'cancelBtn' : 'backBtn'"
        outlined
        :color="operation !== 'create' && editable ? 'error' : 'grey'"
        class="px-12"
        :loading="crudFormMethods.loading"
        @click="cancelButton(cancelBtn.redirectRoute)"
      >
        {{ operation !== 'create' && editable ? 'Cancel' : 'Back' }}
      </v-btn>
    </v-col>
    <v-col
      class="d-flex justify-end"
    >
      <div
        v-if="operation !== 'create' && !editBtn.hide"
      >
        <v-btn
          v-if="!editable"
          id="editBtn"
          :color="editBtn.editBtnColor"
          class="px-10"
          :loading="crudFormMethods.loading"
          @click="edit"
        >
          <v-icon
            class="pr-2"
          >
            mdi-pencil
          </v-icon>
          <span>{{ editBtn.editLabel || 'Edit' }}</span>
        </v-btn>
        <v-btn
          v-if="editable && (operation !== 'create')"
          id="saveBtn"
          :color="editBtn.saveBtnColor"
          class="px-10"
          :loading="crudFormMethods.loading"
          @click="editBtn.action ? editBtn.action() : crudFormMethods.save(editBtn.redirectRoute)"
        >
          <v-icon
            class="pr-2"
          >
            mdi-pencil
          </v-icon>
          <span>{{ editBtn.saveLabel || 'Save' }}</span>
        </v-btn>
      </div>
      <div
        v-if="operation !== 'create' && !deleteBtn.hide"
        class="ml-2"
      >
        <v-btn
          v-if="!editable && (operation !== 'create') && operation"
          id="deleteBtn"
          :color="deleteBtn.color"
          class="px-5"
          :loading="crudFormMethods.loading"
          outlined
          @click="deleteBtn.action ? deleteBtn.action() : crudFormMethods.checkDelete(deleteBtn.redirectRoute)"
        >
          <v-icon
            class="pr-2"
          >
            mdi-delete
          </v-icon>
          <span>{{ deleteBtn.label || 'Delete' }}</span>
        </v-btn>
      </div>
      <div
        v-if="operation === 'create' && !createBtn.hide"
        class="ml-2"
      >
        <v-btn
          id="createBtn"
          :color="createBtn.color"
          class="px-5"
          :loading="crudFormMethods.loading"
          @click="createBtn.action ? createBtn.action() : crudFormMethods.confirmDialog({
            title: createBtn.title,
            message: createBtn.message,
            callback: () => crudFormMethods.save(createBtn.redirectRoute),
            showDialog: createBtn.showDialog
          })"
        >
          <v-icon
            class="pr-2"
          >
            mdi-plus-circle-outline
          </v-icon>
          <span>{{ createBtn.label || 'Create' }}</span>
        </v-btn>
      </div>
      <slot name="additionalButtons" />
    </v-col>
  </v-row>
</template>

<script>
import { privilegeMixin } from 'session-plugin'

export default {
  name: 'CustomToolbar',
  mixins: [
    privilegeMixin
  ],
  props: {
    operation: {
      type: String,
      default: ''
    },
    editable: {
      type: Boolean,
      default: false
    },
    crudFormMethods: {
      type: Object,
      default: () => {}
    },
    props: {
      type: Object,
      default: () => {}
    },
    createBtn: {
      type: Object,
      default: () => {
        return {
          hide: false
        }
      }
    },
    editBtn: {
      type: Object,
      default: () => {
        return {
          hide: false
        }
      }
    },
    deleteBtn: {
      type: Object,
      default: () => {
        return {
          hide: false
        }
      }
    },
    cancelBtn: {
      type: Object,
      default: () => {
        return {
          hide: false
        }
      }
    }
  },
  methods: {
    edit () {
      this.crudFormMethods.readOnly = false
      this.crudFormMethods.cancelled = false
    },
    cancelButton (callback) {
      if (this.operation === 'create' && !callback) {
        this.$router.go(-1)
      } else if (callback) {
        callback()
      } else {
        if (this.editable) {
          this.crudFormMethods.readOnly = true
          this.crudFormMethods.cancelled = true
          this.crudFormMethods.view()
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>
