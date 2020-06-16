<template>
  <div class="home">
    <mu-appbar style="width: 100%;" color="primary">
      <mu-button icon slot="left">
        <!-- <mu-icon value="menu"></mu-icon> -->
      </mu-button>{{$i18n.t('Common.欢迎使用云系统个人版')}}
      <mu-button v-if="TuiChu" flat slot="right" @click="lgout">
        {{$i18n.t('Common.drop_out')}}
      </mu-button>
    </mu-appbar>
    <div class="warp">
      <mu-row justify-content="center" style="margin-top: 40px">
        <!-- <div style="width:200px;height:200px;overflow:hidden;border-ra">
          <img style="width:100%" :src="pImage||oimg">
        </div> -->
        <mu-avatar style="border:2px solid #409eff" :size="180">
          <img  :src="pImage||oimg">
        </mu-avatar>
      </mu-row>
      <mu-row justify-content="center" style="font-size:.4rem;color:#44c0ff;margin-top:.3rem;font-weight:bold;letter-spacing: 2px">{{$i18n.t('Common.欢迎你')}} {{pName}}</mu-row>
      <!-- <div class="list_ul">
        <div class="warp_tit" >最近出入门记录</div>
        <Table
          :data="list"
          border
          @row-click="rowClick"
          ref="table_data"
          :height='"calc(100% - 1.04rem)"' 
          size='mini'
          style="width: 100%;">
          {{list}}
          <table-column prop="DoorName" label="门名称" width></table-column>
          <table-column align="" prop="DataTime" label="时间" width='160'></table-column>
          <table-column prop="PortNum" label="事件类型" width='80'>
              <template slot-scope="scope">
               
                  {{scope.row.PortNum==1?'入门':'出门'}}
                
              </template>
          </table-column>
        </Table>
      </div>-->
      <div class="desktop_menu">
        <div class="desktop_menu_item" v-for="(item,index) in menu" :key="index">
          <router-link :to="item.path" @click.native="item.click">
            <div
              class="mu-ripple-demo demo-2"
              :color="item.color"
              
            >
              <img :src="item.icon" alt />
            </div>
            
            <p>{{$i18n.t(item.val)}}</p>
          </router-link>
        </div>
      </div>
    </div>
    <!-- <mu-bottom-nav class="nav" :value="value">
      <mu-bottom-nav-item title="个人中心" icon="person_pin" @click.native="toPerson" value="1"></mu-bottom-nav-item>
      <mu-bottom-nav-item title="报表查询" icon="table_chart" @click.native="toReport" value="2"></mu-bottom-nav-item>
    </mu-bottom-nav> -->

    <mu-dialog
      :title="$i18n.t('Common.drop_out')"
      width="600"
      max-width="80%"
      :esc-press-close="false"
      :overlay-close="false"
      :open.sync="openAlert"
    >
      {{$i18n.t('navbar.你确定要退出登录吗')}}
      <mu-button slot="actions" flat color="primary" @click="closeAlertDialog">{{$i18n.t('Common.drop_out')}}</mu-button>
      <mu-button slot="actions" flat color="primary" @click="closeDialog">{{$i18n.t('Common.Cancel')}}</mu-button>
    </mu-dialog>
  </div>
</template>
<script>
import rebshi from '@/assets/od.png';
import xiaofei from '@/assets/qr.png';
import kaoqin from '@/assets/xf.png';
import menjin from '@/assets/fk.png';
import tinche from '@/assets/bb.png';
import xungen from '@/assets/gr.png';

import { Table, TableColumn } from "element-ui";
import {
  RecentAccessRecord,
  ClientLogout,
  Information,
  GetOSSConfig
} from "@/api/getdata";
import oimg from "@/assets/filt.png";
export default {
  name: "index",
  data() {
    return {
      oimg: oimg,
      list: [],
      openAlert: false,
      value: 0,
      pName: "",
      pImage: "",
      TuiChu: true,
      menu:[],
    };
  },
  components: {
    Table,
    TableColumn
  },
  created() {
    // console.log(this.$i18n.t('Common.drop_out'))
    this.menu=[
            {
                val:'table.remotely_door',//远程开门
                // style:"background-image: linear-gradient(-40deg, #27cbde 15%, #97f0fb 100%), linear-gradient(#43daec, #43daec);",
                icon:rebshi,
                color:'#97f0fb',
                path:'/DoorOperation',
                click:this.eventNull
            },
            {
                val:'table.二维码开门',
                // style:"background-image: linear-gradient(-40deg,#00baff 0%, #93e2ff 100%), linear-gradient(#00baff, #00baff);",
                icon:xiaofei,
                color:'#93e2ff',
                path:'/QRCode',
                click:this.eventNull
            },
            {
                val:'table.订餐消费',
                // style:"background-image:linear-gradient(-40deg, #ecab45 0%, #ffd99e 100%), linear-gradient(#ecab45, #ecab45);",
                icon:kaoqin,
                color:'#ffd99e',
                path:'/POSControl',
                click:this.eventNull
            },
            {
                val:'Common.Vis1',//访客授权
                // style:"background-image: linear-gradient(-40deg, #ec7b44 0%, #ffcb7b 100%), linear-gradient(#ec7b44, #ec7b44);",
                icon:menjin,
                color:'#ffcb7b',
                path:'/Visitor',
                click:this.eventNull
            },
            {
                val:'table.报表查询',//
                // style:"background-image: linear-gradient(-40deg, #ec7b44 0%, #ffcb7b 100%), linear-gradient(#ec7b44, #ec7b44);",
                icon:tinche,
                color:'#ffcb7b',
                path:'',
                click:this.toReport
            },
            {
                val:'table.个人信息',
                // style:"background-image: linear-gradient(-40deg, #ec7b44 0%, #ffcb7b 100%), linear-gradient(#ec7b44, #ec7b44);",
                icon:xungen,
                color:'#ffcb7b',
                path:'',
                click:this.toPerson
            }]
    let that = this;
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
      wx.miniProgram.getEnv(res => {
        if (res.miniprogram) {
          that.TuiChu = false;
        } else {
          that.TuiChu = true;
        }
      });
    } else {
      that.TuiChu = true;
    }
  },

  mounted() {
    let that = this;
    // RecentAccessRecord().then(res=>{
    //   // console.log(res.RetData);
    //   that.list=[...res.RetData.Data];
    //   console.log(that.list)
    // }).catch(err=>{
    //   // alert(err)
    // })
    // Information().then(res=>{
    //   console.log(res)
    // })
    async function getdata() {
      await Information().then(res => {
        console.log(res);
        if (res) {
          that.pName = res.RetData.PName;
          let PImage = res.RetData.PImage;
          if (res.RetData.PImage) {
            // 如果有图片的话
            GetOSSConfig().then(res => {
              if (res.RetCode === 1) {
                let aliConfig = res.RetData;
                let a = PImage.substring(0, 1);
                if (a === "/") {
                  that.pImage = `https://${res.RetData.BuckName}.${
                    res.RetData.EndPoint
                  }${PImage}?${Date.parse(new Date())}`;
                } else {
                  that.pImage = `https://${res.RetData.BuckName}.${
                    res.RetData.EndPoint
                  }/${PImage}?${Date.parse(new Date())}`;
                }
              }
            });
          }
        } else {
          var ua = navigator.userAgent.toLowerCase();
          if (ua.match(/MicroMessenger/i) == "micromessenger") {
            //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
            wx.miniProgram.getEnv(res => {
              if (res.miniprogram) {
                console.log(wx.miniProgram.navigateBack);
                wx.miniProgram.navigateBack({ delta: 1 });
              } else {
              }
            });
          } else {
            console.log(wx.miniProgram.navigateBack);
          }
        }
      });
      await RecentAccessRecord()
        .then(res => {
          // console.log(res.RetData);
          that.list = [...res.RetData.Data];
          // console.log(that.list)
        })
        .catch(err => {
          // alert(err)
        });
    }
    setTimeout(() => {
      getdata();
    }, 1000);
  },
  methods: {
    handleSortChange() {
      console.log(data);
    },
    rowClick(data) {
      console.log(data);
    },
    lgout() {
      this.openAlert = true;
    },
    closeAlertDialog() {
      let that = this;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv(res => {
          if (res.miniprogram) {
            console.log(wx.miniProgram.navigateBack);
            wx.miniProgram.navigateBack({ delta: 1 });
          } else {
            ClientLogout().then(res => {
              this.$progress.start();
              setTimeout(() => {
                that.$progress.done();
                that.$router.push({ path: "/home" });
                that.$store.state.transitionName = "slide-left";
              }, 300);
            });
          }
        });
      } else {
        ClientLogout().then(res => {
          this.$progress.start();
          setTimeout(() => {
            that.$progress.done();
            that.$router.push({ path: "/home" });
            that.$store.state.transitionName = "slide-left";
          }, 300);
        });
      }
    },
    closeDialog() {
      this.openAlert = false;
    },
    toPerson() {
      // alert();
      let that = this;

      var ua = navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
        wx.miniProgram.getEnv(res => {
          if (res.miniprogram) {
            console.log(wx.miniProgram.navigateBack);
            // wx.miniProgram.navigateBack({delta: 1})
            wx.miniProgram.switchTab({
              url: "/pages/bindCard/index",
              success: function() {
                console.log("success");
              },
              fail: function() {
                console.log("fail");
              },
              complete: function() {
                console.log("complete");
              }
            });
          } else {
            this.$progress.start();
            setTimeout(() => {
              that.$progress.done();
              that.$router.push({ path: "personal" });
              that.$store.state.transitionName = "slide-left";
            }, 300);
          }
        });
      } else {
        this.$progress.start();
        setTimeout(() => {
          that.$progress.done();
          that.$router.push({ path: "personal" });
          that.$store.state.transitionName = "slide-left";
        }, 300);
      }
    },
    toReport() {
      let that = this;
      this.$progress.start();
      setTimeout(() => {
        that.$progress.done();
        that.$router.push({ path: "Report" });
        that.$store.state.transitionName = "slide-left";
      }, 300);
    },
    Inform() {
      //通知
      alert("管理员通知信息");
    },
    $t(e){
      return e
    },
    eventNull(){}
  }
};
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
}
.right {
  display: inline;
  .asdf {
    color: #fefedd;
  }
}
.nav {
  position: fixed;
  bottom: 0;
  width: 100%;
}
.warp {
  margin-top: 8px;
  height: calc(100% - 64px);
  min-height: 6.9333rem;
  padding-bottom: 56px;
}
.list_ul {
  height: calc(100% - 155px);
  overflow-y: auto;
  .warp_tit {
    font-size: 0.5333rem;
    font-weight: 600;
    padding: 0.1333rem 0;
  }
  .el-table--mini {
    font-size: 0.32rem;
  }
}
.desktop_menu {
  margin: auto;
  box-sizing: border-box;
  padding: .2rem 0;
  border-top: 1.5px solid #f5f5f5;
  border-bottom: 1.5px solid #f5f5f5;
  margin-top: 0.8667rem;
  display: grid;
  grid-template-columns: 33.3% 33.3% 33.3%;
  grid-template-rows: 3rem 3rem;
  .desktop_menu_item {
    a {
      display: inline-block;
      width: 100%;
      height: 100%;
      color: #000000;
      text-decoration: none;
      text-align: -webkit-center;
      box-sizing: border-box;
      padding-top: .5rem
    }
  }
}
.desktop_menu {
  // overflow: hidden;
  clear: both;
  .desktop_menu_item {
    // overflow: hidden;
    // float: auto;
    width: 100%;
    height: 100%;
    margin: auto;
    text-align: center;
    position: relative;
    line-height: normal;
    // border:1px solid #fcfc;
    box-sizing: border-box;
    &:nth-child(3n + 1) {
      border-right: 1.5px solid #f5f5f5;
    }
    &:nth-child(-n + 3) {
      border-bottom: 1.5px solid #f5f5f5;
    }
    &:nth-child(3n + 2) {
      border-right: 1.5px solid #f5f5f5;
    }
    p {
      font-size: 0.2667rem;
      margin-top: .1rem;
      margin-left: -0.1833rem;
      width: 1.6rem;
    }
    img {
      width: 100%;
      position: absolute;
    }
    .mu-ripple-demo {
      position: relative;
      width: 1.32rem;
      height: 1.32rem;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 0.2133rem;
      border-radius: 0.3467rem;
      overflow: hidden;
      &.demo-1 {
        color: #2196f3;
        border: 1px solid #2196f3;
      }
    }
  }
}

.mu-avatar {
  img {
    object-fit: cover;
  }
}
</style>
<style lang='scss'>
  em.mu-badge-float {
    position: absolute;
    top: 2px;
    right: -1px;
  }
</style>


