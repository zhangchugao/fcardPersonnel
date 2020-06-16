<template>
<div class="home">
  <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
  <div class="wrap" ref="loadmore">
    <!-- {{}} -->
    <Table border @row-click="rowClick" size="mini" ref="table_data" style="width: 100%;position:fixed;z-index:50;" :height="36">
      <table-column :label="$t('Meet.Starting_time')" width='140'></table-column>
      <table-column :label="$t('Meet.End_Time')" width="140"></table-column>
      <table-column :label="$t('navbar.时长')"></table-column>
    </Table>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all="loadedAll">
      <Table :data="list" border @row-click="rowClick" size="mini" ref="table_data1" style="width: 100%;">
        <table-column prop="BeginDate" label="日期" width="140"></table-column>
        <table-column prop="EndDate" label="日期" width="140"></table-column>
        <table-column :label="$t('navbar.时长')">
          <template slot-scope="scope">{{scope.row.rMinute+$t('Att.minute')}}</template>
        </table-column>
      </Table>
    </mu-load-more>
  </div>
  <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
    <mu-appbar style="width: 100%;" :title="$t('POS.search')" color="teal"></mu-appbar>
    <mu-row justify-content="center" class="mu-person-form" style="padding-top:25px">
      <mu-form ref="form" :model="form" label-width="80">
        <!-- <mu-form-item label-position="right" label="名名称:">
            <mu-select label="" v-model="searchitem.SearchName" full-width>
                <mu-option v-for="(option,index) in options" :key="index" :label="option.val" :value="option.idx"></mu-option>
            </mu-select>
          </mu-form-item> -->
        <mu-form-item label-position="right" :label="$t('Meet.Starting_time')+':'">
          <mu-date-input v-model="searchitem.SearchBeginTime" :label="$t('Meet.Select_date')" label-float full-width container='bottomSheet'></mu-date-input>
        </mu-form-item>
        <mu-form-item label-position="right" :label="$t('Meet.End_Time')+':'">
          <mu-date-input v-model="searchitem.SearchEndTime" :label="$t('Meet.Select_date')" label-float full-width container='bottomSheet' :min-date='searchitem.SearchBeginTime'></mu-date-input>
        </mu-form-item>
        <mu-button color="primary" @click.native="submit" class="submit">{{$t('POS.search')}}</mu-button>
      </mu-form>
    </mu-row>
  </mu-drawer>
  <mu-dialog :title="$t('Common.xiangqing')" width="360" scrollable :open.sync="openSimple" class="box_info">
    <mu-list class="box">
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          <!-- <mu-switch  readonly></mu-switch> -->
          {{$t('Meet.Starting_time')}}：
        </mu-list-item-action>
        <mu-list-item-title>{{rowdata.BeginDate}}</mu-list-item-title>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          {{$t('Meet.End_Time')}}：
        </mu-list-item-action>
        <mu-list-item-title>{{rowdata.EndDate}}</mu-list-item-title>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          {{$t('navbar.时长')}}：
        </mu-list-item-action>
        <mu-list-item-title>{{rowdata.rMinute}}</mu-list-item-title>
      </mu-list-item>
    </mu-list>
    <mu-button slot="actions" flat color="primary" @click="openSimple=false">{{$t('table.close')}}</mu-button>
  </mu-dialog>
</div>
</template>

<script>
import Nav from "@/components/nav_top_menu";
import {
  Table,
  TableColumn
} from "element-ui";
import {
  WorkReportGetOvertimeRecordList
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
    let thistime = moment().format('YYYY-MM-DD HH:mm');
    return {
      open: false,
      refreshing: false,
      loading: false,
      openSimple: false,
      list: [],
      rowdata: "",
      pagesize: 30,
      pageindex: 1,
      loadedAll: false,
      form: {},
       options: [{
        val: this.$t('navbar.设备打卡'),
        idx: 1
      }, {
        val: this.$t('Att.AttendSign'),
        idx: 2
      }],
      thistime: thistime,
      searchitem: {
        // SearchName: '',
        SearchBeginTime: moment().subtract('days', 7).format('YYYY-MM-DD HH:mm') + ':00',
        SearchEndTime: thistime + ':59'
      }
    };
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
      let parma = {}
      let param = {};
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm:ss');
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm:ss');
      WorkReportGetOvertimeRecordList({
          pageNumber: this.pageindex,
          pageSize: this.pagesize,
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

      WorkReportGetOvertimeRecordList({
          pageNumber: this.pageindex,
          pageSize: this.pagesize,
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
      this.pageindex = 1;
      setTimeout(() => {
        this.refreshing = false;
        this.loadedAll = false;
        this.list = [];
        this.getdata();
      }, 2000);
    },
    load() {
      this.loading = true;
      this.pageindex++;
      let a = this.$refs.loadmore.scrollTop;
      // console.log(5555555);
      this.$refs.loadmore.scrollTop = a;
      //   this.getdata()
      let that = this;
      let param = {};
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm') + ':00';
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm') + ':59';
      WorkReportGetOvertimeRecordList({
          pageNumber: this.pageindex,
          pageSize: this.pagesize,
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
              that.$toast.warning(that.$t('navbar.没有更多数据了'));
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
