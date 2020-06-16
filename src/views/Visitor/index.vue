<template>
  <div class="home">
    <Nav title="来访授权"></Nav>
    <div class="wrap">
      <mu-row justify-content="center">
        <div class="imgBox">
          <img ref="image" class="iamgePeople" v-bind:src="imgUrl" />
          <div @click="changeImg">{{$t('navbar.更换')}}</div>
        </div>
      </mu-row>
      
      <mu-row justify-content="center" class="mu-person-form">
        <mu-form ref="form" :model="form" label-width="80">
          <mu-form-item label-position="right" :label="$t('Vis.VisitorName')+':'">
            <mu-text-field v-model="form.VisitorName"></mu-text-field>
          </mu-form-item>

          <mu-form-item label-position="right" :label="$t('navbar.手机号')+':'">
            <mu-text-field v-model="form.Phone"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right" :label="$t('navbar.证件号')+':'">
            <mu-text-field v-model="form.VisitorCardNo"></mu-text-field>
          </mu-form-item>
          
          <mu-form-item label-position="right" :label="$t('navbar.被访人')+':'">
            <mu-text-field v-model="form.Interviewee"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right" :label="$t('navbar.事由')+':'">
            
            <mu-select label="" v-model="form.Reason" full-width>
              <mu-option v-for="(option,index) in [$t('navbar.公事'),$t('navbar.快递'),$t('navbar.私事'),$t('navbar.外卖'),$t('navbar.其它')]" :key="index" :label="option" :value="option"></mu-option>
            </mu-select>
            <!-- <mu-text-field v-model="form.Reason"></mu-text-field> -->
          </mu-form-item>
          <mu-form-item label-position="right" :label="$t('navbar.备注')+':'">
            <mu-text-field v-model="form.Remark"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right" :label="$t('table.有效期')+':'" >
            <mu-select label="" v-model="Expiryid" full-width>
              <mu-option v-for="(option,index) in Expiry" :key="index" :label="option.val" :value="option.id"></mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item label-position="right" :label="$t('navbar.权限组')+':'">
            <!-- <mu-text-field v-model="form.AccessID"></mu-text-field> -->
            <mu-select label="" v-model="form.AccessID" full-width>
              <mu-option v-for="(option,index) in Access" :key="index" :label="option.GroupName" :value="option.AccessID"></mu-option>
            </mu-select>
          </mu-form-item>
         <mu-form-item label-position="right" :label="$t('Vis.Address')+':'" >
            <mu-text-field v-model="form.Address"></mu-text-field>
          </mu-form-item>
        </mu-form>
      </mu-row>
      <div style="margin:10px 0; width:100%;">
        <mu-button style="width:40%;" color="primary" @click="submit" >{{$t('navbar.添加访客')}}</mu-button>
        <mu-button style="margin-left:15px;width:40%;" color="primary" @click="VisListopen" >{{$t('navbar.访客列表')}}</mu-button>
      </div>
    </div>

    <mu-dialog
      width="360"
      :open.sync="openSimple"
      :fullscreen="true"
      v-if="openSimple"
      class="dialog"
    >
      <mu-appbar color="teal">
        <mu-button icon slot="left" @click="closeSimpleDialog">
          <mu-icon value="arrow_back"></mu-icon>
        </mu-button>{{$t('navbar.更换头像')}}
      </mu-appbar>
      <div class="dialog_wrap">
        <div class="edit-imag">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            @real-time="realTime"
            :high="option.high"
            @img-load="imgLoad"
          ></vue-cropper>
        </div>
        <mu-row justify-content="center">
          <label class="btn" for="uploads">{{$t('navbar.上传图片')}}</label>
          <input
            type="file"
            id="uploads"
            style="position:absolute; clip:rect(0 0 0 0);"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event, 1)"
          />
          <button @click="rotateRight" class="btn">{{$t('navbar.图片旋转')}}</button>
          <button @click="finish('blob')" class="btn">{{$t('navbar.确定')}}</button>
        </mu-row>
      </div>
    </mu-dialog>

    <mu-drawer :open.sync="VisList" :docked="false" width='100%' :right="true">

    </mu-drawer>

  </div>
</template>
<script>
import Nav from "@/components/nav_top";
// import { VueAvatar} from "vue-avatar-editor-improved";
import { VueCropper } from "vue-cropper";
import write from '@/assets/write.png'

import {
  FaceDetectionNum,Information
} from "@/api/getdata.js";
import {
  PersonalVisitorAddVisitor,PersonalVisitorGetDoorValidType,PersonalVisitorGetVisitorList,PersonalVisitorGetAccessGroup
} from "@/api/PersonalDoor.js";
import { log } from "util";
import moment from 'moment'

let base64_Pimage;
export default {
  components: {
    Nav,
    VueCropper
  },
  data() {
    return {
      openSimple: false,
      imgUrl: write,
      option: {
        img: write,
        size: 1,
        full: false,
        outputType: "png",
        canMove: true,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 200,
        autoCropHeight: 275,
        centerBox: false,
        high: true
      },
      form: {
        VisitorName: "",//姓名
        Reason: '公事',//事由
        Remark: "",//备注
        Phone: "",//手机号
        VisitorCardNo: "",//证件号
        AccessID: '',//权限组ID
        Expiry: '',//有效期
        Interviewee: "",//被访人
        Address: "",
        base64:''
      },
      Expiryid:1,
      Access:[],
      Expiry:[
        {id:1,val:'今天内'},{id:2,val:'明天23:59:59前'},{id:3,val:'本周内'}
      ],
      file: {},
      VisList:false
    };
  },
  created() {
   this.form.Reason=this.$t('navbar.公事');
    this.Expiry = [{id:1,val:this.$t('navbar.今天内')},{id:2,val:this.$t('navbar.t235959')},{id:3,val:this.$t('navbar.本周内')}]
  },
  mounted() {
    this.option.img = write;
     Information().then(res=>{
        console.log(res);
        this.form.Interviewee=res.RetData.PName
        // console.log(this.form);
      }).catch(err=>{
        console.log(err);
      })
    setTimeout(() => {
      PersonalVisitorGetAccessGroup().then(res=>{
        if(res.RetData){
          if(res.RetData.length>0){
            this.Access=res.RetData;
            this.form.AccessID=res.RetData[0].AccessID;
            PersonalVisitorGetDoorValidType({AccessID:1}).then(data=>{
              console.log(data);
            })
          }
        }
      })
    }, 1000);
    
  },
  methods: {
    openSimpleDialog() {
      this.openSimple = true;
    },
    closeSimpleDialog() {
      this.openSimple = false;
    },
    changeImg() {
      //更换图片
      this.openSimple = true;
      this.option.img = this.imgUrl;
    },
    uploadImg(e, num) {
      //上传图片
      // this.option.img
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        data = window.URL.createObjectURL(new Blob([e.target.result]));
        let img = new Image();
        img.src = data;
        img.onload = () => {
          let src = this.compressImage(img);
          FaceDetectionNum({
            base64: src
          }).then(res => {
            if (res.RetData === 1) {
              console.log("有人脸");
              if (num === 1) {
                this.option.img = data;
              } else if (num === 2) {
                this.example2.img = data;
              }
            } else {
              console.log("无人脸");
              this.$toast.warning({
                message: "未检测到人脸",
                position: "top"
              });
            }
          });
        };
      };
      // 转化为base64
      // var reader = new FileReader();
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    },
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    realTime(data) {
      this.previews = data;
      console.log(data);
    },
    imgLoad(msg) {
      console.log(msg);
    },
    finish(type) {
      // 输出
      // var test = window.open('about:blank')
      // test.document.body.innerHTML = '图片生成中..'
      let that = this;
      if (type === "blob") {
        this.$refs.cropper.getCropBlob(data => {
          console.log(data);
          this.file = new window.File([data], "imgFile", { type: "jpeg" });
          var img = window.URL.createObjectURL(data);
          let imgsrc;
          let CustomerName = window.sessionStorage.getItem("CustomerName");
          var reader = new FileReader(); //本地预览
          reader.readAsDataURL(data);
          reader.onload = () => {
            imgsrc = reader.result;
            let imgs = new Image();
            imgs.src = imgsrc;
            imgs.onload = () => {
              let width = 440;
              let height = (440 * imgs.naturalHeight) / imgs.naturalWidth;
              let c = document.createElement("canvas");
              let ctx = c.getContext("2d");
              c.width = width;
              c.height = height;
              ctx.drawImage(imgs, 0, 0, width, height);
              imgsrc = c.toDataURL("image/png");
              let VisImg=this.compressImage(imgs);
              this.form.base64=VisImg
              console.log(VisImg);
            };
          };

          
          this.$refs.image.src = img;
          
          this.imgUrl = img;
          this.openSimple = false;
        });
      } else {
        this.$refs.cropper.getCropData(data => {
          //   this.model = true
          this.$refs.image.src = data;
          this.openSimple = false;
        });
      }
    },
    submit() {
      if(this.Expiryid==1){
        this.form.Expiry=moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')
      }
      if(this.Expiryid==2){
        this.form.Expiry=moment().endOf('days').add(1,'day').format('YYYY-MM-DD HH:mm:ss')
      }
      if(this.Expiryid==3){
        this.form.Expiry=moment().endOf('week').add(1,'day').format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.form.VisitorName===''){
        this.$toast.warning(this.$t('Vis.atips1'))
        return
      }
      if (this.form.VisitorName===''){
        this.$toast.warning(this.$t('Vis.atips1'))
        return
      }
      if (this.form.Address===''){
        this.$toast.warning($t('Patrol.please_input_address'))
        return
      }
      if (this.form.AccessID===''){
        this.form.AccessID=0;
      }
      if (!(this.form.Phone != '' && this.form.VisitorCardNo != '')) {
        this.$toast.warning(this.$t('navbar.请输入手机号或者证件号'));
        return
      }
      let d;
      if (this.form.Phone !== ''){
        if (d = /^[1][3,4,5,7,8][0-9]{9}$/, !1 === d.test(this.form.Phone)) return void this.$toast.warning(this.$t('Personnel.validPhone'));
      }
      if (this.form.VisitorCardNo !== '') {
        if (d = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, !1 === d.test(this.form.VisitorCardNo)) return void this.$toast.warning('请输入正确的证件号');
      }
      if (this.form.Interviewee === '') {
        this.$toast.warning(this.$t('navbar.请输入被访公司或人员'))
        return
      }
      console.log(this.form);
      // return;
      PersonalVisitorAddVisitor(this.form)
        .then(res => {
          console.log(res);
          if (res.RetCode == 1) {
            this.$toast.config({
              position: "top",
              time: 2000
            });
            this.form=this.$options.data().form;
            this.imgUrl=write;
            this.$toast.success(this.$t('navbar.修改信息成功'));
            this.form.AccessID=this.Access[0].AccessID
          }else{
            this.$toast.warning(res.ErrDesc);
          }
        })
        .catch(res => {
          console.log(res);
          this.$toast.warning(res.ErrDesc);
        });
    },
    compressImage(img) {
      // 截取图片
      console.log(img.size);
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      // 瓦片canvas
      const tCanvas = document.createElement('canvas')
      const tctx = tCanvas.getContext('2d')
      const initSize = img.src.length
      let width = img.width
      let height = img.height
      // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio
      if ((ratio = (width * height) / 4000000) > 1) {
        // this.$message({
        //   message: this.$t('Personnel.MoreThan4MillionPixels'),
        //   type: 'warning'
        // })
        ratio = Math.sqrt(ratio)
        width /= ratio
        height /= ratio
      } else {
        ratio = 1
      }
      canvas.width = width
      canvas.height = height
      // 铺底色
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      // 如果图片像素大于100万则使用瓦片绘制
      let count
      if ((count = (width * height) / 1000000) > 1) {
        console.log('超过100W像素')
        count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
        //            计算每块瓦片的宽和高
        const nw = ~~(width / count)
        const nh = ~~(height / count)
        tCanvas.width = nw
        tCanvas.height = nh
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height)
      }
      // 进行最小压缩
      const ndata = canvas.toDataURL('image/jpeg', 0.5)
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
      return ndata
    },
    VisListopen(){
      this.$router.push({path:`Vis?item=${this.$t('Personnel.Vismenber')}`})
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
.edit-image {
  height: 500px;
}
.mu-person-form {
  width: 94%;
  margin-top: .3rem;
  background-color: #fff;
  margin-left: 3%;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 3px 1px #e6e6e6;
  box-shadow: 0px 0px 3px 1px #e6e6e6;
  padding: .6rem 0;
  .mu-form {
    width: 90%;
    div {
      margin-bottom: 0;
      padding-bottom: 0;
      min-height:35px;
    }
  }
}
.submit {
  position: relative;
  margin-top: 1.4rem;
  width: 90%;
}
//
.edit-imag {
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.c-item {
  max-width: 800px;
  margin: 10px auto;
  margin-top: 20px;
}

.content {
  margin: auto;
  max-width: 1200px;
  margin-bottom: 100px;
}

.test-button {
  display: flex;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
}

.btn {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #c0ccda;
  color: #1f2d3d;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 20px 10px 0px 0px;
  padding: 9px 15px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  background-color: #50bfff;
  border-color: #50bfff;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.des {
  line-height: 30px;
}

code.language-html {
  padding: 10px 20px;
  margin: 10px 0px;
  display: block;
  background-color: #333;
  color: #fff;
  overflow-x: auto;
  font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo,
    Lucida, Sans, Type, Writer, Ubuntu, Mono;
  border-radius: 5px;
  white-space: pre;
}

.show-info {
  margin-bottom: 50px;
}

.show-info h2 {
  line-height: 50px;
}

/*.title, .title:hover, .title-focus, .title:visited {
        color: black;
      }*/

.title {
  display: block;
  text-decoration: none;
  text-align: center;
  line-height: 1.5;
  margin: 20px 0px;
  background-image: -webkit-linear-gradient(
    left,
    #3498db,
    #f47920 10%,
    #d71345 20%,
    #f7acbc 30%,
    #ffd400 40%,
    #3498db 50%,
    #f47920 60%,
    #d71345 70%,
    #f7acbc 80%,
    #ffd400 90%,
    #3498db
  );
  color: transparent;
  -webkit-background-clip: text;
  background-size: 200% 100%;
  animation: slide 5s infinite linear;
  font-size: 40px;
}
.test {
  height: 500px;
}
.model {
  position: fixed;
  z-index: 10;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.8);
}
.model-show {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.model img {
  display: block;
  margin: auto;
  max-width: 80%;
  user-select: none;
  background-position: 0px 0px, 10px 10px;
  background-size: 20px 20px;
  background-image: linear-gradient(
      45deg,
      #eee 25%,
      transparent 25%,
      transparent 75%,
      #eee 75%,
      #eee 100%
    ),
    linear-gradient(45deg, #eee 25%, white 25%, white 75%, #eee 75%, #eee 100%);
}
.c-item {
  display: block;
  user-select: none;
}
@keyframes slide {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: -100% 0;
  }
}

.dialog_wrap {
  width: 100%;
  height: calc(100% - 56px);
  padding-top: 30px;
  overflow-y: auto;
  .row {
    margin-bottom: 30px;
  }
}
</style>
<style>
.dialog .mu-dialog .mu-dialog-body {
  height: 100%;
}
</style>
