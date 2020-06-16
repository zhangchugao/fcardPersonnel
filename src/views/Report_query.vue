<template>
<keep-alive>
  <div class="home">
      <Nav :showBack='TuiChu' :title="$t('table.报表查询')"></Nav>
      <div class="wrap">
        <Tabs tab-position="left" style="height: 200px;" class="tabs_box">
          <TabPane v-for="(fitem,index) in item_title" :key="index" :label="fitem.fitem,index">
            <mu-list :ripple="true" class="list_ul">
              <div v-for="(citem,index1) in fitem.citem" :key="index1">
                <mu-list-item button :to="{name: citem.path, query: { item: citem.name}}" @click="toTable">
                  <mu-list-item-title >{{citem.name}}</mu-list-item-title>
                </mu-list-item>
                <mu-divider v-if="index1!=fitem.citem.length-1"></mu-divider>
              </div>
            </mu-list>
          </TabPane>
          <!-- <TabPane label="用户管理">
            <mu-list :ripple="true" class="list_ul">
              <mu-list-item button>
                <mu-list-item-title>最近出门记录</mu-list-item-title>
              </mu-list-item>
              <mu-divider></mu-divider>
              <mu-list-item button>
                <mu-list-item-title>最近入门记录</mu-list-item-title>
              </mu-list-item>
              <mu-divider></mu-divider>
              <mu-list-item button>
                <mu-list-item-title>最近入门记录</mu-list-item-title>
              </mu-list-item>
              <mu-divider></mu-divider>
              <mu-list-item button>
                <mu-list-item-title>最近入门记录</mu-list-item-title>
              </mu-list-item>
              <mu-divider></mu-divider>
              <mu-list-item button>
                <mu-list-item-title>最近入门记录</mu-list-item-title>
              </mu-list-item>
              <mu-divider></mu-divider>
              <mu-list-item button>
                <mu-list-item-title>最近入门记录</mu-list-item-title>
              </mu-list-item>
              <mu-divider></mu-divider>
              <mu-list-item button>
                <mu-list-item-title>xxxxxxxxxxxx</mu-list-item-title>
              </mu-list-item>
            </mu-list>
          </TabPane>
          <TabPane label="配置管理">配置管理</TabPane>
          <TabPane label="角色管理">角色管理</TabPane>
          <TabPane label="定时任务补偿">定时任务补偿</TabPane> -->
        </Tabs>
      </div>
    </div>
</keep-alive>
  
</template>
<script>
import Nav from "@/components/nav_top";
import { Tabs, TabPane } from "element-ui"; //是真懒  不想写0.0
export default {
  components: {
    Nav,
    Tabs,
    TabPane
  },
  props: {},
  data() {
    return {
      item_title: [],
      TuiChu:true
    };
  },
  created(){
    let that=this;
    this.item_title=[
        {
          fitem: this.$t('Common.Doormember'),
          citem: [
            {name:this.$t('navbar.个人最近出入门记录'),path:'Dindex'},
            {name:this.$t('navbar.全部出门记录'),path:'DGoout'},
            {name:this.$t('navbar.全部进门记录'),path:'Dbackdoor'},
            // {name:this.$t('navbar.门禁报警记录'),path:'DdoorAlarm'},
            // {name:'个人最近出入门记录',path:'/Dindex'},
            // "个人最近出入门记录",
            // "全部出门记录",
            // "全部进门记录",
            // "门禁报警记录"
          ]
        },
        {
          fitem: this.$t('navbar.考勤记录'),
          citem:[
            {name:this.$t('navbar.考勤打卡报表') ,path:'CheckinReport'},
            {name:this.$t('navbar.考勤加班报表'),path:'overtimereport'},
            {name:this.$t('navbar.考勤请假报表'),path:'Leavereport'},
            {name:this.$t('navbar.考勤调班报表'),path:'ChangeShift'},
            {name:this.$t('navbar.考勤出差报表'),path:'BusinessTrip'},
            {name:this.$t('navbar.考勤调休报表'),path:'DaysOff'},
            {name:this.$t('navbar.考勤统计报表'),path:'CheckingInEdit'},
          ]
        },
        {
          fitem: this.$t('navbar.会议记录'),
          citem: [
            {name:this.$t('navbar.参会记录'),path:'ConferencePeopleRecord'},
            {name:this.$t('navbar.参会迟到'),path:'ConferencePeopleLateRecord'},
            {name:this.$t('navbar.请假记录'),path:'ConferencePeopleLeaveRecord'},
            {name:this.$t('navbar.缺席记录'),path:'ConferencePeopleAbsenceRecord'}
          ]
        },
        {
          fitem: this.$t('navbar.消费记录'),
          citem: [
            {name:this.$t('navbar.最近消费记录'),path:'RecentPOSTransactionRecord'},
            {name:this.$t('navbar.消费记录'),path:'POSTransactionRecord'},
            {name:this.$t('navbar.订餐记录'),path:'POSReservation'}
          ]
        },
        {
          fitem: this.$t('navbar.访客记录'),
          citem: [
            {name:this.$t('navbar.访客记录'),path:'Vis'}
          ]
        },
        {
          fitem: this.$t('navbar.电梯记录'),
          citem: [
            {name:this.$t('navbar.电梯记录'),path:'Lift'}
          ]
        },
        {
          fitem: this.$t('navbar.卡片记录'),
          citem: [
            {name:this.$t('navbar.充值记录'),path:'Recharge'},
            {name:this.$t('navbar.销户记录'),path:'Cancellation'},
            {name:this.$t('navbar.换卡记录'),path:'ChangeCard'},
            {name:this.$t('navbar.取款记录'),path:'Withdrawal'}
            // "充值记录",
            // "换卡记录",
            // "挂失记录",
            // "取款记录",
            // "销户记录"
          ]
        },
        {
          fitem: this.$t('navbar.水控机记录'),
          citem: [
            {name:this.$t('navbar.查询最近水控机消费记录'),path:'RecentWaterTransactionRecord'},
            {name:this.$t('navbar.水控机消费记录'),path:'WaterTransactionRecord'}
            // {name:'换卡记录',path:'ChangeCard'},
            // {name:'取款记录',path:'Withdrawal'}
            // "查询最近水控机消费记录",
            // "水控机消费记录",
          ]
        }
      ]
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
          wx.miniProgram.getEnv((res) => {
              if (res.miniprogram) {
                that.TuiChu=false
              } else {
                that.TuiChu=true
              }
          })
      }else{
          that.TuiChu=true
      }
  },
  
  methods:{
    toTable(){
      this.$store.state.transitionName='slide-left'
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
.wrap {
    margin: 0 0.2133rem;
    padding-top: 0.2133rem;
  height: calc(100% - 1.7067rem);
  box-sizing: border-box;
  .tabs_box {
    // margin-top: 0.2133rem;
    height: 100% !important;
  }
}
</style>

<style>
.wrap .tabs_box .el-tabs__header {
  width: 2.6667rem;
  height: auto;
}
.tabs_box .el-tabs__content {
  height: calc(100%);
  overflow-y: auto;
}
.wrap .tabs_box .el-tabs__header .el-tabs__nav > div.el-tabs__item {
  font-size: 0.423rem;
  padding: 0 0.2667rem;
  padding-left: 0;
}
.tabs_box .mu-list .mu-item {
  height: 0.96rem;
}
</style>
