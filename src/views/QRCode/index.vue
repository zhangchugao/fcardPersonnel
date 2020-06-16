<template>
  <div class="home">
    <Nav :title="$t('navbar.二维码门禁')"></Nav>
    <div class="wrap">
      <br/>
      <br/>
      <vue-qr :text="qrcode" :size="Qrpx" :callback='qrcallback' qid="testid"></vue-qr>
      <p>{{('navbar.二维码有限期')}}：{{Time}}</p>
      <div class="quickTime">
        <mu-button small @click="setTime(3)"	color="success">3{{$t('Att.minute')}}</mu-button>
        <mu-button small @click="setTime(15)"	color="success">15{{$t('Att.minute')}}</mu-button>
        <mu-button small @click="setTime(30)"	color="success">30{{$t('Att.minute')}}</mu-button>
        <mu-button small @click="setTime(60)"	color="success">60{{$t('Att.minute')}}</mu-button>

      </div>
      <br/>
      {{$t('navbar.其他时间设置')}}：
      <p>
        <mu-date-input :min-date='new Date()' @change='timeChange' icon="today" v-model="Time"  type="dateTime" full-width landscape></mu-date-input>
      </p>

      <div class="share">
        <p>
          <mu-button style="width:250px" @click="setTime(5)"	color="blue">{{$t("Common.refresh")}}</mu-button>
          <!-- <mu-button style="margin-left:10px" @click="DrawCanvas"	color="blue">分享二维码</mu-button> -->
        </p>
        
      </div>

      <mu-dialog  width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open.sync="openshare">
        <div class="imgBox">
          <canvas id="canvas" style="display:none"></canvas>
          <img style="width:calc(100% )" :src="DlQrUrl" alt="Qrimage">
        </div>
        <div style='text-align:center' >
          <p style="text-align:center;display:inline-block"><mu-button @click="openshare=false"	color="blue">{{$t("Common.shut_down")}}</mu-button></p>
         <p style="text-align:center;margin-left:10px;display:inline-block"><mu-button @click="downLoad(DlQrUrl)"	color="blue">{{$t("navbar.下载图片")}}</mu-button></p>
        </div>
        
      </mu-dialog>
    </div>
  </div>
</template>
<script>
import Nav from "./../../components/nav_top";
import { VueCropper } from "vue-cropper";
import VueQr from 'vue-qr';
import moment from 'moment'

import {
  Information
} from "@/api/getdata.js";
import getQrCode from '../../utils/getmm.js'
import qrBG from '@/assets/Feige图片.gif'
let base64_Pimage;
export default {
  components: {
    Nav,
    VueCropper,
    VueQr
  },
  data(){
    return{
      qrBG:qrBG,
      qrcode:'',
      qrTime:'',
      CardNum:'https://yun.pc15.net',
      Time:'',
      QrImage:'',
      openshare:false,
      QrTimeOut:null,
      Qrpx:'',
      DlQrUrl:''
    }
  },
  created(){
    Information().then(ress=>{
      this.CardNum=ress.RetData.CardData;
      this.Qrpx=this.convertRemToPixels(8)
      this.qrTime=new Date().getTime()+300000;
      this.Time=moment(this.qrTime).format('YYYY-MM-DD HH:mm:ss')
      getQrCode(new Date().getTime()+300000,this.CardNum,1).then(res=>{
        console.log(res);
        this.qrcode=res.toUpperCase()
        this.Clear5Timeout()
      })
    })
    
  },
  computed:{
    enDateFormat(){
      let getMonth = [this.$t('navbar.month1'),this.$t('navbar.month2'),this.$t('navbar.mont3'),this.$t('navbar.month4'),
                      this.$t('navbar.month5'),this.$t('navbar.month6'),this.$t('navbar.month7'),this.$t('navbar.month8'),
                      this.$t('navbar.month9'),this.$t('navbar.month10'),this.$t('navbar.month11'),this.$t('navbar.month12')]
      return {
        formatDisplay(){},
        formatMonth (date) {
          return `${getMonth[date.getMonth()]} ${date.getFullYear()}`;
        },
        getWeekDayArray () {},
        getMonthList(){}

      }
    }
  },
  methods:{
    setTime(n){
      this.qrTime=new Date().getTime()+n*60*1000;
      this.Time=moment(this.qrTime).format('YYYY-MM-DD HH:mm:ss')
      console.log(this.Time)
      getQrCode(this.qrTime,this.CardNum,1).then(res=>{
        this.qrcode=res.toUpperCase()
      })
      this.Clear5Timeout(n*60*1000)
    },
    qrcallback(dataUrl,id){
      this.QrImage=dataUrl;
    },
    Clear5Timeout(n=300000){
      clearInterval(this.QrTimeOut)
      setTimeout(() => {
        this.qrTime=new Date().getTime();
        this.Time=moment(this.qrTime).format('YYYY-MM-DD HH:mm:ss')
        getQrCode(this.qrTime,this.CardNum,1).then(res=>{
          this.qrcode=res.toUpperCase()
        })
        this.QrTimeOut=setTimeout(() => {
          this.qrTime=new Date().getTime()+5*60*1000;
          this.Time=moment(this.qrTime).format('YYYY-MM-DD HH:mm:ss')
          console.log(this.Time)
          getQrCode(this.qrTime,this.CardNum,1).then(res=>{
            this.qrcode=res.toUpperCase()
          })
        }, 300000);
      }, n);
    },
    timeChange(value){
      this.Time=moment(value).format('YYYY-MM-DD HH:mm:ss');
      this.qrTime=new Date(this.Time).getTime();
      console.log(this.qrTime);
      getQrCode(this.qrTime,this.CardNum,1).then(res=>{
        this.qrcode=res.toUpperCase()
        console.log(this.qrcode);
      })
    },
    convertRemToPixels(rem) {    
        return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
    },
    // 保存图片
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
        cxt.fillText(this.$t('navbar.二维码有限期'),canvas.width/2,canvas.width+30);
        cxt.fillText(that.Time,canvas.width/2,canvas.width+60);
        cxt.drawImage(img,0,0,canvas.width,canvas.width);
        let url =canvas.toDataURL('image/jpeg', 1);
        that.DlQrUrl=url
        // that.downLoad(url)
      }
    }
  }
}
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

</style>
<style lang='scss'>
.dialog .mu-dialog .mu-dialog-body {
  height: 100%;
}
.quickTime{
  button{
    min-width: 66px;
    margin: 0 5px;
  }
}
.share{
  p{
    margin: 10px 0;
  }
  button{
    min-width: 150px;
  }
}
.mu-dialog{
  .mu-dialog-body{
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
