<template>
<div class="home">
  <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
  <div class="wrap" ref="loadmore">
    <!-- {{}} -->
    <Table border @row-click="rowClick" size="mini" ref="table_data" style="width: 100%;position:fixed;z-index:50;" :height="36">
      <table-column label="" width='48'></table-column>
      <table-column :label="$t('navbar.访客名称')" width='95'></table-column>
      <table-column :label="$t('navbar.手机号')" width="95"></table-column>
      <table-column :label="$t('table.有效期')"></table-column>
    </Table>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all="loadedAll">
      <Table :data="list" border @row-click="rowClick" size="mini" ref="table_data1" style="width: 100%;">
        <table-column type="expand">
          <template slot-scope="props">

            {{ $t('navbar.事由')}}:<span>{{props.row.Reason}}</span>
            <br />
            <br />

            {{$t('navbar.备注')}}：<span>{{props.row.Remark}}</span>
            <br />
            <br />

            {{$t('navbar.被访者')}}：<span>{{props.row.Interviewee}}</span>

             {{$t('Common.出入权限时间')}}：<span>{{props.row.Interviewee}}</span>
              {{$t('Common.有效期')}}：<span>{{props.row.Interviewee}}</span>

          </template>
        </table-column>
        <table-column prop="VisitorName" :label="$t('navbar.名称')" width='95'></table-column>
        <table-column align prop="Phone" :label="$t('navbar.手机号')" width='95'></table-column>
        <table-column :label="$t('table.status')">
          <template slot-scope="scope">{{scope.row.LeaveTime}}</template>
        </table-column>
      </Table>
    </mu-load-more>
  </div>
  <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
    <mu-appbar style="width: 100%;" :title="$t('Common.Search')" color="teal"></mu-appbar>
    <mu-row justify-content="center" class="mu-person-form" style="padding-top:25px">
      <mu-form ref="form" :model="form" label-width="80">
        <!-- <mu-form-item label-position="right" label="名名称:">
            <mu-select label="" v-model="searchitem.SearchName" full-width>
                <mu-option v-for="(option,index) in options" :key="index" :label="option.val" :value="option.idx"></mu-option>
            </mu-select>
          </mu-form-item> -->
        <mu-form-item label-position="right" :label="$t('Meet.Starting_time')+':'">
          <mu-date-input v-model="searchitem.SearchBeginTime" :label="$t('Meet.Select_date')" label-float type='dateTime' full-width :max-date='new Date()' container="bottomSheet"></mu-date-input>
        </mu-form-item>
        <mu-form-item label-position="right" :label="$t('Meet.End_Time')+':'">
          <mu-date-input v-model="searchitem.SearchEndTime" :label="$t('Meet.Select_date')" label-float full-width type="dateTime" container="bottomSheet"></mu-date-input>
        </mu-form-item>
        <mu-button color="primary" @click.native="submit" class="submit">{{$t('navbar.Search')}}</mu-button>
      </mu-form>
    </mu-row>
  </mu-drawer>
  <mu-dialog :title="$t('Common.xiangqing')" width="360" scrollable :open.sync="openSimple" class="box_info">
    <mu-list class="box">
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          <!-- <mu-switch  readonly></mu-switch> -->
          {{$t('Common.dName')}}：
        </mu-list-item-action>
        <mu-list-item-title>{{rowdata.DoorName}}</mu-list-item-title>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          <!-- <mu-switch  readonly></mu-switch> -->
          {{$t('Common.Time')}}：
        </mu-list-item-action>
        <mu-list-item-title>{{rowdata.DataTime}}</mu-list-item-title>
      </mu-list-item>
    </mu-list>
    <mu-button slot="actions" flat color="primary" @click="openSimple=false">{{$t('Common.shut_down')}}</mu-button>
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
  VisitorReportGetVisitorList
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
        val: '设备打卡',
        idx: 1
      }, {
        val: '补卡',
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
  created() {
    this.options = [{
      val: this.$t('navbar.设备打卡'),
      idx: 1
    }, {
      val: this.$t('Att.AttendSign'),
      idx: 2
    }];
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
      VisitorReportGetVisitorList({
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

      VisitorReportGetVisitorList({
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
      VisitorReportGetVisitorList({
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
              that.$toast.warning(this.$t('navbar.没有更多数据了'));
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
