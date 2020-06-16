<template>
<div class="home">
  <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
  <div class="wrap" ref="loadmore">
    <!-- {{}} -->
    <Table row-key='VisitorID' border @row-click="rowClick" size="mini" ref="table_data" style="width: 100%;position:fixed;z-index:50;" :height="36">
      <table-column label="" width='48'></table-column>
      <table-column :label="$t('navbar.访客名称')" width='95'></table-column>
      <table-column :label="$t('Common.MobilePhone')" width="95"></table-column>
      <table-column :label="$t('navbar.证件号')"></table-column>
    </Table>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all="loadedAll">
      <Table row-key='VisitorID' :data="list" border @row-click="rowClick" size="mini" ref="table_data1" style="width: 100%;">
        <table-column type="expand">
          <template slot-scope="props">

            {{$t('navbar.事由')}}:<span>{{props.row.Reason}}</span>
            <br />
            <br />
            {{$t('navbar.被访者')}}：<span>{{props.row.Interviewee}}</span>
            <br />
            <br />
            <!-- 出入权限时间：<span>{{ Date.parse(new Date(props.row.LeaveTime)) - Date.parse(new Date(props.row.CreateTime))}}</span> -->
            出入权限时间：<span>{{props.row.LeaveTime?props.row.LeaveTime:''}}</span>
            <br />
            <br />
             有效期：<span>{{ Date.parse(new Date(props.row.CreateTime))}}</span>
            <br />
            <br />

             {{$t('navbar.备注')}}：<span>{{props.row.Remark}}</span>

          </template>
        </table-column>
        <table-column prop="VisitorName" :label="$t('navbar.名称')" width='95'></table-column>
        <table-column align prop="Phone" label="Phone" width='95'></table-column>
        <table-column :label="$t('navbar.证件号')">
          <template slot-scope="scope">{{scope.row.CardNo}}</template>
        </table-column>
      </Table>
    </mu-load-more>
  </div>
  <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
    <mu-appbar style="width: 100%;" :title="$t('Common.Search')" color="teal"></mu-appbar>
    <mu-row justify-content="center" class="mu-person-form" style="padding-top:25px">
      <mu-form ref="form" :model="form" label-width="80">
        <mu-form-item label-position="right" :label="$t('Meet.Starting_time')+':'">
          <mu-date-input v-model="searchitem.SearchBeginTime" :label="$t('Meet.Select_date')" label-float full-width container="bottomSheet"></mu-date-input>
        </mu-form-item>
        <mu-form-item label-position="right"  :label="$t('Meet.End_Time')+':'">
          <mu-date-input v-model="searchitem.SearchEndTime" :label="$t('Meet.Select_date')" label-float full-width container="bottomSheet" :min-date="new Date(searchitem.SearchBeginTime)"></mu-date-input>
        </mu-form-item>
        <mu-button color="primary" @click.native="submit" class="submit">{{$t('POS.search')}}</mu-button>
      </mu-form>
    </mu-row>
  </mu-drawer>
</div>
</template>

<script>
import Nav from "@/components/nav_top_menu";
import {
  Table,
  TableColumn
} from "element-ui";
import {
  PersonalVisitorGetVisitorList
} from "@/api/PersonalDoor";
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
    },
    getdata() {
      let that = this;
      let parma = {}
      let param = {};
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm:ss');
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm:ss');
      PersonalVisitorGetVisitorList({
          pageNumber: 1,
          pageSize: this.pagesize,
          ...param
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = [...that.list, ...res.RetData];
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

      PersonalVisitorGetVisitorList({
          pageNumber: this.pageindex,
          pageSize: this.pagesize,
          ...param
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = [];
          that.list = [...that.list, ...res.RetData];
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
          that.list = [...that.list, ...res.RetData];
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
