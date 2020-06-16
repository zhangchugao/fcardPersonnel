<template>
  <div class="home">
    <Nav></Nav>
    <div class="wrap">
      <mu-row justify-content="center">
        <div class="imgBox">
          <img ref="image" class="iamgePeople" v-bind:src="imgUrl" />
          <div @click="changeImg">{{$t('navbar.更换')}}</div>
        </div>
      </mu-row>
     
     
      <div class="mu-person-form">
        <mu-form ref="form" :model="form" label-width="80">
          <mu-form-item label-position="right" icon='flight_takeoff'>
            <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.姓名')}}:
            </template>
            <mu-text-field v-model="form.name"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right" icon='flight_takeoff'>
            <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.编号')}}:
            </template>
            <mu-text-field disabled v-model="form.PCode"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right"  icon='flight_takeoff'>
            <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.部门')}}:
            </template>
            <mu-text-field disabled  v-model="form.DeptName"></mu-text-field>
          </mu-form-item>

          <mu-form-item label-position="right" icon='flight_takeoff'>
            <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.卡号')}}:
            </template>
            <mu-text-field v-model="form.CardData"></mu-text-field>
          </mu-form-item>
         
          <mu-form-item label-position="right">
            <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.手机号')}}:
            </template>
            <mu-text-field v-model="form.MobilePhone"></mu-text-field>
          </mu-form-item>
           <mu-form-item label-position="right" icon='flight_takeoff'>
            <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.证件号')}}:
            </template>
            <mu-text-field v-model="form.IdentityCard"></mu-text-field>
          </mu-form-item>
          
          <mu-form-item label-position="right" >
             <template slot="label">
              <i class="el-icon-user"></i>　{{$t('navbar.地址')}}:
            </template>
            <mu-text-field v-model="form.addr"></mu-text-field>
          </mu-form-item>

          <!-- <mu-form-item label-position="right" label="data1:">
            <mu-text-field v-model="form.data1"></mu-text-field>
          </mu-form-item>

          <mu-form-item label-position="right" label="data2:">
            <mu-text-field type="password" v-model="form.data2"></mu-text-field>
          </mu-form-item>-->

          <!-- <mu-button color="primary" @click="submit" class="submit">更改密码</mu-button> -->
          <mu-button color="primary" @click="submit" class="submit">{{$t('navbar.更新信息')}}</mu-button>
          <!-- <div class="submit"> -->

          <!-- </div> -->
        </mu-form>
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
        <!-- <div class="edit-imag"> -->
          <!-- <vue-cropper
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
          ></vue-cropper> -->
          <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :autoCrop='true'
          :canScale='true'
          :fixed='false'
          :autoCropWidth='320'
          :autoCropHeight='440'
          :canMoveBox='false'
          :info="false"
          :fixedBox="true"
          :centerBox="false"
          mode="100% auto"></vueCropper>
        <div style="
          border: 2px dotted #44a8ff;
          width: 200px;
          height: 220px;
          position: absolute;
          top: 45%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%)">
        </div>
        </div>
        <mu-row justify-content="center" style="position:absolute;bottom:0;left:15vw;z-index:2008;">
          <label class="btn" for="uploads">{{$t('navbar.上传图片')}}</label>
          <input
            type="file"
            id="uploads"
            style="position:absolute; clip:rect(0 0 0 0);"
            accept="image/png, image/jpeg, image/gif, image/jpg"
            @change="uploadImg($event, 1)"
          />
          <button @click="rotateRight" class="btn">{{$t('navbar.图片旋转')}}</button>
          <button @click="finish('blob')" class="btn"> {{$t('navbar.确定')}} </button>
        </mu-row>
      <!-- </div> -->
    </mu-dialog>
  </div>
</template>
<script>
import Nav from "../components/nav_top";
// import { VueAvatar} from "vue-avatar-editor-improved";
import { VueCropper } from "vue-cropper";
import {
  ClientLogin,
  Information,
  SetInformation,
  SetUploadImage,
  GetOSSConfig,
  FaceDetectionNum,
  AliyunFaceDetection
} from "./../api/getdata.js";
import { log } from "util";
let base64_Pimage;
export default {
  components: {
    Nav,
    VueCropper
  },
  data() {
    return {
      openSimple: false,
      imgUrl: "",
      option: {
        img: "",
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
        name: "name",
        MobilePhone: "88888888",
        addr: "",
        pID: "",
        CardData: '',
        DeptName: "",
        IdentityCard: "",
        PCode: ''
      },
      fileurl:'',
      file: {}
    };
  },
  created() {
    Information().then(res => {
      console.log(res);
      this.form.pID = res.RetData.pID;
      this.form.name = res.RetData.PName;
      this.form.addr = res.RetData.Addr;
      this.form.MobilePhone = res.RetData.MobilePhone;
      this.form.CardData = res.RetData.CardData;
      this.form.DeptName = res.RetData.DeptName;
      this.form.IdentityCard = res.RetData.IdentityCard;
      this.form.PCode = res.RetData.PCode;
      
      this.fileurl=res.RetData.PImage;
      GetOSSConfig().then(data => {
        if (res.RetData.PImage.substring(0, 1) === '/') {
          this.imgUrl=`https://${data.RetData.BuckName}.${data.RetData.EndPoint}${res.RetData.PImage}`
        } else {
          this.imgUrl=`https://${data.RetData.BuckName}.${data.RetData.EndPoint}/${res.RetData.PImage}`
        }
       
      })

    });
  },
  mounted() {
    this.option.img = this.imgUrl;
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
      console.log('上传图片');
      var file = e.target.files[0];
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert(this.$t('Personnel.ImageType'));
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
                message: this.$t('Personnel.no_man_face'),
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
      // alert()
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
              AliyunFaceDetection({ base64: imgsrc }).then(data => {
                if (data.RetData === 1) {
                  // 上传图片到阿里云

                  let g_object_name =
                    CustomerName + "/People/" + this.form.pID + ".jpg";
                  GetOSSConfig().then(res => {
                    if (res.RetCode === 1) {
                      const request = new FormData();
                      request.append("OSSAccessKeyId", res.RetData.AccessKeyId);
                      request.append("policy", res.RetData.Policy);
                      request.append("Signature", res.RetData.Signature);
                      request.append("key", g_object_name);
                      request.append("success_action_status", "200");
                      request.append("file", this.file);
                      // const XML = new XMLHttpRequest();
                      // 图片直接上传到阿里云服务器
                      // debugger;
                      // XML.open(
                      //   "POST",
                      //   `https://${res.RetData.BuckName}.${res.RetData.EndPoint}`,
                      //   true
                      // );
                      // XML.onreadystatechange = function() {
                      //   if (XML.readyState === 4 && XML.status === 200) {
                      //     console.log("上传人员照片成功");
                      //   } else {
                      //     console.log("上传人员照片失败");
                      //   }
                      // };
                      // XML.send(request);
                      fetch(`https://${res.RetData.BuckName}.${res.RetData.EndPoint}`, {
                        body: request, // must match 'Content-Type' header
                        method: 'POST' // *GET, POST, PUT, DELETE, etc.
                      }).then(res=>{
                        console.log(res);
                        setTimeout(() => {
                        SetUploadImage({
                          PeopleID: this.form.pID,
                          sFileName: this.fileurl
                        }).then(res => {
                          console.log("关联人员照片成功");
                        }).catch(err=>{
                          console.log(err);
                          this.imgUrl = '';
                          
                        });
                      }, 1000);
                      })

                      
                    }
                  });
                } else {
                  this.$toast.warning({
                    message: this.$t('navbar.裁剪图片未包含人脸或人脸位置不居中'),
                    position: "top"
                  });
                  this.changeImg()
                }
              });
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
      // alert()
      let peoimg = document.querySelector(".iamgePeople");
      let that = this;
      let parma = {
        Addr: that.form.addr,
        MobilePhone: that.form.MobilePhone,
        PName: that.form.name,
        CardData: that.form.CardData,
        DeptName: that.form.DeptName,
        IdentityCard: that.form.IdentityCard,
        PCode: that.form.PCode,
        pID:that.form.pID
      };
      SetInformation(parma)
        .then(res => {
          console.log(res);
          if (res.RetCode == 1) {
            this.$toast.config({
              position: "top",
              time: 2000
            });
            this.$toast.success(this.$t('navbar.修改信息成功'));
          }
        })
        .catch(res => {
          console.log(res);
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
      width: 150px;
      height: 187.5px;
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
  box-shadow: 0px 0px 3px 1px #e6e6e6;
  padding: .6rem 0;
  .mu-form {
    width: 92%;
    margin-left: 4%;
    // border-top: 1px solid #e5e5e5;
    div {
      margin-bottom: 0;
      padding-bottom: 0;
      min-height: 35px;
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
  padding-top: 0px;
  overflow-y: auto;
  position: relative;
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
