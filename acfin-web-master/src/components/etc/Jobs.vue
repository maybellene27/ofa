<template>
  <div class="text-center">
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      :nudge-width="400"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          icon
          v-on="on"
        >
          <v-icon>mdi-speedometer</v-icon>
        </v-btn>
      </template>

      <v-card :loading="loading">
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon>mdi-briefcase</v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>Jobs</v-list-item-title>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                icon
                color="green"
                @click="fetch"
              >
                <v-icon>mdi-cached</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider />

        <v-list>
          <v-list-item>
            <v-list>
              <v-list-item
                v-for="item in jobs"
                :key="item.name"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="`${item.action}-${item.module}-${item.startDate}`" />
                </v-list-item-content>

                <v-list-item-avatar>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-if="item.status === 'completed'"
                        color="success"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-briefcase-check
                      </v-icon>
                    </template>
                    <span>Completed</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-if="item.status === 'completed with errors'"
                        color="orange"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-alert
                      </v-icon>
                    </template>
                    <span> {{ generateMessage(item.result) }} </span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-if="item.status === 'running' || item.status === 'pending'"
                        color="warning"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-clock
                      </v-icon>
                    </template>
                    <span>Pending</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-if="item.status === 'error'"
                        color="error"
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-close-circle
                      </v-icon>
                    </template>
                    <span>{{ item.message }}</span>
                  </v-tooltip>
                </v-list-item-avatar>
              </v-list-item>
            </v-list>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer />

          <v-btn
            text
            @click="menu = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="clear"
          >
            Clear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import master from '@/utils/webapi/master'
import preprocess from '@/utils/process/preprocess'

export default {
  data: () => ({
    tab: 'jobs',
    menu: false,
    jobs: [],
    loading: false
  }),
  watch: {
    async menu (val) {
      if (val) {
        this.fetch()
      }
    }
  },
  methods: {
    async fetch () {
      this.loading = true
      const req = {
        tab: this.tab,
        page: 1,
        itemsPerPage: 5,
        customQuery: { username: this.$s.username }
      }
      const query = preprocess.query(req)
      const resp = await master.list(query, this.tab)
      const data = await resp.json()

      if (resp.ok) {
        this.jobs = data.entries
      }
      this.loading = false
    },
    async clear () {
      this.loading = true
      const reduced = this.jobs.reduce((filtered, job) => {
        if (job.status !== 'pending') {
          filtered.push(job._id)
        }
        return filtered
      }, [])
      const promises = reduced.map(async (id) => {
        const resp = await master.delete(this.tab, id)
        return resp
      })
      await Promise.all(promises)
      this.fetch()
      this.loading = false
    },
    generateMessage (result) {
      const message = result.reduce((filtered, item) => {
        if (item.error) {
          filtered += `<li>${item.error}</li>`
        }
        return filtered
      }, [])
      return message || 'Success.'
    }
  }
}
</script>
