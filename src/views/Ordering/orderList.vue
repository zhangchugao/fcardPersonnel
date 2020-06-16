<template>
  <div class="home">
    <Nav icon="" :title="$route.query.item"></Nav>
    <div class="wrap" ref="loadmore">
      <!-- {{}} -->
      <Table
        border
        size="mini"
        ref="table_data"
        style="width: 100%;position:fixed;z-index:50;"
        :height="36"
      >
         <table-column label="" width='48'></table-column>
         <table-column label="访客名称" width='95'></table-column>
        <table-column label="手机" width="95"></table-column>
        <table-column label="卡号" ></table-column>
        <table-column label="操作" ></table-column>
      </Table>
      <mu-load-more
        @refresh="refresh"
        :refreshing="refreshing"
        :loading="loading"
        @load="load"
        :loaded-all="loadedAll"
      >
        <Table
          :data="list"
          border
          @row-click="rowClick"
          size="mini"
          ref="table_data1"
          :row-class-name="tableRowClassName"
          style="width: 100%;"
        >
          <table-column type="expand">
            <template slot-scope="props">
                证件号：<span>{{props.row.VisitorCardNo}}</span>
               <br/>
                <br/>
                事由:<span>{{props.row.Reason}}</span>
                <br/>
                <br/>
              
               备注：<span>{{props.row.Remark}}</span>
               <br/>
                <br/>
              
               被访者：<span>{{props.row.Interviewee}}</span>
              <br/>
                <br/>
              访问地址: <span>{{props.row.Address}}</span>
            </template>
          </table-column>
          <table-column prop="VisitorName" label="名称"  width='95'></table-column>
          <table-column align prop="Phone" label="Phone"  width='95'></table-column>
          <table-column label="卡号">
            <template slot-scope="scope">{{scope.row.CardNo}}</template>
          </table-column>
          <table-column label="操作">
            <template slot-scope="scope">
              <span style="cursor: pointer;color: #2196f3; padding:5px" v-if="!scope.row.LeaveTime" @click.stop="cancel(scope.row.VisitorID)">注销</span>
              <span style="cursor: pointer;color: #bdbdbd; padding:5px" v-else >已注销</span>
              <!-- <mu-button style="width:60px" small @click="downLoad(scope.row.VisitorID)"	color="blue">注销</mu-button> -->
            </template>
          </table-column>
        </Table>
      </mu-load-more>
    </div>
    <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
      <mu-appbar style="width: 100%;" title="搜索" color="teal"></mu-appbar>
      <mu-row justify-content="center" class="mu-person-form" style="padding-top:25px">
        <mu-form ref="form" :model="form" label-width="80">
          <!-- <mu-form-item label-position="right" label="名名称:">
            <mu-select label="" v-model="searchitem.SearchName" full-width>
                <mu-option v-for="(option,index) in options" :key="index" :label="option.val" :value="option.idx"></mu-option>
            </mu-select>
          </mu-form-item> -->
          <mu-form-item label-position="right" label="开始时间:">
            <mu-date-input
              v-model="searchitem.SearchBeginTime"
              label="选择日期"
              label-float
              type='dateTime'
              full-width
              :max-date='new Date()'
              container="bottomSheet"
            ></mu-date-input>
          </mu-form-item>
          <mu-form-item label-position="right" label="结束时间:">
            <mu-date-input
              v-model="searchitem.SearchEndTime"
              label="选择日期"
              label-float
              full-width
              type="dateTime"
              container="bottomSheet"
            ></mu-date-input>
          </mu-form-item>
          <mu-button color="primary" @click.native="submit" class="submit">搜索</mu-button>
        </mu-form>
      </mu-row>
    </mu-drawer>
    <vue-qr style="display:none" :text="qrcode" :size="200" :callback='qrcallback' qid="testid"></vue-qr>
    <mu-dialog  width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openshare">
      <div class="imgBox">
        <canvas id="canvas" style="display:none"></canvas>
        <img style="width:calc(100% )" :src="DlQrUrl" alt="Qrimage">
      </div>
      <div style='text-align:center' >
        <p style="text-align:center;display:inline-block"><mu-button @click="openshare=false"	color="blue">关闭</mu-button></p>
        <p style="text-align:center;margin-left:10px;display:inline-block"><mu-button @click="downLoad(DlQrUrl)"	color="blue">下载图片</mu-button></p>
      </div>
      
    </mu-dialog>
  </div>
</template>
<script>
import Nav from "@/components/nav_top_menu";
import { Table, TableColumn } from "element-ui";
import { PersonalVisitorGetVisitorList,PersonalVisitorComplete } from "@/api/PersonalDoor";
import { parseTime } from "@/utils/index";
import moment from 'moment';
import VueQr from 'vue-qr';


// import dateTime from 'vue-date-time-m';
export default {
  components: {
    Nav,
    Table,
    TableColumn,
    VueQr
    // dateTime
  },
  data() {
    let thistime=moment().format('YYYY-MM-DD HH:mm');
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
      options:[{val:'设备打卡',idx:1},{val:'补卡',idx:2}],
      thistime:thistime,
      searchitem: {
        // SearchName: '',
        SearchBeginTime: moment().subtract('days', 7).format('YYYY-MM-DD HH:mm')+':00',
        SearchEndTime: thistime+':59'
      },
      qrcode:'88888888',
      QrImage:'',
      openshare:false,
      DlQrUrl:'',
      visName:''
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
      this.searchitem.SearchName='';
    //   this.searchitem.SearchBeginTime = moment().format('YYYY-MM-DD HH:mm');
    //   this.searchitem.SearchEndTime = moment().format('YYYY-MM-DD HH:mm');
    },
    handleSortChange() {
      console.log(data);
    },
    tableRowClassName({row, rowIndex}) {
        if(row.LeaveTime){
          return "offline";
        }
        return ''
      },
    rowClick(data) {
      // console.log(data.LeaveTime);
      if(!data.LeaveTime){
        this.visName=data.VisitorName
        this.qrcode=data.CardNo+'';
        setTimeout(() => {
          this.DrawCanvas()
        }, 500);
      }
      
      
    },
    getdata() {
      let that = this;
      let parma={}
      let param = {};
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm:ss') ;
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
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm')+':00';
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm')+':59';

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
      param.DataTimeBegin = moment(this.searchitem.SearchBeginTime).format('YYYY-MM-DD HH:mm')+':00';
      param.DataTimeEnd = moment(this.searchitem.SearchEndTime).format('YYYY-MM-DD HH:mm')+':59';
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
    },
    qrcallback(dataUrl,id){
      this.QrImage=dataUrl;
    },
    downLoad(url){
        var  a = document.createElement("a");
        a.download = '';
        a.href = url;
        document.body.appendChild(a);
        a.click();
        a.remove();
    },
    DrawCanvas(){
      this.openshare=true;
      let that=this;
      const img = new Image()
      img.src=this.QrImage
      img.onload = function(e) {
        const canvas = document.querySelector('#canvas');
        const el= document.querySelector('.imgBox');
        console.log(el);
        canvas.width = el.clientWidth;
        canvas.height = el.clientWidth+100;
        
        const cxt = canvas.getContext('2d');
        cxt.fillStyle = "#fff";
        cxt.fillRect(0, 0, canvas.width, canvas.height);
        cxt.font="20px Verdana"
        cxt.textAlign='center';
        cxt.fillStyle = "#00AAAA";
        cxt.fillText('访客名称:',canvas.width/2,canvas.width+30);
        cxt.fillText(that.visName,canvas.width/2,canvas.width+60);
        cxt.drawImage(img,0,0,canvas.width,canvas.width);
        let url =canvas.toDataURL('image/jpeg', 1);
        that.DlQrUrl=url
        // that.downLoad(url)
      }
    },
    // 注销
    cancel(data){
      PersonalVisitorComplete({VisitorID:data}).then(res=>{
        if(res.RetCode==1){
          this.$toast.success("注销成功");
        }else{
          this.$toast.success(res.ErrDesc);
        }
      })
    }
  },
  watch: {
    open: function(a, b) {
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
.date-time-item > .date-time-input {
  text-align: left;
  border: 1px solid #f1f1f1;
  padding-left: 10px;
}
</style>
<style lang="scss">
  .el-table .offline {
    color: #b2b2b2 !important ;
  }
</style>