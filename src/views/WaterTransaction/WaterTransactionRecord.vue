<template>
<div class="home">
  <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
  <div class="wrap" ref="loadmore">
    <!-- {{}} -->
    <Table border @row-click="rowClick" size="mini" ref="table_data" style="width: 100%;position:fixed;z-index:50;" :height="36">
      <table-column :label="$t('navbar.消费时间')" width="150"></table-column>
      <table-column :label="$t('Common.VisTips31')" width></table-column>
      <table-column :label="$t('navbar.消费类型')" width></table-column>
    </Table>
    <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load" :loaded-all='loadedAll'>
      <Table :data="list" border @row-click="rowClick" size="mini" ref="table_data1" style="width: 100%;">
        <table-column prop="RecordDate" width="150"></table-column>
        <table-column align prop="PayMoney" width></table-column>
        <table-column label="状态" width>
          <template slot-scope="scope">{{[$t('Wat.none'),$t('Wat.RuleType1'),$t('Wat.RuleType2'),$t('Wat.RuleType3')][scope.row.ChargesRuleType]}}</template>
        </table-column>
      </Table>
    </mu-load-more>
  </div>
  <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
    <mu-appbar style="width: 100%;" :title="$t('POS.search')" color="teal"></mu-appbar>
    <mu-row justify-content="center" class="mu-person-form">
      <mu-form ref="form" :model="searchitem" label-width="80">
        <!-- <mu-form-item label-position="right" label="名称:">
          <mu-text-field v-model="searchitem.SearchName"></mu-text-field>
        </mu-form-item> -->
         <mu-form-item label-position="right" :label="$t('Meet.Starting_time')+':'">
          <mu-date-input v-model="searchitem.SearchBeginTime" :label="$t('Meet.Select_date')" label-float type='dateTime' full-width :max-date='new Date()' container="bottomSheet"></mu-date-input>
        </mu-form-item>
        <mu-form-item label-position="right" :label="$t('Meet.End_Time')+':'">
          <mu-date-input v-model="searchitem.SearchEndTime" :label="$t('Meet.Select_date')" label-float full-width type="dateTime" container="bottomSheet"></mu-date-input>
        </mu-form-item>
        <mu-button color="primary" @click.native="submit" class="submit">{{$t('POS.search')}}</mu-button>
      </mu-form>
    </mu-row>
  </mu-drawer>
  <mu-dialog :title="$t('Common.xiangqing')"  width="360" scrollable :open.sync="openSimple" class='box_info'>
    <mu-list class='box'>
      <mu-list-item button :ripple="false">

        <mu-list-item-action>
          <!-- <mu-switch  readonly></mu-switch> -->
          {{$t('navbar.消费时间')}}：
        </mu-list-item-action>
        <mu-list-item-title>
          {{rowdata.RecordDate}}
        </mu-list-item-title>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          <!-- <mu-switch  readonly></mu-switch> -->
          {{$t('Common.VisTips31')}}：
        </mu-list-item-action>
        <mu-list-item-title>
          {{rowdata.PayMoney}}
        </mu-list-item-title>
      </mu-list-item>
      <mu-divider></mu-divider>
      <mu-list-item button :ripple="false">
        <mu-list-item-action>
          <!-- <mu-switch  readonly></mu-switch> -->
         {{$t('navbar.消费类型')}}：
        </mu-list-item-action>
        <mu-list-item-title>
          <!-- {{rowdata.PortNum==1?'出门':'入门'}} -->
          {{[$t('Wat.none'),$t('Wat.RuleType1'),$t('Wat.RuleType2'),$t('Wat.RuleType3')][rowdata.ChargesRuleType]}}
        </mu-list-item-title>
      </mu-list-item>

    </mu-list>
    <mu-button slot="actions" flat color="primary" @click="openSimple=false">关闭</mu-button>
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
  WaterTransactionRecord
} from "@/api/getdata";
import {
  parseTime
} from '@/utils/index'
export default {
  components: {
    Nav,
    Table,
    TableColumn
  },
  data() {
    return {
      open: false,
      refreshing: false,
      loading: false,
      openSimple: false,
      list: [],
      rowdata: "",
      searchitem: {
        SearchName: '',
        SearchBeginTime: new Date(),
        SearchEndTime: ''
      },
      pagesize: 30,
      pageindex: 1,
      loadedAll: false,
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    openD() {
      //打开侧边
      this.open = true;
      this.searchitem.SearchBeginTime = new Date()
    },
    handleSortChange() {
      console.log(data);
    },
    rowClick(data) {
      console.log(data);
      this.openSimple = true;
      this.rowdata = data;
      [this.rowdata].map(item => {
        console.log(item);
      });
    },
    getdata() {
      let that = this;
      WaterTransactionRecord({
          PageIndex: this.pageindex,
          PageSize: this.pagesize
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = [...that.list, ...res.RetData.Data];
          console.log(that.list);
        })
        .catch(err => {
          // alert(err)
        });
    },
    searchdata() {
      let that = this;

      console.log(parseTime(this.searchitem.SearchBeginTime))
      let param = {}
      param.SearchName = this.searchitem.SearchName;
      param.SearchBeginTime = parseTime(this.searchitem.SearchBeginTime);
      param.SearchEndTime = parseTime(this.searchitem.SearchEndTime);

      WaterTransactionRecord({
          PageIndex: this.pageindex,
          PageSize: this.pagesize,
          ...param
        })
        .then(res => {
          // console.log(res.RetData);
          that.list = []
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
        this.loadedAll = false
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
      WaterTransactionRecord({
          PageIndex: this.pageindex,
          PageSize: this.pagesize
        })
        .then(res => {
          that.list = [...that.list, ...res.RetData.Data];
          setTimeout(() => {
            that.$refs.loadmore.scrollTop = a;
          }, 500);
          setTimeout(() => {
            that.loading = false;
            if (res.RetData.Data.length < that.pagesize) {
              that.loadedAll = true;
              that.$toast.config({
                position: 'bottom'
              })
              that.$toast.warning('没有更多数据了！！')
            }
          }, 1000);
        })
        .catch(err => {
          // alert(err)
          that.loading = false;
        });
    },
    submit() {
      this.searchdata()
    }
  },
  watch: {
    open: function (a, b) {
      // console.log(a,b);
      if (a == false) {
        this.searchitem = {
          SearchName: '',
          SearchBeginTime: new Date(),
          SearchEndTime: ''
        }
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
  height: calc(100% - 60px);
  margin-top: 0.1067rem;
  overflow: auto;
}
</style>
