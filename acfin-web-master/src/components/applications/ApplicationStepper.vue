<template>
  <v-container>
    <v-row>
      <v-col>
        <custom-toolbar
          :operation="operation"
          :editable="editable"
          :crud-form-methods="crudFormMethods"
          :cancel-btn="{
            redirectRoute: () => {
              if (editable && operation !== 'create') {
                crudFormMethods.readOnly = true
                crudFormMethods.cancelled = true
                crudFormMethods.view()
              } else {
                $router.push({
                  name: $s.userType === 'Internal' ? 'ApplicationTable' : $s.userRole.includes('bankApprover') ? 'BankApproverApplicationTable' : 'ApplicantApplicationTable'
                })
              }
            }
          }"
          :edit-btn="{
            editBtnColor: 'primary',
            saveBtnColor: 'primary',
            saveLabel: status === 'submitted' ? 'Save Changes' : 'Save as Draft',
            hide: !['draft','submitted'].includes(status) || !getPrivilege('canPostApplication')
          }"
          :create-btn="{
            label: 'Save as Draft',
            color: 'primary',
            action: () => {
              $store.dispatch('showDialog', {
                title: 'Save as draft application',
                message: 'This will save the specific application as draft.',
                buttonLabel: 'Save',
                buttonColor: 'primary',
                callback: () => {
                  crudFormMethods.save()
                }
              })
            },
            hide: !getPrivilege('canPostApplication')
          }"
          :delete-btn="{
            hide: true
          }"
        >
          <template v-slot:additionalButtons>
            <v-btn
              v-if="!editable"
              id="previewBtn"
              class="px-5 ml-5 previewBtn"
              color="grey"
              :loading="previewLoading || crudFormMethods.loading"
              @click="generatePDF"
            >
              <v-icon
                class="pr-2"
              >
                mdi-clipboard-file-outline
              </v-icon>
              <span>Preview</span>
            </v-btn>
            <div
              v-if="bankEditButtonShow && getPrivilege('canPostApplication')"
              class="pl-5"
            >
              <v-btn
                v-if="!editable"
                id="editSubmitBtn"
                color="primary"
                class="px-10"
                :loading="crudFormMethods.loading"
                @click="() => {
                  crudFormMethods.readOnly = false
                  crudFormMethods.cancelled = false
                }"
              >
                <v-icon
                  class="pr-2"
                >
                  mdi-pencil
                </v-icon>
                <span>Edit</span>
              </v-btn>
              <v-btn
                v-if="editable && getPrivilege('canPostApplication')"
                id="editSubmitSaveBtn"
                class="px-10"
                color="primary"
                :loading="crudFormMethods.loading"
                @click="bankId ? submitApplication('bank') : submitApplication()"
              >
                <v-icon
                  class="pr-2"
                >
                  mdi-pencil
                </v-icon>
                <span>Submit</span>
              </v-btn>
            </div>
            <v-btn
              v-if="getPrivilege('canPostApplication') && (operation === 'create' || status === 'draft' || status === 'recommendExpired')"
              id="submitBtn"
              color="success"
              class="px-5 ml-5"
              :loading="crudFormMethods.loading"
              @click="bankId ? submitApplication('bank') : submitApplication()"
            >
              <v-icon
                class="pr-2"
              >
                mdi-plus-circle-outline
              </v-icon>
              <span>{{ status === 'recommendExpired' ? 'Re-submit Application' : 'Submit' }}</span>
            </v-btn>
            <v-btn
              v-if="operation === 'view' && status === 'draft' && getPrivilege('canPostApplication')"
              id="deleteBtn"
              color="error"
              class="px-5 ml-5"
              :loading="crudFormMethods.loading"
              outlined
              @click="() => {
                crudFormMethods.checkDelete(() => {
                  $router.push({
                    name: $s.userType === 'Internal' ? 'ApplicationTable' : 'ApplicantApplicationTable'
                  })
                })
              }"
            >
              <v-icon
                class="pr-2"
              >
                mdi-delete
              </v-icon>
              <span>Delete</span>
            </v-btn>
            <!-- SM/SE Approval Buttons -->
            <v-btn
              v-if="bankStatus === 'Approved and Unreleased' && ($s.userRole.includes('salesManager') || $s.userRole.includes('superUser'))"
              id="transferApprovalBtn"
              color="blue darken-4"
              class="px-5 ml-5 white--text"
              :loading="crudFormMethods.loading"
              @click="transferApprovalDialog = true"
            >
              <v-icon
                class="pr-2"
              >
                mdi-plus-circle-outline
              </v-icon>
              <span>Transfer of Approval</span>
            </v-btn>
            <v-btn
              v-if="status === 'submitted' && getPrivilege('canRecommendApplication') && showLabel('canRecommendApplication')"
              id="recommendBtn"
              color="blue"
              class="px-5 ml-5"
              :loading="crudFormMethods.loading"
              @click="() => {
                setStatus('recommend')
              }"
            >
              <v-icon
                class="pr-2"
                color="white"
              >
                mdi-thumb-up
              </v-icon>
              <span class="white--text">{{ getLabel('canRecommendApplication', 'Recommend') }}</span>
            </v-btn>
            <v-btn
              v-if="status === 'submitted' && getPrivilege('canReturnApplication') && showLabel('canReturnApplication')"
              id="returnBtn"
              color="blue darken-4"
              class="px-5 ml-5"
              :loading="crudFormMethods.loading"
              @click="returnDialog = true"
            >
              <v-icon
                class="pr-2"
                color="white"
              >
                mdi-restore
              </v-icon>
              <span class="white--text">{{ getLabel('canRejectApplication', 'Return') }}</span>
            </v-btn>
          </template>
        </custom-toolbar>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
    >
      <v-col>
        <v-card>
          <v-system-bar
            color="light-blue darken-2"
            lights-out
            dark
          />
          <v-row
            justify="center"
          >
            <v-col
              cols="12"
              md="4"
              sm="4"
              align="center"
            >
              <v-card-title>
                <div
                  class="d-flex justify-center light-blue--text text--darken-4 font-weight-bold"
                >
                  Auto Loan Application For Individual And Single Proprietorship
                </div>
              </v-card-title>
            </v-col>
          </v-row>
          <v-spacer />
          <v-row
            class="mx-5 mt-0 pt-0"
          >
            <v-col
              class="mt-0 pt-0"
            >
              <div>
                Application Status:
                <span
                  class="blue--text font-weight-bold text-capitalize ml-2"
                >
                  <v-icon
                    v-if="status === 'recommended'"
                    color="blue"
                    class="mr-4"
                  >
                    mdi-thumb-up
                  </v-icon>
                  <span>{{ displayApplicationStatus(status) }}</span>
                </span>
                <v-btn
                  v-if="status === 'unreleased' && bankStatus === 'Approved and Unreleased' && getPrivilege('canApproveApplication')"
                  class="mx-5"
                  dense
                  color="success"
                  :loading="crudFormMethods.loading"
                  @click="updateStatusDialog = true"
                >
                  Update Status
                </v-btn>
              </div>
              <div
                v-if="cancellationLetter"
              >
                <b>
                  <v-icon left>
                    mdi-paperclip
                  </v-icon>
                  Cancellation Letter:
                </b>
                <span>
                  <v-chip
                    color="blue darken-4"
                    class="ml-3"
                    :style="{'color':'white'}"
                    @click="() => {
                      download(`attachment/application/${this.$route.params.id}`, cancellationLetter)
                    }"
                  >
                    <span>Cancellation Letter</span>
                    <v-icon right>
                      mdi-download
                    </v-icon>
                  </v-chip>
                </span>
              </div>
            </v-col>
            <v-col
              v-if="status === 'approved'"
              class="mt-0 pt-0"
            >
              <div
                class="d-flex justify-content-around"
              >
                <v-card
                  :loading="crudFormMethods.loading"
                  class="pa-5 mx-2"
                >
                  <p>Date of Approved and Unreleased:</p>
                  <span
                    class="blue--text font-weight-bold text-capitalize ml-2"
                  >
                    {{ toLongDate(unreleasedDate) }}
                  </span>
                </v-card>
                <v-card
                  :loading="crudFormMethods.loading"
                  class="pa-5 mx-2"
                >
                  <p>Date of Approved and Released:</p>
                  <span
                    class="blue--text font-weight-bold text-capitalize ml-2"
                  >
                    {{ toLongDate(dateReleased) }}
                  </span>
                </v-card>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="status === 'approved'"
            class="mx-5"
          >
            <v-col>
              <div>
                Date Invoiced:
                <span
                  class="grey--text font-weight-bold text-capitalize ml-7"
                >
                  {{ toLongDate(monthInvoice) }}
                </span>
              </div>
            </v-col>
            <v-col>
              <div>
                Bank:
                <span
                  class="grey--text font-weight-bold text-capitalize ml-7"
                >
                  {{ selectedBankName }}
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="status === 'approved'"
            class="mx-5"
          >
            <v-col>
              <div>
                Month Submitted:
                <span
                  class="grey--text font-weight-bold text-capitalize ml-7"
                >
                  {{ monthSubmitted }}
                </span>
              </div>
            </v-col>
          </v-row>
          <v-row
            class="mx-4 mt-0 pt-0"
          >
            <v-col
              class="d-flex justify-end mt-0 pt-0"
            >
              <div
                v-if="status !== 'draft'"
                class="d-flex"
              >
                <application-aging
                  v-model="recommendAge"
                  type="Recommend"
                />
                <application-aging
                  v-model="approvalAge"
                  type="Approve"
                />
                <application-aging
                  v-model="releaseAge"
                  type="Release"
                />
              </div>
            </v-col>
          </v-row>
          <v-row
            v-if="status === 'returned'"
            class="mx-5"
          >
            <v-col>
              <div
                class="mb-4"
              >
                (<span class="red--text">
                  *
                </span>) Required Documents
              </div>
              <div
                v-for="(x, index) in Object.keys(requiredDocumentsLookup())"
                :key="index"
              >
                {{ `${index + 1}. ${requiredDocumentsLookup()[x]}` }}
              </div>
              <div
                class="mt-4"
              >
                Remarks: {{ returnReason }}
              </div>
            </v-col>
          </v-row>
          <!-- Bank Status -->
          <v-row
            v-if="['unreleased', 'approved', 'recommended', 'transferred', 'cancelled', 'rejected'].includes(status)"
            class="ma-10"
          >
            <v-col>
              <v-card
                outlined
                style="border-color: orange"
                class="pt-10"
              >
                <v-card-text>
                  <v-row>
                    <v-col>
                      <v-row>
                        <v-col>
                          <span
                            class="font-weight-bold"
                          >
                            Banks
                            <v-btn
                              v-if="bankId"
                              color="grey"
                              class="white--text ml-4"
                              @click="viewOriginalForm()"
                            >
                              <v-icon>
                                mdi-eye
                              </v-icon>
                              View Original Form
                            </v-btn>
                          </span>
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="!$s.userRole.includes('bankApprover')"
                      >
                        <v-col>
                          <v-select
                            id="bankApplications"
                            v-model="bank"
                            :items="filteredBankApplication"
                            label="Banks"
                            item-text="bankName"
                            item-value="_id"
                            :loading="crudFormMethods.loading"
                            :outlined="true"
                            @change="displayBankStatus()"
                          />
                        </v-col>
                      </v-row>
                      <v-row
                        v-else
                      >
                        <div>
                          <b class="ml-5 blue--text">{{ bankName }}</b>
                        </div>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col>
                          <span
                            class="font-weight-bold"
                          >
                            Bank Status
                          </span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col>
                          <v-chip
                            v-if="bankStatus"
                            :color="bankChipColor"
                            dark
                            class="px-10 py-5"
                          >
                            {{ displayBankApplicationStatus(bankStatus) }}
                          </v-chip>
                        </v-col>
                      </v-row>
                      <v-row
                        v-if="bankStatus === 'Declined' && !$s.userRole.includes('customer')"
                        class="mt-0"
                      >
                        <v-col>
                          <div>*Remarks: {{ declineReasonDisplay }}</div>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="bankStatus === 'Returned'"
                    class="mx-5"
                  >
                    <v-col>
                      <div
                        class="mb-4"
                      >
                        (<span class="red--text">
                          *
                        </span>) Required Documents
                      </div>
                      <div
                        v-for="(x, index) in Object.keys(requiredDocumentsLookup())"
                        :key="index"
                      >
                        {{ `${index + 1}. ${requiredDocumentsLookup()[x]}` }}
                      </div>
                      <div
                        class="mt-4"
                      >
                        Remarks: {{ bankReturnReason }}
                      </div>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="($s.userRole.includes('customer') || $s.userRole.includes('superUser')) && (bankStatus === 'Expired' || bankStatus === 'Release Expired')"
                  >
                    <v-col
                      class="d-flex justify-end"
                    >
                      <v-btn
                        id="resubmitButton"
                        color="success"
                        class="px-5 ml-5"
                        :loading="crudFormMethods.loading"
                        @click="bankId ? submitApplication('bank') : submitApplication()"
                      >
                        <v-icon
                          class="pr-2"
                        >
                          mdi-plus-circle-outline
                        </v-icon>
                        <span>Re-submit Application</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <!-- Bank Status Buttons -->
                  <v-row
                    v-if="bankId && bankStatus === 'Approved and Unreleased' && getPrivilege('canSendMail')"
                  >
                    <v-col
                      class="d-flex justify-end"
                    >
                      <v-btn
                        id="sendMailBtn"
                        color="blue"
                        tile
                        :loading="crudFormMethods.loading"
                        class="px-5 ml-2 white--text"
                        @click="sendMail()"
                      >
                        <v-icon
                          class="mr-2"
                        >
                          mdi-email
                        </v-icon>
                        Send Mail
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="($s.userRole.includes('bankApprover') || $s.userRole.includes('superUser')) && bankStatus === 'Pending Approval'"
                  >
                    <v-col
                      class="d-flex justify-end"
                    >
                      <v-btn
                        id="bankDeclineBtn"
                        color="red darken-4"
                        tile
                        :loading="crudFormMethods.loading"
                        class="px-5 ml-2"
                        @click="() => {
                          declineDialog = true
                        }"
                      >
                        <v-icon
                          class="pr-2"
                          color="white"
                        >
                          mdi-thumb-down
                        </v-icon>
                        <span class="white--text">Decline</span>
                      </v-btn>
                      <v-btn
                        id="approvedBtn"
                        color="success"
                        class="px-5 ml-2"
                        :loading="crudFormMethods.loading"
                        tile
                        @click="() => {
                          bankApproverSetStatus('bankApprove')
                        }"
                      >
                        <v-icon
                          class="pr-2"
                          color="white"
                        >
                          mdi-thumb-up
                        </v-icon>
                        <span class="white--text">Approved</span>
                      </v-btn>
                      <v-btn
                        v-if="bankStatus !== 'Returned'"
                        id="bankReturnBtn"
                        color="blue darken-4"
                        class="px-5 ml-2"
                        tile
                        :loading="crudFormMethods.loading"
                        @click="() => {
                          returnDialog = true
                        }"
                      >
                        <v-icon
                          class="pr-2"
                          color="white"
                        >
                          mdi-thumb-up
                        </v-icon>
                        <span class="white--text">Return</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row
                    v-if="$s.userRole.includes('salesManager') || $s.userRole.includes('salesExecutive') || $s.userRole.includes('superUser')"
                  >
                    <v-col>
                      <v-btn
                        v-if="bankStatus === 'Approved and Unreleased' && status === 'recommended'"
                        id="approvedBtn"
                        color="success"
                        class="px-5 ml-2"
                        tile
                        :loading="crudFormMethods.loading"
                        @click="() => {
                          setStatus('unreleased')
                        }"
                      >
                        <v-icon
                          class="pr-2"
                          color="white"
                        >
                          mdi-thumb-up
                        </v-icon>
                        <span class="white--text">Select Bank</span>
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <choice-update-status
            v-model="choiceStatusDialog"
            :crud-form-methods="crudFormMethods"
            :bank="bankName"
            :condition="choice"
          />
          <update-status-dialog
            v-model="updateStatusDialog"
            @choice="getChoice"
          />
          <return-dialog
            v-model="returnDialog"
            :crud-form-methods="crudFormMethods"
          />
          <transfer-approval
            v-model="transferApprovalDialog"
            :crud-form-methods="crudFormMethods"
          />
          <decline-dialog
            v-model="declineDialog"
            :crud-form-methods="crudFormMethods"
            :reason-value="declineReason"
            :action="(reason) => {
              declineReason = reason
              bankApproverSetStatus('bankReject')
            }"
          />
          <v-spacer />
          <v-container
            class="mx-0 px-0"
            fluid
          >
            <v-stepper
              v-model="stepperModel"
              flat
              class="elevation-0"
            >
              <v-stepper-header>
                <v-stepper-step
                  :editable="true"
                  step="1"
                  @click="changeStepper('1')"
                >
                  Applicant and Spouse / Co-maker
                </v-stepper-step>
                <v-divider />
                <v-stepper-step
                  :editable="true"
                  step="2"
                  @click="changeStepper('2')"
                >
                  Employment
                </v-stepper-step>
                <v-divider />
                <v-stepper-step
                  :editable="true"
                  step="3"
                  @click="changeStepper('3')"
                >
                  Motor Vehicle To Be Purchased
                </v-stepper-step>
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content
                  step="1"
                >
                  <ApplicantsForm
                    ref="aF"
                    :editable="editable && editableByCustomer"
                    :operation="operation"
                  />
                </v-stepper-content>
                <v-stepper-content
                  step="2"
                >
                  <EmploymentForm
                    ref="eF"
                    :editable="editable && editableByCustomer"
                    :operation="operation"
                  />
                </v-stepper-content>
                <v-stepper-content
                  step="3"
                >
                  <PurchasedVehicleForm
                    ref="pVF"
                    :editable="editable"
                    :operation="operation"
                  />
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-container>
        </v-card>
        <br>
        <custom-toolbar
          :operation="operation"
          :editable="editable"
          :crud-form-methods="crudFormMethods"
          :cancel-btn="{
            onlyBackBtn: true,
            redirectRoute: () => {
              const nextStep = Number.parseInt(step) - 1
              stepperModel = nextStep
              changeStepper(nextStep)
            },
            hide: step == 1
          }"
          :edit-btn="{
            editBtnColor: 'primary',
            saveBtnColor: 'primary',
            saveLabel: 'Save as Draft',
            hide: status !== 'draft'
          }"
          :create-btn="{
            label: 'Save as Draft',
            color: 'primary',
            action: () => {
              $store.dispatch('showDialog', {
                title: 'Save as draft application',
                message: 'This will save the specific application as draft.',
                buttonLabel: 'Save',
                buttonColor: 'primary',
                callback: () => {
                  crudFormMethods.save()
                }
              })
            }
          }"
          :delete-btn="{
            hide: true
          }"
        >
          <template v-slot:additionalButtons>
            <v-btn
              v-if="!editable"
              id="previewBtn"
              class="px-5 ml-5 previewBtn"
              color="grey"
              :loading="previewLoading || crudFormMethods.loading"
              @click="generatePDF"
            >
              <v-icon
                class="pr-2"
              >
                mdi-clipboard-file-outline
              </v-icon>
              <span>Preview</span>
            </v-btn>
            <div
              v-if="bankEditButtonShow"
            >
              <v-btn
                v-if="!editable"
                id="editSubmitBtn"
                color="primary"
                class="px-10"
                :loading="crudFormMethods.loading"
                @click="() => {
                  crudFormMethods.readOnly = false
                  crudFormMethods.cancelled = false
                }"
              >
                <v-icon
                  class="pr-2"
                >
                  mdi-pencil
                </v-icon>
                <span>Edit</span>
              </v-btn>
              <v-btn
                v-if="editable"
                id="editSubmitSaveBtn"
                class="px-10"
                color="primary"
                :loading="crudFormMethods.loading"
                @click="bankId ? submitApplication('bank') : submitApplication()"
              >
                <v-icon
                  class="pr-2"
                >
                  mdi-pencil
                </v-icon>
                <span>Submit Application</span>
              </v-btn>
            </div>
            <v-btn
              v-if="(operation === 'create' || status === 'draft' || status === 'recommendExpired') && step == 3"
              id="submitBtn"
              color="success"
              class="px-5 ml-5"
              :loading="crudFormMethods.loading"
              @click="bankId ? submitApplication('bank') : submitApplication()"
            >
              <v-icon
                class="pr-2"
              >
                mdi-plus-circle-outline
              </v-icon>
              <span>{{ status === 'recommendExpired' ? 'Re-submit Application' : 'Submit Application' }}</span>
            </v-btn>
            <v-btn
              v-if="isLastStep"
              id="continueBtn"
              class="px-5 ml-5 white--text"
              color="blue darken-4"
              :loading="previewLoading || crudFormMethods.loading"
              @click="() => {
                const nextStep = Number.parseInt(step) + 1
                stepperModel = nextStep
                changeStepper(nextStep)
              }"
            >
              <span>Continue</span>
              <v-icon
                right
                class="pr-2"
              >
                mdi-arrow-right-bold
              </v-icon>
            </v-btn>
          </template>
        </custom-toolbar>
        <br>
        <div style="display: none;">
          <component
            :is="pdfContent"
            id="pdf-content"
            :pdf-data="pdfData"
            :bank-status="bankStatus"
            :bank="bankId"
          />
        </div>
      </v-col>
    </v-row>
    <div
      class="text-center"
    >
      <v-overlay :value="crudFormMethods.loading">
        <h3>Processing... Please do not refresh the page</h3>
        <v-progress-circular
          indeterminate
          size="64"
        />
      </v-overlay>
    </div>
  </v-container>
</template>

<script>
import ApplicantsForm from '@/components/applications/ApplicantsForm'
import EmploymentForm from '@/components/applications/EmploymentForm'
import ReturnDialog from '@/components/applications/ReturnDialog'
import CustomToolbar from '@/components/etc/CustomToolbar'
import PurchasedVehicleForm from '@/components/applications/PurchasedVehicleForm'
import { mapFields } from 'vuex-map-fields'
import { privilegeMixin } from 'session-plugin'
import { capitalize, toDateString } from '@/utils/helpers'
import TransferApproval from '@/components/applications/TransferApproval'
import ApplicationAging from '@/components/applications/ApplicationAging'
import DeclineDialog from '@/components/applications/DeclineDialog'
import UpdateStatusDialog from '@/components/applications/UpdateStatusDialog'
import ChoiceUpdateStatus from '@/components/applications/ChoiceUpdateStatus'
import crud from '../../rest/crud'
import exportPDFMixin from '../../mixins/exportPDFMixin'
import ApplicationFormTemplate from '../exports/ApplicationFormTemplate'
import ApplicationPreviewTemplate from '../exports/ApplicationPreviewTemplate'
import fileInputMixin from '@/mixins/fileInputMixin'

export default {
  name: 'ApplicationStepper',
  components: {
    ApplicantsForm,
    EmploymentForm,
    PurchasedVehicleForm,
    CustomToolbar,
    ReturnDialog,
    TransferApproval,
    DeclineDialog,
    UpdateStatusDialog,
    ChoiceUpdateStatus,
    ApplicationFormTemplate,
    ApplicationAging,
    ApplicationPreviewTemplate
  },
  mixins: [
    privilegeMixin,
    exportPDFMixin,
    fileInputMixin
  ],
  props: {
    operation: { type: String, default: undefined },
    editable: Boolean,
    crudFormMethods: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    stepperModel: 1,
    returnDialog: false,
    transferApprovalDialog: false,
    declineDialog: false,
    updateStatusDialog: false,
    choiceStatusDialog: false,
    choice: '',
    declineReason: '',
    pdfData: {},
    pdfContent: '',
    previewLoading: false,
    bankApplication: [],
    userRole: []
  }),
  computed: {
    bankEditButtonShow () {
      let show = false
      if (this.userRole.includes('customer') || this.userRole.includes('superUser')) {
        if (this.status === 'transferred' && this.bankStatus === 'Approved and Released') {
          show = true
        }
        if (this.bankStatus === 'Returned' || this.status === 'returned') {
          show = true
        }
      } else if ((this.userRole.includes('salesExecutive') || this.userRole.includes('salesManager')) && (this.bankStatus === 'Returned' || this.status === 'returned')) {
        show = true
      }
      return show
    },
    ...mapFields('application', {
      returnReason: 'returnReason',
      status: 'status',
      bank: 'bank',
      bankStatus: 'bankStatus',
      user: 'user',
      age: 'age',
      birthday: 'birthday',
      tin: 'tin',
      maritalStatus: 'maritalStatus',
      citizenship: 'citizenship',
      presentAddress: 'presentAddress',
      previousAddress: 'previousAddress',
      spouse: 'spouse',
      applicantEmployment: 'applicantEmployment',
      spouseEmployment: 'spouseEmployment',
      vehiclePurchased: 'vehiclePurchased',
      borrowerSignature: 'vehiclePurchased.borrowerSignature',
      bankName: 'bankName',
      monthInvoice: 'monthInvoice',
      monthSubmitted: 'monthSubmitted',
      cancelRemarks: 'cancelRemarks',
      selectedBank: 'selectedBank',
      recommendAge: 'recommendAge',
      approvalAge: 'approvalAge',
      releaseAge: 'releaseAge',
      consentClause: 'consentClause',
      type: 'vehiclePurchased.type',
      declineReasonDisplay: 'declineReason',
      bankReturnReason: 'bankReturnReason',
      unreleasedDate: 'unreleasedDate',
      dateReleased: 'dateReleased',
      selectedBankName: 'selectedBankName',
      cancellationLetter: 'cancellationLetter',
      bankList: 'vehiclePurchased.banks'
    }),
    ...mapFields('masterData', {
      exports: 'exports'
    }),
    ...mapFields('profile', {
      profileSuperBank: 'info.superUserBank'
    }),
    step () {
      return this.$route.params.step
    },
    id () {
      return this.$route.params.id
    },
    bankId () {
      return this.$route.params.bank
    },
    userView () {
      let view
      if (this.operation === 'create') {
        view = this.$s.userType === 'Internal' ? 'ApplicationCreate' : this.$s.userRole.includes('bankApprover') ? 'BankApproverApplicationCreate' : 'ApplicantApplicationCreate'
      } else {
        if (this.bankId) {
          view = this.$s.userRole.includes('customer') ? 'ApplicantApplicationViewBank' : 'ApplicationViewBank'
        } else {
          view = this.$s.userType === 'Internal' ? 'ApplicationView' : this.$s.userRole.includes('bankApprover') ? 'BankApproverApplicationView' : 'ApplicantApplicationView'
        }
      }
      return view
    },
    editableByCustomer () {
      let editable = false
      if (this.operation === 'create') {
        editable = true
      } else {
        if (this.$s.userRole.includes('customer') || this.$s.userRole.includes('superUser')) {
          editable = true
        }
      }
      return editable
    },
    isSalesExecutive () {
      return this.$s.userRole && this.$s.userRole.length && this.$s.userRole.includes('salesExecutive')
    },
    isAdmin () {
      return this.$s.userRole && this.$s.userRole.length && this.$s.userRole.includes('admin')
    },
    filteredBankApplication () {
      return this.bankApplication && this.bankApplication.filter((bank) => {
        if (this.$s.userRole.includes('superUser')) {
          if (this.profileSuperBank.includes(bank.financePartnerID)) {
            return bank
          }
        } else {
          return bank
        }
      })
    },
    bankChipColor () {
      let color
      if (this.bankStatus === 'Rejected') {
        color = 'error'
      } else if (this.bankStatus === 'Pending Approval') {
        color = 'orange'
      } else if (this.bankStatus === 'Returned') {
        color = 'blue'
      } else if (this.bankStatus === 'Expired') {
        color = 'brown'
      } else if (this.bankStatus === 'Release Expired') {
        color = 'brown darken-4'
      }
      return color
    },
    isLastStep () {
      return Number.parseInt(this.step) !== 3 && this.stepperModel !== 3
    },
    previewBottom () {
      return Number.parseInt(this.step) === 3
    },
    isCancelledApproval () {
      return this.bankStatus === 'Cancelled' && this.status === 'cancelled'
    }
  },
  async created () {
    await this.$s.ready
    this.userRole = this.$s.userRole
    if (this.bankId) {
      this.bank = this.bankId
    }
    if (this.operation === 'create') {
      this.status = 'draft'
    } else if (this.operation === 'view') {
      this.crudFormMethods.loading = true
      await this.crudFormMethods.view()
      this.bankApplication = await this.fetchBankApplications()
      if (this.status === 'recommended' && !this.$s.userRole.includes('bankApprover') && this.getPrivilege('canRecommendApplication')) {
        if (this.bankApplication.length !== this.bankList.length) {
          const deleteBAResponse = await this.crudFormMethods.api('deleteRecommend').update('')
          const dataDeleteResponse = await deleteBAResponse.json()
          this.$store.dispatch('showAlert', {
            message: dataDeleteResponse.message,
            type: 'error'
          })
          await this.crudFormMethods.view()
        }
      }
      if (!this.bankId && this.status === 'approved' && !this.$s.userRole.includes('bankApprover')) {
        await this.$router.push({
          name: this.$s.userType === 'External' && !this.$s.userRole.includes('bankApprover') ? 'ApplicantApplicationViewBank' : 'ApplicationViewBank',
          params: {
            bank: this.selectedBank
          }
        })
        this.bank = this.selectedBank
        await this.crudFormMethods.view()
      }
      this.crudFormMethods.loading = false
    }
    this.stepperModel = this.step
  },
  methods: {
    async fetchBankApplications () {
      const queries = { application: this.id }
      const data = await crud('bankApplication').list({ queries })
      return data.entries
    },
    async sendMail () {
      this.$store.dispatch('showDialog', {
        title: 'Send email?',
        message: 'This will send an email to this customer',
        buttonLabel: 'Send mail',
        buttonColor: 'green',
        callback: async () => {
          this.crudFormMethods.loading = true
          const resp = await this.crudFormMethods.api('sendMail').update('', { bankApplication: this.bankId })
          if (resp.ok) {
            this.$store.dispatch('showAlert', {
              message: 'Email sent successfully',
              type: 'success'
            })
          } else {
            this.$store.dispatch('showAlert', {
              message: 'Send email failed',
              type: 'error'
            })
          }
          this.crudFormMethods.loading = false
        }
      })
    },
    async viewOriginalForm () {
      this.crudFormMethods.loading = true
      await this.$router.push({
        name: this.$s.userRole.includes('customer') || this.$s.userRole.includes('finance') ? 'ApplicantApplicationView' : 'ApplicationView',
        params: {
          id: this.id
        }
      })
      this.$store.dispatch('application/reset')
      await this.crudFormMethods.view()
      this.crudFormMethods.loading = false
    },
    toLongDate (date) {
      return toDateString(date)
    },
    requiredDocumentsLookup () {
      const type = {
        'Local Based': 'local',
        'OFW Land Based': 'ofwLandBased',
        'OFW Sea Based': 'ofwSeaBased'
      }
      const dict = {
        local: {
          coe: 'COE with compensation details issued not more than 1 month + authorization letter to verify',
          payslip: 'Copy of latest 3 months payslips',
          itr: 'Copy of latest income tax return (Form 2316)'
        },
        ofwLandBased: {
          coe: 'Latest contract / COE with compensation details',
          payslip: 'Copy of Latest 3 months Payslips',
          remittance: 'Proof of remittance and latest 3 months bank statement of remittance account + authorization letter to verify'
        },
        ofwSeaBased: {
          coe: 'Latest contract / COE with compensation details + authorization letter to verify',
          payslip: 'Copy of latest 3 months payslip',
          allotment: 'Proof of allotment and bank statement of remittance account + authorization letter to verify',
          tip: 'Tipping Position (ex: F&B and Hotel Operation)',
          voucher: 'Voucher or three (3) months latest bank statements reflecting commision / Tipping income'
        }
      }
      const result = {}
      const doc = this.vehiclePurchased[`${type[this.type]}`]
      Object.keys(doc).forEach((x) => {
        if (doc[x].required === true) {
          result[x] = dict[type[this.type]][x]
        }
      })
      return result
    },
    async displayBankStatus () {
      await this.$router.push({
        name: this.$s.userRole.includes('customer') || this.$s.userRole.includes('finance') ? 'ApplicantApplicationViewBank' : 'ApplicationViewBank',
        params: {
          step: this.step,
          operation: 'view',
          id: this.id,
          bank: this.bank
        }
      })
      await this.crudFormMethods.view()
    },
    changeStepper (step) {
      if (this.step !== step) {
        this.$router.push({
          name: this.userView,
          params: {
            step
          }
        })
      }
    },
    displayBankApplicationStatus (status) {
      const dict = {
        Returned: 'Pending Document',
        Expired: 'Behind 30 days',
        'Release Expired': 'Behind 30 days'
      }
      return dict[`${status}`] || status
    },
    displayApplicationStatus (status) {
      const dict = {
        recommended: 'Recommended for submission to banks',
        draft: 'Draft',
        submitted: 'Submitted',
        returned: 'Pending Document',
        approved: 'Approved and Release',
        rejected: 'Rejected',
        unreleased: 'Approved and Unreleased',
        transferred: 'Approved and Unreleased',
        cancelled: 'Cancelled Approval',
        recommendExpired: 'Recommend Expired'

      }
      return dict[`${status}`]
    },
    submitApplication (type = '') {
      const vm = this.crudFormMethods
      if (this.consentClause) {
        vm.$refs.aS.$refs.aF.$v.$touch()
        vm.$refs.aS.$refs.aF.$refs.presentAddressRef.$v.$touch()
        vm.$refs.aS.$refs.aF.$refs.previousAddressRef.$v.$touch()
        vm.$refs.aS.$refs.eF.$refs.applicantEmploymentRef.$v.$touch()
        vm.$refs.aS.$refs.eF.$refs.spouseEmploymentRef.$v.$touch()
        vm.$refs.aS.$refs.pVF.$v.$touch()
        const isInvalid = {
          applicantCheck: vm.$refs.aS.$refs.aF.$v.$invalid,
          presentAddressCheck: vm.$refs.aS.$refs.aF.$refs.presentAddressRef.$v.$invalid,
          previousAddressCheck: vm.$refs.aS.$refs.aF.$refs.previousAddressRef.$v.$invalid,
          applicantEmploymentCheck: vm.$refs.aS.$refs.eF.$refs.applicantEmploymentRef.$v.$invalid,
          spouseEmploymentCheck: vm.$refs.aS.$refs.eF.$refs.spouseEmploymentRef.$v.$invalid,
          vehiclePurchasedCheck: vm.$refs.aS.$refs.pVF.$v.$invalid
        }
        const isAllValid = Object.keys(isInvalid).every((key) => {
          return isInvalid[key] === false
        })
        if (isAllValid) {
          this.$store.dispatch('showDialog', {
            title: 'Submit application?',
            message: 'This will submit the specific application',
            buttonLabel: 'Submit',
            buttonColor: 'green',
            callback: async () => {
              if (type === 'bank') {
                this.status = 'recommend'
                vm.opts.schema.bankStatus = 'Pending Approval'
                if (this.approvalAge === 30 || this.approvalAge === '30') {
                  vm.opts.schema.approvalAge = 0
                }
                if (this.releaseAge === 30 || this.releaseAge === '30') {
                  vm.opts.schema.releaseAge = 0
                }
                await this.saveItem({
                  method: 'update',
                  url: 'update',
                  id: this.bankId,
                  successFunction: (success, data) => {
                    if (success) {
                      this.$store.dispatch('showAlert', {
                        message: data.message,
                        type: 'success'
                      })
                      vm.readOnly = true
                      vm.view()
                    } else {
                      this.$store.dispatch('showAlert', {
                        message: data.error,
                        type: 'error'
                      })
                    }
                  }
                })
                vm.loading = false
              } else {
                vm.loading = true
                vm.opts.schema.status = 'submitted'
                if (this.recommendAge === 30 || this.recommendAge === '30') {
                  vm.opts.schema.recommendAge = 0
                }
                const payloadResp = this.operation === 'create' ? await vm.api('create').create(vm.opts.schema) : await vm.api('update').update(this.id, vm.opts.schema)
                const payloadJson = await payloadResp.json()
                if (payloadResp.ok && vm.formParams) {
                  const listOfFormParams = Object.keys(vm.opts.formParams.fields)
                  for (const keyIndex in listOfFormParams) {
                    const key = listOfFormParams[keyIndex]
                    const dataForm = await vm.fileUploadForm(key)
                    if (Array.isArray(dataForm.getAll(key))) {
                      dataForm.getAll(key).every((file) => file.size > 0) && await vm.api('createForm').createForm(dataForm, vm.formParams.query, this.id || payloadJson.entry._id, key)
                    } else {
                      dataForm.get(key).size > 0 && await vm.api('createForm').createForm(dataForm, vm.formParams.query, this.id || payloadJson.entry._id, key)
                    }
                  }
                  const sendSubmitResponse = await this.crudFormMethods.api('submitSendMail').update(`${this.operation === 'create' ? payloadJson.entry._id : this.id}/submitSendMail`)
                  const dataSendResponse = await sendSubmitResponse.json()
                  this.$store.dispatch('showAlert', {
                    message: dataSendResponse.message,
                    type: 'success'
                  })
                }
                if (this.operation === 'create') {
                  this.$router.push({
                    name: this.userRole.includes('customer') ? 'ApplicantApplicationView' : 'ApplicationView',
                    params: {
                      operation: 'view',
                      id: payloadJson.entry._id
                    }
                  })
                } else {
                  vm.view()
                }
                vm.readOnly = true
                vm.loading = false
              }
            }
          })
        }
      } else {
        this.$store.dispatch('showAlert', {
          message: 'You must agree with consent clause first before submitting',
          type: 'error'
        })
      }
    },
    async saveItem ({ action, method, url, id, successFunction, callback }) {
      const vm = this.crudFormMethods
      vm.loading = true
      let payloadResp
      vm.cancelled = false
      if (method === 'post') {
        payloadResp = await vm.api(url).create(vm.opts.schema)
      } else {
        payloadResp = await vm.api(url).update(id, vm.opts.schema)
      }
      const payloadJson = await payloadResp.json()
      if (payloadResp.ok && vm.formParams) {
        const listOfFormParams = Object.keys(vm.opts.formParams.fields)
        for (const keyIndex in listOfFormParams) {
          const key = listOfFormParams[keyIndex]
          const dataForm = await vm.fileUploadForm(key)
          if (Array.isArray(dataForm.getAll(key))) {
            dataForm.getAll(key).every((file) => file.size > 0) && await vm.api('createForm').createForm(dataForm, vm.formParams.query, id, key)
          } else {
            dataForm.get(key).size > 0 && await vm.api('createForm').createForm(dataForm, vm.formParams.query, id, key)
          }
        }
      }
      successFunction && successFunction(payloadResp.ok, payloadJson)
      payloadResp.ok && callback && await callback((payloadJson.entry || payloadJson.updatedResult || payloadJson.userData)._id)
    },
    async rollbackRecommend () {
      await this.crudFormMethods.view()
      if (this.status === 'recommended' && !this.$s.userRole.includes('bankApprover') && this.getPrivilege('canRecommendApplication')) {
        if (this.bankApplication.length !== this.bankList.length) {
          const deleteBAResponse = await this.crudFormMethods.api('deleteRecommend').update('')
          const dataDeleteResponse = await deleteBAResponse.json()
          this.$store.dispatch('showAlert', {
            message: dataDeleteResponse.message,
            type: 'error'
          })
          await this.crudFormMethods.view()
        } else {
          const sendBAResponse = await this.crudFormMethods.api('recommendSendMail').update('')
          const dataSendResponse = await sendBAResponse.json()
          this.$store.dispatch('showAlert', {
            message: dataSendResponse.message,
            type: 'success'
          })
          await this.crudFormMethods.view()
        }
      }
    },
    async createBankApplication (payLoadJson) {
      const vm = this.crudFormMethods
      for (const bankId of this.vehiclePurchased.banks) {
        vm.opts.schema.bank = bankId
        vm.opts.schema.application = this.id
        vm.opts.schema.status = 'recommended'
        vm.opts.schema.recommendDate = payLoadJson.entry.recommendDate
        await this.saveItem({
          action: 'create',
          method: 'post',
          url: 'bankApplication'
        })
        await this.$store.dispatch('masterData/initOpts', { mds: ['bankApplication'] })
        await this.crudFormMethods.view()
      }
    },
    async setStatus (status) {
      const capitalizedStatus = capitalize(status)
      const statusDict = {
        recommend: 'recommended',
        approve: 'approved',
        reject: 'rejected',
        unreleased: 'unreleased'
      }
      this.$store.dispatch('showDialog', {
        title: `${capitalizedStatus} application?`,
        message: `This will ${status} the specific application.`,
        buttonLabel: capitalizedStatus,
        callback: async () => {
          const vm = this.crudFormMethods
          vm.loading = true
          const resp = status === 'unreleased' ? await vm.api(status).update('', { bankApplication: this.bankId }) : await vm.api(status).update('', { status: statusDict[status] })
          const payLoadJson = await resp.json()
          if (resp.ok) {
            if (status === 'recommend') {
              if (this.vehiclePurchased.banks && this.vehiclePurchased.banks.length) {
                await this.createBankApplication(payLoadJson)
              }
            } else if (status === 'unreleased') {
              vm.opts.schema.status = 'unreleased'
              await this.saveItem({
                method: 'update',
                url: 'application',
                id: this.id
              })
            }
            this.bankApplication = await this.fetchBankApplications()
            await vm.view()
            await this.rollbackRecommend()
            const message = payLoadJson.message
            vm.$store.dispatch('showAlert', {
              message,
              type: 'success'
            })
          } else {
            const error = payLoadJson.error
            vm.$store.dispatch('showAlert', {
              message: error,
              type: 'error'
            })
          }
          vm.loading = false
        }
      })
    },
    async bankApproverSetStatus (status) {
      const statusDict = {
        bankApprove: 'approved',
        bankReject: 'rejected',
        bankReturn: 'returned'
      }
      const capitalizedStatus = capitalize(statusDict[status])
      this.$store.dispatch('showDialog', {
        title: `${capitalizedStatus} application?`,
        message: `This will ${statusDict[status]} the specific application.`,
        buttonLabel: capitalizedStatus,
        callback: async () => {
          const vm = this.crudFormMethods
          vm.loading = true
          const resp = status === 'bankReject' ? await vm.api(status).update('', { declineReason: this.declineReason }) : await vm.api(status).update()
          if (resp.ok) {
            const message = (await resp.json()).message
            vm.$store.dispatch('showAlert', {
              message,
              type: 'success'
            })
            vm.view()
          } else {
            const error = (await resp.json()).error
            vm.$store.dispatch('showAlert', {
              message: error,
              type: 'error'
            })
          }
          this.declineDialog = false
          vm.loading = false
        }
      })
    },
    async generateExportData () {
      const url = this.bankStatus ? 'export/bankApplication' : 'export/application'
      const id = this.bankId ? this.bankId : this.id
      const response = await crud(url).exportPDF(id, {
        reportType: 'application'
      })
      return response
    },
    setPDFTemplate () {
      this.pdfContent = 'ApplicationPreviewTemplate'
      this.element = document.getElementById('pdf-content')
      return this.element
    },
    async generatePDF () {
      this.previewLoading = true
      window.scroll(0, 0)
      this.element = null
      this.pdfData = await this.generateExportData()
      this.pdfData = { ...this.pdfData }

      this.pdfContent = 'ApplicationPreviewTemplate'
      const element = this.setPDFTemplate()
      if (element === null) {
        setTimeout(async () => {
          await this.generatePDF()
        }, 1000)
      } else {
        setTimeout(async () => {
          await this.savePDF(element, 'application')
          this.previewLoading = false
        }, 1000)
        this.pdfContent = null
        this.exportSuccess = true
      }
    },
    async getChoice (event) {
      this.choice = event
      this.updateStatusDialog = false
      this.choiceStatusDialog = true
    }
  }
}
</script>

<style scoped>
.continueBtn {
  background-color: #005C9F;
  color: #fff;
}

.previewBtn {
  color: #fff;
}
</style>
