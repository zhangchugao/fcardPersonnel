<template>
  <div class="home">
    <Nav :title="$t('table.remotely_door')"></Nav>
    <div class="wrap">
      <mu-paper :z-depth="1">
        <mu-list textline="two-line">
            <div v-for="(item,index) in listData" :key="index" style="overflow:hidden;position: relative;">
                <mu-ripple >
                <mu-list-item @click="Doorinfo(index)" avatar :ripple="false" button>
                    <mu-list-item-content>
                    <mu-list-item-title>{{item.DoorName||(item.DoorSN+'-'+item.PortNum)}}</mu-list-item-title>
                    <mu-list-item-sub-title>
                        {{item.LctnName}}
                    </mu-list-item-sub-title>
                    </mu-list-item-content>
                    <mu-list-item-action>
                    <mu-list-item-after-text>{{item.Online?$t('Door.Online'):$t('Door.Offline')}}</mu-list-item-after-text>
                    <!-- <mu-checkbox color="yellow700" v-model="item.Activity" uncheck-icon="star_border" @click.stop='starclick(index)' checked-icon="star"></mu-checkbox> -->
                    </mu-list-item-action>
                </mu-list-item>
                </mu-ripple>
                <mu-divider></mu-divider>
            </div>
          
        </mu-list>
      </mu-paper>
    </div>

    <mu-drawer :open.sync="open" :docked="false" :right="true" :width='"100%"'>
        <div style="height:calc(100% - 60px)">
            <mu-appbar color="teal">
                <mu-button icon slot="left" @click="open = false">
                <mu-icon value="arrow_back"></mu-icon>
                </mu-button>
                {{$t('navbar.手机开门')}}
            </mu-appbar>
            <div class="mu-person-form">
                <mu-form ref="form" :model="form" label-width="100">
                    <mu-form-item label-position="right" :label="$t('Common.dName')+':'">
                        <!-- <mu-text-field disabled  v-model="listDataItem.DoorName"></mu-text-field> -->
                        <div class="mu-input  no-empty-state disabled">
                          <!-- {{listDataItem.DoorSN}} -->
                          <div class="mu-text-field mu-input-content">{{listDataItem.DoorName?listDataItem.DoorName:(listDataItem.DoorSN+'-'+listDataItem.PortNum)}}</div>
                        </div>
                        <mu-divider></mu-divider>
                    </mu-form-item>

                    <mu-form-item label-position="right" label="SN:">
                        <mu-text-field disabled  v-model="listDataItem.DoorSN"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label-position="right" :label="$t('Common.LctnName')+':'" >
                        <mu-text-field disabled  v-model="listDataItem.LctnName"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item label-position="right" :label="$t('Common.onlineState')+':'" >
                      <div class="mu-input  no-empty-state disabled">
                          <div class="mu-text-field mu-input-content">{{listDataItem.Online?$t('Common.online'):$t('Common.outline')}}</div>
                        </div>
                        <mu-divider></mu-divider>
                    </mu-form-item>
                </mu-form>

                <div style="margin-top:60px">
                    <img @touchstart="gtouchstart()" @touchend="gtouchend()" style="width:6rem" :src="DoorOff_on">
                </div>
            </div>
        </div>
        <mu-button color="#4ac366" style="width:250px;height:40px" @click='getopenDoorlist'>{{$t('navbar.查看记录')}}</mu-button>
    </mu-drawer>
    <mu-drawer :open.sync="openDoor" :docked="false" :right="true" :width='"100%"'>
        <div style="height:calc(100% - 50px)">
            <mu-appbar color="teal">
                <mu-button icon slot="left" @click="openDoor = false">
                <mu-icon value="arrow_back"></mu-icon>
                </mu-button>
                {{$t('navbar.开门记录')}}
            </mu-appbar>
            <div class="mu-person-form">
                
                    <Table
                      :data="MIMIList"
                      border
                      size="mini"
                      ref="table_data"
                      style="width:100%">
                      <table-column :label="$t('navbar.开门时间')" prop="dt"></table-column>
                      <table-column :label="$t('navbar.开门人员')" prop="pn"></table-column>
                      
                      </Table>

                
            </div>
        </div>
    </mu-drawer>
  </div>
</template>
<script>
import Nav from "@/components/nav_top";
import off_bg from '@/assets/remotedoor_off_bg.png'
import on_bg from '@/assets/remotedoor_on_bg.png';
import { Table, TableColumn } from "element-ui";

import {PersonalDoorGetDoorList,PersonalDoorAsyncOpenDoor,PersonalDoorGetDoorRecord} from '@/api/PersonalDoor.js'

export default {
  components: {
    Nav,Table,
    TableColumn
  },
  data() {
    return {
        open:false,
        DoorOff_on:on_bg,
        form:{},
        star:[],
        listData:[],
        listDataItem:{
          DoorSN:'',
          LctnName:'',
          Online:''
        },
        openDoor:false,
        MIMIList:[]
    };
  },
  created() {
    PersonalDoorGetDoorList().then(res=>{
      console.log(res);
      if(res.RetData){
        let arrdata = []
        let arr=[];
        let data=res.RetData;
        for (let index = 0; index < data.length; index++) {
          // console.log(data[index].Activity)
          if (data[index].Activity) {
            arrdata.unshift(data[index])
          } else {
            arrdata.push(data[index])
          }
        }
        // arrdata.unshift(ka)
        console.log(arrdata)
        for (let i = 0; i < arrdata.length; i++) {
          if (arrdata[i].Activity) {
            arr.push(true)
          } else {
            arr.push(false)
          }

        }


        this.listData=arrdata ;
      }
    }).catch(err=>{
      console.log(err);
    })
  },
  methods: {
      Doorinfo(e){
          this.open=true;
          console.log(this.listData[e]);
          this.listDataItem=this.listData[e]
      },
      gtouchstart(){
          this.DoorOff_on=off_bg;
          PersonalDoorAsyncOpenDoor({DoorID:this.listDataItem.DoorID}).then(res=>{
            console.log(res);
            if (res.RetCode==1){
              this.$toast.success({
                message: this.$t('Door.openDoorSuccess'),
                position: "top"
              });
            }
            if (res.ErrCode == -2) {
              this.$toast.error({
                message: this.$t('navbar.无此门权限'),
                position: "top"
              });
            }
            if (res.ErrCode == -3) {
              this.$toast.error({
                message: this.$t('navbar.门已离线开门失败'),
                position: "top"
              });
            }
            if (res.ErrCode == -4) {
              this.$toast.error({
                message: this.$t('navbar.查询不到此门的IP地址此门没有在账套服务器绑定'),
                position: "top"
              });
            }
          })
      },
      gtouchend(){
          this.DoorOff_on=on_bg;
      },
      starclick(idx){

          this.star[idx] = !this.star[idx];
          // console.log(this.data.star)
          let data = [...this.listData];
          data[idx].Activity = this.star[idx];
          
      },
      getopenDoorlist(){
        // console.log(this.listDataItem);
        this.openDoor=true;
        PersonalDoorGetDoorRecord({
          DoorID: this.listDataItem.DoorID,
          CustomerID: this.listDataItem.CustomerID
        }).then(res=>{
          console.log(res);
          this.MIMIList=res.RetData
        })
      }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  overflow: hidden;
  .wrap {
    height: calc(100% - 1.6rem);
    margin-top: 0.1067rem;
    overflow-y: auto;
    .imgBox {
      width: 100px;
      height: 137.5px;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
        height: 100%;
      }
      div {
        width: 100%;
        position: absolute;
        bottom: 0px;
        font-size: 0.3rem;
        height: 0.48rem;
        line-height: 0.48rem;
        background-color: rgba(99, 88, 88, 0.63);
        color: #fff;
        font-weight: 600;
      }
    }
  }
}
.mu-person-form {
  margin-top: 10px;
  width: 100%;
  .mu-form {
    width: 90%;
    div {
      margin-bottom: 0;
    }
  }
}
</style>
<style lang='scss'>
.dialog .mu-dialog .mu-dialog-body {
  height: 100%;
}
</style>
