<template>
<div class="home">
  <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
  <div class="wrap" ref="loadmore">
    <Table border @row-click="rowClick" size="mini" ref="table_data" style="width: 100%;position:fixed;z-index:50;" :height="36">

      <table-column label="" width='48'></table-column>
      <table-column :label="$t('navbar.报表日期')" width='140'></table-column>
      <table-column :label="$t('Att.Shift')"></table-column>
    </Table>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all="loadedAll">
      <Table :data="list" border @row-click="rowClick" size="mini" ref="table_data1" style="width: 100%;">
        <table-column type="expand">
          <template slot-scope="props">

            {{$t('navbar.上班分钟')}}：<span>{{props.row.Details[0].InDate}}</span>
            <br />
            <br />

            {{$t('Att.workDays')}}：<span>{{props.row.Details[0].WorkDay}}</span>
            <br />
            <br />

            {{$t('Att.Unswapped')}}：<span>{{props.row.Details[0].NoRecordCount}}</span>
            <br />
            <br />

            {{$t('navbar.迟到分钟')}}：<span>{{props.row.Details[0].LateMinute}}</span>
            <br />
            <br />

            {{$t('navbar.请假分钟')}}：<span>{{props.row.Details[0].LeaveMinute}}</span>
            <br />
            <br />

            {{$t('navbar.早退分钟')}}：<span>{{props.row.Details[0].EarlyMinute}}</span>
            <br />
            <br />

            {{$t('navbar.扩工次数')}}：<span>{{props.row.Details[0].NoDutyCount}}</span>
            <br />
            <br />

            {{$t('navbar.加班分钟')}}：<span>{{props.row.Details[0].InDate}}</span>
            <br />
            <br />

            {{$t('Att.Travel_legnth')}}：<span>{{props.row.Details[0].EgressionMinute}}</span>
            <br />
            <br />

            {{$t('Att.Number_of_replacement_cards')}}:<span>{{props.row.Details[0].AddRecordCount}}</span>

          </template>
        </table-column>
        <table-column prop="RepotDate" label=" " width='140'></table-column>
        <!-- <table-column align prop="DataTime" label="日期" width="150"></table-column> -->
        <table-column label=" ">
          <template slot-scope="scope">{{WorkTimeGroup[scope.row.WorkTimeGroupID].WorkName}}</template>
        </table-column>
      </Table>
    </mu-load-more>
  </div>
  <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
    <mu-appbar style="width: 100%;" :title="$t('POS.search')" color="teal"></mu-appbar>
    <mu-row justify-content="center" class="mu-person-form" style="padding-top:25px">
      <mu-form ref="form" :model="form" label-width="80"> 
        <mu-form-item label-position="right" :label="$t('Meet.Starting_time')+':'">
          <mu-date-input v-model="searchitem.SearchBeginTime" :label="$t('Meet.Select_date')" label-float type='dateTime' full-width :max-date='new Date()' container="bottomSheet"></mu-date-input>
        </mu-form-item>

        <mu-button color="primary" @click.native="submit" class="submit">{{$t('POS.search')}}</mu-button>
      </mu-form>
    </mu-row>
  </mu-drawer>

</div>
</template>

<script>
// 月报表
import Nav from "@/components/nav_top_menu";
import {
  Table,
  TableColumn
} from "element-ui";
import {
  WorkReportGetMonthReportList,
  WorkReportGetWorkTimeGroupList
} from "@/api/CheckingIn";
import {
  parseTime
} from "@/utils/index";
import moment from 'moment';
// import dateTime from 'vue-date-time-m';

export default {
  components: {
    Nav,
    Table,
    TableColumn
    // dateTime
  },
  data() {
    let thistime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
    return {
      open: false,
      refreshing: false,
      loading: false,
      openSimple: false,
      list: [],
      rowdata: "",
      pageSize: 30,
      pageNumber: 1,
      loadedAll: false,
      form: {},
      options: [{
        val: '设备打卡',
        idx: 1
      }, {
        val: '补卡',
        idx: 2
      }],
      thistime: moment().format('YYYY-MM'),

      searchitem: {
        // SearchName: '',
        SearchBeginTime: moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'),
        SearchEndTime: moment().endOf('month').format('YYYY-MM-DD HH:mm:ss')
      },
      WorkTimeGroup: {
        0: {
          LateNO: 0,
          LateWork: 0,
          OTEarlyMinusMinute: 0,
          OTEarlyMinute: 0,
          OTMinusMinute: 0,
          OTMinute: 0,
          WorkDay: 0,
          WorkHour: 0,
          WorkName: "休息",
          WorkTimeGroupID: 0
        }
      }
    };
  },
  created() {
    WorkReportGetWorkTimeGroupList({
      pageSize: 100,
      pageNumber: 1
    }).then(res => {
      console.log(res);
      if (res.RetCode == 1) {
        if (res.RetData.Data) {
          let data = res.RetData.Data;
          data.forEach(element => {
            this.WorkTimeGroup[element.WorkTimeGroupID] = element
          });
        }
      }
    }).catch(err => {
      console.log(err);
    })
  },
  mounted() {
    console.log(moment())
    this.getdata();
  },
  methods: {
    openD() {
      //打开侧边
      this.open = true;
      this.searchitem.SearchName = '';
      //   this.searchitem.SearchBeginTime = moment().format('YYYY-MM-DD HH:mm');
      //   this.searchitem.SearchEndTime = moment().format('YYYY-MM-DD HH:mm');
    },
    handleSortChange() {
      console.log(data);
    },
    rowClick(data) {
      console.log(data);
      // this.openSimple = true;
      // this.rowdata = data;
      // [this.rowdata].map(item => {
      //   console.log(item);
      // });
    },
    getdata() {
      let that = this;
      let param = {};
      //   param.RecordType = this.searchitem.SearchName;
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm') + ':00';
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm') + ':59';

      WorkReportGetMonthReportList({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...param
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = [...that.list, ...res.RetData.Data];
          // console.log(that.list);
        })
        .catch(err => {
          // alert(err)
        });
    },
    searchdata() {
      let that = this;

      //   console.log(parseTime(this.searchitem.SearchBeginTime));
      let param = {};
      //   param.RecordType = this.searchitem.SearchName;
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm') + ':00';
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm') + ':59';

      WorkReportGetMonthReportList({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...param
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = [];
          that.list = [...that.list, ...res.RetData.Data];
          console.log(that.list);
        })
        .catch(err => {
          // alert(err)
        });
    },
    refresh() {
      this.refreshing = true;
      this.$refs.table_data.scrollTop = 0;
      this.pageNumber = 1;
      setTimeout(() => {
        this.refreshing = false;
        this.loadedAll = false;
        this.list = [];
        this.getdata();
      }, 2000);
    },
    load() {
      this.loading = true;
      this.pageNumber++;
      let a = this.$refs.loadmore.scrollTop;
      // console.log(5555555);
      this.$refs.loadmore.scrollTop = a;
      this.searchitem.SearchBeginTime = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss');
      this.searchitem.SearchEndTime = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
      let that = this;
      let param = {};
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm') + ':00';
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm') + ':59';
      WorkReportGetMonthReportList({
          pageNumber: this.pageNumber,
          pageSize: this.pageSize,
          ...param
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = [...that.list, ...res.RetData.Data];
          setTimeout(() => {
            that.$refs.loadmore.scrollTop = a;
          }, 500);
          setTimeout(() => {
            that.loading = false;
            if (res.RetData.Data.length == 0) {
              that.loadedAll = true;
              that.$toast.config({
                position: "bottom"
              });
              that.$toast.warning("没有更多数据了！！");
            }
          }, 1000);
        })
        .catch(err => {
          // alert(err)
          that.loading = false;
        });
    },
    submit() {
      this.searchdata();
    }
  },
  watch: {
    thistime(n, o) {
      this.searchitem.SearchBeginTime = moment(n).startOf('month').format('YYYY-MM-DD HH:mm:ss');
      this.searchitem.SearchEndTime = moment(n).endOf('month').format('YYYY-MM-DD HH:mm:ss');
    },
    open: function (a, b) {
      // console.log(a,b);

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
  height: calc(100% - 60px);
  margin-top: 0.1067rem;
  overflow: auto;
}

.d-date-time.zindex5000000 {
  z-index: 50000000;
}

.date-time-item>.date-time-input {
  text-align: left;
  border: 1px solid #f1f1f1;
  padding-left: 10px;
}
</style>
