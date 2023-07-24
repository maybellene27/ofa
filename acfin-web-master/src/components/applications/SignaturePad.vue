<template>
  <v-container>
    <v-row>
      <v-dialog
        :id="id"
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-col
            class="d-flex justify-start"
          >
            <v-btn
              color="primary"
              outlined
              v-bind="attrs"
              v-on="on"
              @click="open()"
            >
              {{ buttonTitle }}
            </v-btn>
          </v-col>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Draw Signature</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <VueSignaturePad
                    id="signature"
                    ref="signaturePad"
                    width="500px"
                    height="500px"
                    :options="{ onBegin, onEnd }"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="clear()"
            >
              Clear
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="save()"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  props: {
    fileName: {
      type: String,
      default: ''
    },
    buttonTitle: {
      type: String,
      default: 'Signature'
    },
    id: {
      type: String,
      default: 'signature'
    }
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    undo () {
      this.$refs.signaturePad.undoSignature()
    },
    dataURLtoBlob (dataurl) {
      const byteString = atob(dataurl.split(',')[1])
      const mimeString = dataurl.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      return new Blob([ab], { type: mimeString })
    },
    save () {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature()
      if (!isEmpty) {
        const blob = this.dataURLtoBlob(data)
        const file = new File([blob], this.fileName, { type: blob.type })
        this.$emit('saveSignature', file)
        this.dialog = false
      }
    },
    clear () {
      this.$refs.signaturePad.clearSignature()
    },
    onBegin () {
      this.$refs.signaturePad.resizeCanvas()
    },
    onEnd () {
      this.$refs.signaturePad.resizeCanvas()
    },
    open () {
    }
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
</style>
