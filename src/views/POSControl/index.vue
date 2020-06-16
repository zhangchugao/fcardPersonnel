<template>
  <div class="home">
    <Nav icon="" @openDialog="openD" :title="$t('navbar.选择订餐时段')"></Nav>
    <div class="wrap" ref="loadmore" style="height: calc(100% - 100px)">
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all='loadedAll'>
          <Table
            :data="MIMIList"
            border
            @selection-change="MIMIListSelectChange"
            size="mini"
            ref="table_data"
            style="width:100%"
            @row-click="rowClick">
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <table-column :label="$t('navbar.名称')" prop="MName"></table-column>
            <table-column :label="$t('navbar.订餐时间')">
              <template slot-scope="scope">
                {{(parseInt(scope.row.BeginTime / 60)+'').padStart(2,0)+':'+((scope.row.BeginTime % 60)+'').padStart(2,0) }} 
                -  
                {{(parseInt(scope.row.EndTime / 60)+'').padStart(2,0)+':'+(((scope.row.EndTime) % 60)+'').padStart(2,0) }}
              </template>  
            </table-column>
            <table-column :label="$t('navbar.可提前')">
                <template slot-scope="scope">
                    {{ scope.row.AdvanceDay }} 天
                </template>
            </table-column>
            </Table>
      </mu-load-more>
    </div>
    <mu-button color="primary" @click="$router.push({'path': 'POSReservation/index?item=订餐记录'})" style="margin-right: 1em">{{$t('POS.POSOrdering')}}</mu-button>
    <mu-button color="primary" @click="nextStep">{{$t('Vis.Next_step')}}</mu-button>
    <!-- 订餐列表 -->
    <mu-dialog width="360" transition="slide-right" fullscreen :open.sync="openSync">
        <mu-appbar color="primary" :title="$t('POS.POSOrdering')">
            <mu-button slot="left" icon @click="closeFullscreenDialog">
                <mu-icon value="arrow_back"></mu-icon>
            </mu-button>
        </mu-appbar>
        <div style="padding: 24px;">
            <Table
            :data="MIMIList"
            border
            @selection-change="MIMIListSelectChange"
            size="mini"
            ref="table_data"
            style="width:100%">
              <el-table-column type="selection" width="40" align="center"></el-table-column>
              <table-column :label="$t('Common.PName')" prop="MName"></table-column>
              <table-column :label="$t('Common.CardData')" prop="tiem"></table-column>
              <table-column :label="$t('navbar.就餐日期时间')">
                  <template slot-scope="scope">
                      {{ scope.row.AdvanceDay }}
                  </template>
              </table-column>
            </Table>
        </div>
    </mu-dialog>
    <!-- 订餐详细信息 -->
    <mu-dialog width="360" transition="slide-right" fullscreen :open.sync="openSyncInfo">
        <mu-appbar color="primary" :title="$t('navbar.订餐详情')">
            <mu-button slot="left" icon @click="openSyncInfo=false">
                <mu-icon value="arrow_back"></mu-icon>
            </mu-button>
        </mu-appbar>
       <mu-form ref="form" :model="form" label-width="80">
          <mu-form-item label-position="right" :label="$t('navbar.订餐餐段')+':'">
            <mu-select label="" v-model="form.FixedFeeRuleID" full-width>
              <mu-option v-for="(option,index) in BoodingList" :key="index" :label="option.RuleName" :value="option.FixedFeeRuleID"></mu-option>
            </mu-select>
          </mu-form-item>
         <mu-form-item label-position="right" :label="$t('POS.Order_date')+':'">
             <mu-date-input v-model="form.ReservationDate" label-float full-width container='bottomSheet' :min-date="new Date()"></mu-date-input>
          </mu-form-item>
        <mu-form-item label-position="right" :label="$t('Common.Remark')+':'">
            <mu-text-field multi-line :rows="3" :rows-max="6" v-model="form.Remark"></mu-text-field>
        </mu-form-item>
       </mu-form>
       <mu-button color="primary" @click="Book" style="bottom: 0; transform: translateX(-50%);left: 50%;">{{$t('route.Ordering')}}</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
import Nav from "@/components/nav_top_menu";
import { Table, TableColumn } from "element-ui";
import { Information, ConferencePeopleAbsenceRecord, PeosonalPosGetAllPeople, DepartmentGetDepartmentList, PeosonalPosGetPOSMealTime, PeosonalPosGetFixedFeeRule, PeosonalPosReservationInsert } from "@/api/getdata";
import { parseTime } from '@/utils/index'
import moment from 'moment'
export default {
  components: {
    Nav,
    Table,
    TableColumn
  },
  data() {
    return {
      open: false,
      openSyncInfo: false,
      BoodingList: [],
      refreshing: false,
      loading: false,
      openSimple: false,
      list: [],
      MIMIList: [],
      rowdata: "",
      MIMIselections: [],
      searchitem:{
        PName: '',
        DeptName: '',
        PCode: '',
      },
      form: {
          ReservationDate: '',
          FixedFeeRuleID: '',
          Remark: '',
          MTimeID: ''
      },
      pagesize: 30,
      pageindex: 1,
      loadedAll:false,
      DeptObj: {},
      selections: [],
      openSync: false,
      pID: ""
    };
  },
  created() {
    Information().then(res => {
      this.pID = res.RetData.pID
    })
  },
  mounted() {
    // this.getdata();
    this.bookking()
  },
  methods: {
    openD() {
      //打开侧边
      this.open = true;
    },
    handleSortChange() {
      console.log(data);
    },
    rowClick(data) {
      this.$refs.table_data.clearSelection()
      this.$refs.table_data.toggleRowSelection(data, true)
    },
    getdata() {
      let that = this;
      PeosonalPosGetAllPeople({ PageIndex: this.pageindex, PageSize: this.pagesize })
        .then(res => {
          that.list = [...that.list, ...res.RetData];
        })
        .catch(err => {
         
        });
    },
    searchdata(){
      let that = this;
      let param={
          ...this.searchitem
      }
      if (param.PName !== '') {
        param.PName_oper = 'like';
      }
      if (param.DeptName !== '') {
        param.DeptName_oper = 'like';
      }
      if (param.PCode !== '') {
        param.PCode_oper = 'like';
      }
      for (let v in param) {
        if (param[v] === '') {
            delete param[v]
        }
      }
      PeosonalPosGetAllPeople({ PageIndex: this.pageindex, PageSize: this.pagesize,...param})
        .then(res => {
          that.list=[]
          that.list = [...that.list, ...res.RetData];
        })
        .catch(err => {
         
        });
    },
    refresh() {
      this.refreshing = true;
      this.$refs.table_data.scrollTop = 0;
      this.pageindex=1;
      setTimeout(() => {
        this.refreshing = false;
        this.loadedAll=false;
        this.list = [];
        this.getdata();
      }, 2000);
    },
    load() {
      this.loading = true;
      this.pageindex++;
      let a = this.$refs.loadmore.scrollTop;
      this.$refs.loadmore.scrollTop = a;
      let that = this;
      PeosonalPosGetAllPeople({ PageIndex: this.pageindex, PageSize: this.pagesize })
        .then(res => {
          that.list = [...that.list, ...res.RetData];
          setTimeout(() => {
            that.$refs.loadmore.scrollTop = a;
          },800);
          setTimeout(() => {
            that.loading = false;
            that.loading = false;
             if(res.RetData.Data.length==0){
              that.loadedAll=true;
              that.$toast.config({
                position: 'bottom'
              })
              that.$toast.warning(that.$t('navbar.没有更多数据了'))
            }
          }, 1000);
        })
        .catch(err => {
          // alert(err)
          that.loading = false;
        });
    },
    closeFullscreenDialog() {
        this.openSync = false
    },
    submit() {
      this.searchdata()
    },
    tableSelectChange(item) {
        this.selections = item
    },
    MIMIListSelectChange(item) {
        this.MIMIselections = item
    },
    bookking() {
        PeosonalPosGetPOSMealTime({
            pageSize: 30,
            pageNumber: 1
        }).then(res => {
            if (res.RetCode === 1) {
                // let datetime = (moment(new Date()).format('YYYY-MM-DD'))+' 00:00:00'
                // datetime = Date.parse(datetime)
                // for (let item of res.RetData) {
                //     item.begins = moment(Number(item.BeginTime*60*1000) + datetime).format('YYYY/MM/DD HH:mm:ss')
                //     item.endins = moment(Number(item.EndTime*60*1000) + datetime).format('YYYY/MM/DD HH:mm:ss')
                //     item.BeginTime = moment(Number(item.BeginTime*60*1000) + datetime).format('HH:mm')
                //     item.EndTime = moment(Number(item.EndTime*60*1000) + datetime).format('HH:mm')
                // }
                // // console.log('asfasf', res.RetData)
                // for (let item of res.RetData) {
                //     item.tiem = item.BeginTime+'' + '-' + item.EndTime+''
                // }
                this.MIMIList = res.RetData
                console.log(this.MIMIList)
                // debugger
                this.openSync = false
              
            }
        })
    },
    nextStep() {
        if (this.MIMIselections.length !== 1) {
            this.$toast.warning(this.$t('Common.pleaseChooseOneOrdering'))
            return
        }
        PeosonalPosGetFixedFeeRule({
            GetFields: '*',
            sortName: 'RuleName'
        }).then(res => {
            if (res.RetCode === 1) {
                this.BoodingList = res.RetData
                this.openSyncInfo = true
                this.form.MTimeID = this.MIMIselections[0].MTimeID
                this.form.FixedFeeRuleID = this.BoodingList[0].FixedFeeRuleID
                this.form.ReservationDate = new Date().setDate(new Date().getDate() + 1) 
            }    
        })
    },
    Book() { // 订餐
        if (this.form.MTiFixedFeeRuleIDmeID === '') {
            this.$toast.warning(this.$t('navbar.请选择订餐餐段'))
            return
        }

        let oTime = this.MIMIselections[0].BeginTime
        let oTimeH = (parseInt(oTime / 60)+'').padStart(2,0)
        let oTimeD = (parseInt(oTime % 60)+'').padStart(2,0)
        let bDate = `${moment(this.form.ReservationDate).format('YYYY-MM-DD')} ${oTimeH}:${oTimeD}`    // 订餐时间
       
        PeosonalPosReservationInsert({
            IDList: this.pID,
            ReservationDate: moment(bDate).format('YYYY-MM-DD HH:mm:ss'),
            FixedFeeRuleID: this.form.FixedFeeRuleID,
            MealTimeID: this.form.MTimeID ,
            Remark: this.form.Remark
        }).then(res => {
            if (res.RetCode === 1) {
                this.$toast.success(this.$t('navbar.订餐成功'))
                this.openSyncInfo = false,
                this.openSync = false
                this.form = this.$options.data().form
            }
        }).catch(err => {
            this.$toast.error(err.ErrDesc)
        })
    }
  },
  watch: {
    open:function(a,b){
      // console.log(a,b);
      if(a==false){
        this.searchitem = this.$options.data().searchitem
      }
    }
  }
};
</script>
<style>
.home {
  height: 100%;
}
.wrap {
  position: relative;
  height: calc(100% - 100px);
  margin-top: 0.1067rem;
  overflow: auto;
}
</style>


