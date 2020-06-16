import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
// import about from './views/About.vue'
// import personal from './views/personal.vue'

// import Report from './views/Report_query.vue'

// import table from './views/table.vue'

// import Indexx from './views/index.vue'

import _404 from './views/404.vue'

const Indexx = resolve => require(['./views/index.vue'], resolve);
const personal = resolve => require(['./views/personal.vue'], resolve);
const Report = resolve => require(['./views/Report_query.vue'], resolve);
const table = resolve => require(['./views/table.vue'], resolve);
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/Home',
      name: 'home',
      component: Home
    },
    {
      path: '/Index',
      name: 'Index',
      component: Indexx,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/personal',
      name: 'personal',
      component: personal
    },
    {
      path: '/Report',
      name: 'Report',
      component: Report,
      meta:{
        keepAlive:true
      }
    },
    {
      path: '/table',
      name: 'table',
      component: table
    },
    {
      path: '/Dindex',
      name:'Dindex',
      component: () => import('@/views/DoorControl/Dindex')
    },
    {
      path: '/DGoout',
      name:'DGoout',
      component: () => import('@/views/DoorControl/DGoout')
    },
    {
      path: '/DdoorAlarm',
      name:'DdoorAlarm',
      component: () => import('@/views/DoorControl/DdoorAlarm')
    },
    {
      path: '/Dbackdoor',
      name:'Dbackdoor',
      component: () => import('@/views/DoorControl/Dbackdoor')
    },
    {
      path: '/ConferencePeopleRecord',
      name:'ConferencePeopleRecord',
      component: () => import('@/views/Meeting/ConferencePeopleRecord')
    },
    {
      path: '/ConferencePeopleLateRecord',
      name:'ConferencePeopleLateRecord',
      component: () => import('@/views/Meeting/ConferencePeopleLateRecord')
    },
    {
      path: '/ConferencePeopleLeaveRecord',
      name:'ConferencePeopleLeaveRecord',
      component: () => import('@/views/Meeting/ConferencePeopleLeaveRecord')
    },
    {
      path: '/ConferencePeopleAbsenceRecord',
      name:'ConferencePeopleAbsenceRecord',
      component: () => import('@/views/Meeting/ConferencePeopleAbsenceRecord')
    },
    {
      path: '/RecentPOSTransactionRecord',
      name:'RecentPOSTransactionRecord',
      component: () => import('@/views/POSTransaction/RecentPOSTransactionRecord')
    },
    {
      path: '/POSTransactionRecord',
      name:'POSTransactionRecord',
      component: () => import('@/views/POSTransaction/POSTransactionRecord')
    },
    {
      path: '/POSReservation/index',
      name:'POSReservation',
      component: () => import('@/views/POSTransaction/POSReservation')
    },
    {
      path: '/Recharge',
      name:'Recharge',
      component: () => import('@/views/Card/Recharge')
    },
    {
      path: '/Cancellation',
      name:'Cancellation',
      component: () => import('@/views/Card/Cancellation')
    },
    {
      path: '/ChangeCard',
      name:'ChangeCard',
      component: () => import('@/views/Card/ChangeCard')
    },
    {
      path: '/Withdrawal',
      name:'Withdrawal',
      component: () => import('@/views/Card/Withdrawal')
    },
    {
      path: '/RecentWaterTransactionRecord',
      name:'RecentWaterTransactionRecord',
      component: () => import('@/views/WaterTransaction/RecentWaterTransactionRecord')
    },{
      path: '/WaterTransactionRecord',
      name:'WaterTransactionRecord',
      component: () => import('@/views/WaterTransaction/WaterTransactionRecord')
    },
    {
      path: '/clocking',
      name:'clocking',
      component: () => import('@/views/tables/clocking')
    },
    {
      path: '/clocking',
      name:'clocking',
      component: () => import('@/views/tables/clocking')
    },
    // 考勤
    {
      path: '/CheckinReport',
      name:'CheckinReport',
      component: () => import('@/views/CheckingIn/CheckinReport')
    },
    {
      path: '/overtimereport',
      name:'overtimereport',
      component: () => import('@/views/CheckingIn/overtimereport')
    },
    {
      path: '/Leavereport',
      name:'Leavereport',
      component: () => import('@/views/CheckingIn/Leavereport')
    },
    {
      path: '/ChangeShift',
      name:'ChangeShift',
      component: () => import('@/views/CheckingIn/ChangeShift')
    },
    {
      path: '/BusinessTrip',
      name:'BusinessTrip',
      component: () => import('@/views/CheckingIn/BusinessTrip')
    },
    {
      path: '/CheckingInEdit',
      name:'CheckingInEdit',
      component: () => import('@/views/CheckingIn/CheckingInEdit')
    },
    {
      path: '/DaysOff',
      name:'DaysOff',
      component: () => import('@/views/CheckingIn/DaysOff')
    },
    {
      path: '/Vis',
      name:'Vis',
      component: () => import('@/views/Vis')
    },
    {
      path: '/Lift',
      name:'Lift',
      component: () => import('@/views/Lift')
    },

    {
      path: '/QRCode',
      name:'QRCode',
      component: () => import('@/views/QRCode')
    },
    {
      path: '/Visitor',
      name:'Visitor',
      component: () => import('@/views/Visitor')
    },
    {
      path: '/POSControl',
      name:'POSControl',
      component: () => import('@/views/POSControl')
    },
    {
      path: '/visList',
      name:'visList',
      component: () => import('@/views/Visitor/visList.vue')
    },

    {
      path: '/DoorOperation',
      name:'DoorOperation',
      component: () => import('@/views/DoorOperation')
    },
    
    {
      path: '/paths',
      name:'paths',
      component: () => import('@/views/tables/paths')
    },
    { path: '*', path: '/404', component: _404},
    {
      path: "*", 
      redirect: "/404"
      }
  ],
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {
        x: 0,
        y: 0
      }
    }
  }
})
