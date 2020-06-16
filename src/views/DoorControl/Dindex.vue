<template>
  <div class="home">
    <Nav :title="$route.query.item"></Nav>
    <div class="wrap" ref='loadmore'>
      <!-- {{}} -->
      <Table
          border
          size='mini'
          ref="table_data"
          style="width: 100%;position:fixed;z-index:50;" :height='36'
        >
          <table-column  :label="$t('Common.dName')" width='90'></table-column>
          <table-column  :label="$t('Att.Date')" width></table-column>
          <table-column  :label="$t('Att.status')" width='60'></table-column>
        </Table>
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading">
        <Table
          :data="list"
          border
          @row-click="rowClick" size='mini'
          ref="table_data1"
          style="width: 100%;">
          <table-column prop="DoorName" width='90'></table-column>
          <table-column align="" prop="DataTime" width></table-column>
          <table-column width='60'>
              <template slot-scope="scope">
                  {{scope.row.PortNum==1?$t('Meet.Go_out'):$t('Meet.Go_in')}}
              </template>
          </table-column>
        </Table>
      </mu-load-more>
    </div>
    <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
      <mu-appbar style="width: 100%;" :title="$t('POS.search')" color="teal"></mu-appbar>
      <mu-row justify-content="center" class="mu-person-form">
        <mu-form ref="form" :model="form" label-width="86">
          <mu-form-item label-position="right" :label="$t('POS.PName')+':'" >
            <mu-text-field v-model="form.name"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right" :label="$t('navbar.搜索条件')+':'">
            <mu-text-field v-model="form.data1"></mu-text-field>
          </mu-form-item>

          <mu-form-item label-position="right" :label="$t('navbar.搜索条件')+':'">
            <mu-text-field type="password" v-model="form.data2"></mu-text-field>
          </mu-form-item>

         <mu-button color="primary" @click="submit" class="submit">{{$t('POS.search')}}</mu-button>
          <!-- <div class="submit"> -->
            
          <!-- </div> -->
        </mu-form>
      </mu-row>
    </mu-drawer>
    <mu-dialog :title="$t('Common.xiangqing')" width="360" scrollable :open.sync="openSimple" class='box_info'>
      <mu-list class='box'>
          <mu-list-item button :ripple="false">
            
            <mu-list-item-action>
              <!-- <mu-switch  readonly></mu-switch> -->
              {{$t('Common.dName')}}：
            </mu-list-item-action>
            <mu-list-item-title>
              {{rowdata.DoorName}}
            </mu-list-item-title>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item button :ripple="false">
            <mu-list-item-action>
              <!-- <mu-switch  readonly></mu-switch> -->
              {{$t('Common.时间')}}：
            </mu-list-item-action>
            <mu-list-item-title>
              {{rowdata.DataTime}}
            </mu-list-item-title>
          </mu-list-item>
          <mu-divider></mu-divider>
          <mu-list-item button :ripple="false">
            <mu-list-item-action>
              <!-- <mu-switch  readonly></mu-switch> -->
              {{$t('table.status')}}：
            </mu-list-item-action>
            <mu-list-item-title>
              {{rowdata.PortNum==1?$t('Meet.Go_out'):$t('Meet.Go_in')}}
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
import {RecentAccessRecord} from '@/api/getdata'
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
      openSimple:false,
      list: [],
      rowdata:'',
      form: {
        name: "name",
        data1: "123",
        data2: "123123"
      },
      pagesize:30,
      pageindex:1
    };
  },
  mounted() {
    
    this.getdata()
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
      this.openSimple=true;
      this.rowdata=data;
      [this.rowdata].map((item)=>{
        console.log(item);
        
      })
    },
    getdata(){
        let that=this;
        RecentAccessRecord({PageIndex:this.pageindex,PageSize:this.pagesize}).then(res=>{
        // console.log(res.RetData);
        that.list=[...that.list,...res.RetData.Data];
        console.log(that.list)
        }).catch(err=>{
        // alert(err)
        })
    },
    refresh() {
      
      this.refreshing = true;
      this.$refs.table_data.scrollTop = 0;
      setTimeout(() => {
        this.refreshing = false;
        this.list=[];
        this.getdata()
      }, 2000);
    },
    load() {
      this.loading = true;
      this.pageindex++;
      let a=this.$refs.loadmore.scrollTop;
      console.log(5555555)
      this.$refs.loadmore.scrollTop=a
    //   this.getdata()
    let that=this;
      RecentAccessRecord({PageIndex:this.pageindex,PageSize:this.pagesize}).then(res=>{
        // console.log(res.RetData);
        
        
        that.list=[...that.list,...res.RetData.Data];
        setTimeout(() => {
            that.$refs.loadmore.scrollTop=a
        }, 500);
        setTimeout(()=>{
            that.loading = false;
            
        },1000)
        console.log(that.list)
        }).catch(err=>{
        // alert(err)
        that.loading = false;
        })
    },
    submit(){

    }
  }
};
</script>
<style>
.home {
  height: 100%;
}
.wrap {
  position:relative;
  height: calc(100% - 60px);
  margin-top: 0.1067rem;
  overflow: auto;
}
</style>




