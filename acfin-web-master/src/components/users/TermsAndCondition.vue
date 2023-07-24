<template>
  <v-container>
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        width="800px"
      >
        <v-card>
          <v-btn
            icon
            color="red"
            @click="dialog = false"
          >
            <v-icon>
              mdi-close
            </v-icon>
          </v-btn>
          <v-card-title
            class="d-flex justify-center mb-5 text-decoration-underline font-weight-bold"
          >
            <span class="text-h7"><b>Data Privacy Policy</b></span>
          </v-card-title>
          <!-- <v-divider /> -->
          <v-card-text
            class="my-5"
          >
            <v-row
              justify="center"
              align="center"
            >
              <v-img
                src="../../assets/ACMotorsLogo.png"
                max-height="250"
                max-width="250"
                class="mb-5"
              />
            </v-row>
            <v-row
              justify="center"
              class="mx-5"
            >
              <v-col
                cols="12"
                sm="12"
                md="12"
                align="justify"
              >
                <div class="pb-3">
                  <p>
                    The AC Motors companies listed below (collectively referred as “AC Motors”,
                    “we”, “us” or “our”) are committed to the security and protection of your personal
                    information. As such, we operate in compliance with applicable laws and regulations
                    on data protection and data security, such as Republic Act No. 10173, otherwise known
                    as the Data Privacy Act of 2012, its correspondence Implementing Rules and Procedures,
                    and the existing Memorandum Circulars and Advisories issued by the National Privacy
                    Commission. In doing so, we ensure that all personal data collected from our customers,
                    vendors, partners, employees, agents, and other stakeholders and processed by AC Motors
                    are protected at all times.
                  </p>
                </div>
                <div>
                  <h3>AC Motors Privacy Notice</h3>
                  <br>
                  <p>
                    <b><i>Personal Information</i></b>
                  </p>
                  <p>
                    Personal information (which may also be referred to in this Policy as “personal
                    data”) is information that can be used on its own or with other information to
                    identify, contact, or locate a single person, or to identify an individual in
                    context. This includes all information relating to an identified or identifiable
                    individual (natural person) including name, contact, details, address, email
                    address, gender, age, date of birth, and any information which is collected,
                    recorded, held, or stored by AC Motors.
                  </p>
                  <p>
                    We collect both electronics and physical data from the following sources:
                  </p>
                  <ul>
                    <li>
                      Directly from customers when they avail of any of our products and/or services.
                      We also collect such information when customers, among others, contact us through
                      our agents and representatives, and sign up to receive communications from us, respond
                      to our surveys, participate in our events, and/or receive queries, requests and complaints
                      from them; and indirectly through third-party sources such as social media sites, publicly
                      available databases and government repositories and/or from other customers.
                    </li>
                    <li>
                      We also obtain such information when customers visit
                      our website and social media profiles as well as when
                      they use our digital platforms and/or mobile applications.
                    </li>
                    <li>
                      When individuals representing or affiliated with our vendors, partners, investors and
                      other business contacts voluntarily provide us with their contact information in order
                      to develop business relations and/or complete legitimate transactions with them.
                    </li>
                    <li>
                      Directly from our employees and job applicants through their curriculum vitae,
                      personal information sheets, submitted medical records and government documents,
                      and interview and training assessment results conducted by authorized personnel,
                      and pre-employment health screening and indirectly from the verification efforts
                      of third-party employee background/screening service providers, job search sites
                      and/or other social media sites and references from previous employers and other
                      third parties.
                    </li>
                  </ul>
                </div>
                <br>
                <div class="pb-3">
                  <p>
                    <b><i>Purpose and Use</i></b>
                  </p>
                  <p>
                    We are entitled to process or use such data with your consent or on the basis of law.
                    By providing AC Motors with your personal information in the use of any of our products
                    and services as described in this Privacy Policy, you have explicitly authorized and consented
                    to our collection, use, access, transfer, storage and processing of said personal data.
                  </p>
                  <p>
                    In general, we use such data only for the purpose for which you divulged the
                    data to us, but not limited to:
                  </p>
                  <ol type="a">
                    <li>
                      Entering into transactions for the delivery of the necessary products and/or services in connection
                      with such transactions which are necessary for AC Motors business process execution, including delivery of notices,
                      services and/or products, partners, new product launches and events, planning purposes in connection with future products,
                      including promotional events with AC Motors business partners which may include third party service providers located
                      outside the Philippines;
                    </li>
                    <li>
                      Administering and/or managing your relationship and/or account(s) with AC Motors; and
                    </li>
                    <li>
                      Sending of marketing, advertising and promotional information about other products/services that AC Motors,
                      as well as business partners and related companies may be offering, and which AC Motors believes may be of interest
                      or benefit to you by way of postal mail, electronic transmission or through mobile or telephone line.
                    </li>
                  </ol>
                </div>
                <div class="pb-3">
                  <p>
                    In addition to the forgoing, the data collected from you may be used or
                    processed in any of the following instances:
                  </p>
                  <ul>
                    <li>
                      It is necessary for compliance with legal regulations on the part of AC Motors
                      and its subsidiaries, or mandated by governmental or judicial authorities;
                    </li>
                    <li>
                      It is necessary to protect vitally important interests, including life and health;
                    </li>
                    <li>
                      It is necessary to respond to national emergency, to comply with the requirements of public order and safety, or
                    </li>
                  </ul>
                  <br>
                  <p>
                    We may also collect, use, disclose or process information contained in employment applications
                    or other employment-related forms/documents submitted to us for administrative and management
                    purposes, including but not limited to: recruitment, assessment of the candidate’s suitability,
                    appraisal, performance, promotion, training, career development, remuneration, health and safety,
                    discipline, and/or review of human resource policies. Personal data or any other information contained
                    in employment applications shall be processed exclusively for legitimate purposes as specified above.
                  </p>
                </div>
                <div>
                  <p>
                    <b><i>Disclosure of Personal Data</i></b>
                  </p>
                  <p>
                    We generally do not disclose the personal data we process to third parties without the consent of data
                    subjects unless we are legally required to do so; if it is necessary to fulfill the purposes for which
                    we process personal data as mentioned above; or if such action is necessary to protect, defend and/or
                    enforce our rights, property or the personal safety of our employees and other individuals. It may be
                    necessary for AC Motors to disclose and transfer your personal data to third party companies, entities,
                    or service providers engaged by AC Motors to perform certain services on behalf of AC Motors, including the following:
                  </p>
                  <ul>
                    <li>Insurance providers;</li>
                    <li>Financial Institutions;</li>
                    <li>Government agencies (eg. Land Transportation Office);</li>
                    <li>External consultants and other professional advisors, such as auditors and legal firms;</li>
                    <li>Contractors or sub-contractors; and</li>
                    <li>Such other service provider that may be appointed by AC Motors</li>
                  </ul>
                </div>
                <br>
                <div class="pb-3">
                  <p>
                    <b><i>Protection Measures</i></b>
                  </p>
                  <p>
                    AC Motors shall exercise reasonable and appropriate administrative
                    and security measures and procedures to prevent unauthorized or unlawful
                    processing, and loss of or damage to, your personal data.
                  </p>
                  <p>
                    AC Motors shall implement reasonable and appropriate organizational, physical,
                    and technical measures intended for the protection of personal information or data
                    against any accidental or unlawful destruction, alteration and disclosure.
                    The employees, contractors, sub-contractors or representatives of AC Motors who are involved
                    in the processing of personal information or data shall hold personal information confidential,
                    especially if it is not intended for public disclosure.
                  </p>
                </div>
                <div class="pb-3">
                  <h3>THE RIGHTS OF DATA SUBJECT</h3><br>
                  <p>
                    AC Motors fully recognizes that under the Data Privacy Act,
                    our customers, employees vendors,partners, investors, shareholder and other
                    business contacts and employees, as data subjects, are accorded the following rights:
                  </p>
                  <ul>
                    <li>
                      <b>Right to be informed</b>
                      <p>
                        They have the right to demand and be informed of the details about the
                        type of personal data, the purpose of processing, and how they are being
                        processed by AC, including its sources, recipients, methods, disclosures to
                        third parties and their identities, automated processes, manner of storage,
                        period of retention, manner of disposal and any changes to such processing
                        activities before the same is undertaken.
                      </p>
                    </li>
                    <li>
                      <b>Right to access</b>
                      <p>
                        They have the right to have reasonable access to their personal data,
                        sensitive or otherwise, upon demand. They have the right to review and
                        amend their personal data processed by AC Motors in case there are errors.
                      </p>
                    </li>
                    <li>
                      <b>Right to dispute</b>
                      <p>
                        They have the right to dispute inaccuracy or error in personal data
                        processed by AC Motors.
                      </p>
                    </li>
                    <li>
                      <b>Right to object</b>
                      <p>
                        They have the right to reject further processing of their personal data,
                        including the right to suspend, withdraw, and remove their personal data
                        in possession of AC Motors which are falsely collected or unlawfully processed.
                      </p>
                    </li>
                  </ul>
                  <p>
                    Unfortunately, no data transmission over the Internet or any wireless network can be
                    guaranteed to be 100% secure. As a result, while we employ commercially reasonable security
                    measures to protect data and seek to partner with companies which do the same, we cannot
                    guarantee the security of any information transmitted to or from our websites, and are not
                    responsible for the actions of any third parties that may receive any such information.
                  </p>
                </div>
                <div class="pb-3">
                  <p>
                    <b><i>Website Cookies</i></b>
                  </p>
                  <p>
                    AC Motors websites may store some information on your computer in the form of a “cookie”.
                    Cookies are used by many web sites to give visitors access to certain functions.
                    The information stored in the cookie can also be used to monitor a user’s behavior on the web site.
                    There are two types of cookies: the first saves a file for an extended period on your
                    computer and is used to determine whether there has been any contact between us and your computer in the past.
                    The second type is called a “session cookie”, and is stored temporarily in your computer’s memory
                    while you are visiting the site. Session cookies are not stored in your browser for an extended period,
                    but are deleted when you close your browser. AC Motors uses cookies to gather visitor statistics and to
                    record information about your preferences as you navigate through the web sites. In this way, we hope to be
                    able to better target relevant information to our visitors. Unless particularly stated elsewhere,
                    cookies are never used by AC Motors with the aim to gather personal data. If you do not accept the AC Motors
                    use of cookies on our web site, it is possible for you to configure your browser to reject cookies by modifying
                    your browser settings. However, this means that we cannot guarantee that all functions of our web site will function as intended.
                  </p>
                </div>
                <div class="pb-3">
                  <p>
                    <b><i>Amendment to the Privacy Policy</i></b>
                  </p>
                  <p>
                    AC Motors reserves the right to modify this Policy at any time to comply with any
                    future developments in local and/or foreign data privacy regulations where applicable
                    and to reflect any changes in the organization’s policies and/or personal data processing
                    activities, so please review it frequently. The most updated version of the Policy shall
                    apply and supersede all previous versions of the Policy.
                  </p>
                </div>
                <div class="pb-3">
                  <p>
                    <b><i>Amendment to the Privacy Policy</i></b>
                  </p>
                  <p>
                    AC Motors will respond to reasonable requests to review your personal data collected
                    by us and to correct, amend or delete any inaccuracies. If you any questions or comments
                    about the AC Motors Data Privacy Policy, please send us an email at <a
                      href="https://dpacmotors@acmotors.com.ph"
                      class="blue--text text-decoration-underline"
                    >dpacmotors@acmotors.com.ph</a>
                  </p>
                </div>
                <div class="pb-3">
                  <p>
                    <b><i>Automotive Companies</i></b>
                  </p>
                  <ol>
                    <li>Honda Cars Makati, Inc: (HCMI)</li>
                    <li>Honda Cars Cebu, Inc (HCCI)</li>
                    <li>Isuzu Automotive Dealership, Inc (IADI)</li>
                    <li>Isuzu Cebu, Inc. (ICI)</li>
                    <li>Isuzu Iloilo Corporation (IIC)</li>
                    <li>Automotive Central Enterprise, Inc. (ACEI)</li>
                    <li>Iconic Dealership, Inc (IDI)</li>
                    <li>Adventures Cycle Philippines, Inc. (ACPI)</li>
                    <li>KTM Asia Motorcycle Manufacturing, Inc. (KAMMI)</li>
                    <li>KP Motors Corporation (KPMC)</li>
                    <li>AC Automotive Business Services, Inc. (AABSI)</li>
                  </ol>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'TermsAndCondition',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    dialog: {
      get () {
        return this.value
      },
      set (obj) {
        this.$emit('input', obj)
      }
    }
  }
}
</script>

<style scoped>

</style>
