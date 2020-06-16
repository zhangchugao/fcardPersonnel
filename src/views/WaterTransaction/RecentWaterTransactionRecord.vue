<template>
  <div class="home">
    <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
    <div class="wrap" ref="loadmore">
      <!-- {{}} -->
      <Table
        border
        @row-click="rowClick"
        size="mini"
        ref="table_data"
        style="width: 100%;position:fixed;z-index:50;"
        :height="36"
      >
        <table-column :label="$t('Common.VisTips31')" width="90"></table-column>
        <table-column :label="$t('Common.WalletBalance')" width></table-column>
        <table-column :label="$t('navbar.消费时间')" width="150"></table-column>
      </Table>
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading">
        <Table
          :data="list"
          border
          @row-click="rowClick"
          size="mini"
          ref="table_data1"
          style="width: 100%;"
        >
          <table-column prop="PayMoney" width="90"></table-column>
          <table-column align prop="CardMoney"  width></table-column>
          <table-column  width="150">
            <template slot-scope="scope">{{scope.row.RecordDate}}</template>
          </table-column>
        </Table>
      </mu-load-more>
    </div>
   
    <mu-dialog :title="$t('Common.xiangqing')" width="360" scrollable :open.sync="openSimple" class='box_info'>
      <mu-list class='box'>
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
        {{$t('Common.WalletBalance')}}：
      </mu-list-item-action>
      <mu-list-item-title>
        {{rowdata.CardMoney}}
      </mu-list-item-title>
    </mu-list-item>
    <mu-divider></mu-divider>
    <mu-list-item button :ripple="false">
      <mu-list-item-action>
        <!-- <mu-switch  readonly></mu-switch> -->
        {{$t('navbar.消费时间')}}：
      </mu-list-item-action>
      <mu-list-item-title>
        {{rowdata.RecordDate}}
      </mu-list-item-title>
    </mu-list-item>
  
</mu-list>
      <mu-button slot="actions" flat color="primary" @click="openSimple=false">{{$t('table.close')}}</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
import Nav from "@/components/nav_top";
import { Table, TableColumn } from "element-ui";
import { RecentWaterTransactionRecord } from "@/api/getdata";
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
      pagesize: 30,
      pageindex: 1
    };
  },
  mounted() {
    this.getdata();
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
      console.log(data);
      this.openSimple = true;
      this.rowdata = data;
      [this.rowdata].map(item => {
        console.log(item);
      });
    },
    getdata() {
      let that = this;
      RecentWaterTransactionRecord({ PageIndex: this.pageindex, PageSize: this.pagesize })
        .then(res => {
          // console.log(res.RetData);
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
      this.pageindex=1;
      setTimeout(() => {
        this.refreshing = false;
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
      RecentWaterTransactionRecord({ PageIndex: this.pageindex, PageSize: this.pagesize })
        .then(res => {
          that.list = [...that.list, ...res.RetData.Data];
          setTimeout(() => {
            that.$refs.loadmore.scrollTop = a;
          }, 500);
          setTimeout(() => {
            that.loading = false;
          }, 1000);
        })
        .catch(err => {
          // alert(err)
          that.loading = false;
        });
    },
    submit() {}
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


