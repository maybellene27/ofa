import Vue from 'vue'
import YTDTurnAroundtimeTable from '@/components/exports/exportTables/YTDTurnAroundTimeTable'
import YTDApplicationStatus from '@/components/exports/exportTables/YTDApplicationStatus'
import YTDBankStatus from '@/components/exports/exportTables/YTDBankStatus'

Vue.component('ytdTurnaroundTime', YTDTurnAroundtimeTable)
Vue.component('ytdApplicationStatus', YTDApplicationStatus)
Vue.component('ytdBankStatus', YTDBankStatus)
