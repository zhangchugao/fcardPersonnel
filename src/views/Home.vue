<template>
<div class="AppWarp login">

  <!-- <mu-container> 
        <div class="title">欢迎登陆</div>
        <mu-form ref="form" :model="validateForm" class="mu-demo-form" label-width='110'>
          <mu-form-item label-position='right' label="套账">
            <mu-text-field v-model="validateForm.CustomerName"></mu-text-field>
          </mu-form-item>
          
          <mu-form-item label-position='right' label="操作员：" v-if='people=="管理员" '>
              <mu-text-field v-model="validateForm.systemName"></mu-text-field>
          </mu-form-item>
         
          <mu-form-item label-position='right' label="身份类别" v-if='people=="个人" '>
              
              <mu-radio v-model="item" style="margin-right: 0px;" value="身份证" label="身份证"></mu-radio>
              <mu-radio v-model="item" style="margin-right: 0px;" value="卡号" label="卡号"></mu-radio>
              <mu-radio v-model="item" style="margin-right: 0px;" value="手机号" label="手机号"></mu-radio>
          </mu-form-item>
          <mu-form-item label-position='right' :label="'用户名/'+item" v-if='people=="个人"'>
              <mu-text-field  v-model="validateForm.username"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position='right' label="密码" v-if='people=="个人"&& item =="身份证"'>
              <mu-text-field type="password" v-model="validateForm.password"></mu-text-field>
          </mu-form-item>
           <mu-form-item label-position='right' label="密码" v-if='people=="个人"&& item =="卡号"'>
              <mu-text-field type="password" v-model="validateForm.password"></mu-text-field>
          </mu-form-item>
          
          <mu-form-item label-position='right' label="密码" v-if='people=="个人"&& item =="手机号"'>
              <mu-text-field type="password" v-model="validateForm.password"></mu-text-field>
          </mu-form-item>
          <div class="submit">
            <mu-button color="primary" @click="submit">提交</mu-button>
          </div>
        </mu-form>
      </mu-container> -->
  <!-- <mu-container>
        1231311 -->
  <div style="width:100%;height:100%;overflow:hidden">
    <div class="topPer">
      <a href="https://yun.pc15.net/WebUIV2/phone/index.html#/">{{$t('Common.切换系统管理')}}</a>
    </div>
    <div class="login_img">
      <img :src="language_lang=='zh'?title_zh:title_en" alt />
    </div>
    <div class="login_from">
      <div class="login_from_box">
        <div>
          <p style="padding-top:.4rem;font-size:0.4333rem;color: #3f98f3;font-weight: 600;position:relative">
            {{ $t('Common.Welcome_to_login') }}
            <LangSelect style="position: absolute;right:0;" />
          </p>
          <el-input v-model="validateForm.CustomerName" size="small" name="username" type="text" auto-complete="off" :placeholder="$t('navbar.account')">
            <span class="label_num" slot="prefix">{{$t('navbar.account')}}</span>
          </el-input>

          <el-select v-model="item" size="small" :placeholder="$t('Common.please_choose')" class="select_system operater">
            <el-option v-for="(item,index) in [$t('Common.imgTips6'),$t('Common.卡号或编号'),$t('Common.phone_number')]" :key="index" :label="item" :value="item"></el-option>
            <span class="label_num" slot="prefix">{{$t('Common.登录类型')}}</span>
          </el-select>
          <!-- {{item+'----'+$t('Common.卡号或编号')}} -->
          <el-input v-model="validateForm.username" size="small" name="username" type="text" auto-complete="off" :placeholder="$t('Common.please_enter')+item">
            <span class="label_num" slot="prefix">{{(item==$t('Common.卡号或编号'))?$t('Common.卡号/编号'):item}}</span>
          </el-input>
          <el-input :type="pwdType" size="small" v-model="validateForm.password" name="password" auto-complete="off" placeholder="password">
            <span class="label_num" slot="prefix">{{$t('Sys.UserPassword')}}</span>
            <i slot="suffix" class="el-input__icon" @click="showPwd">
              <svg-icon icon-class="eye" />
            </i>
          </el-input>

        </div>
      </div>
    </div>
    <div class="login_state">
      <!-- {{$t('Common.drop_out')}} -->
      <el-checkbox style="color:#fff;float:left;" v-model="checked">{{$t('Common.Remember_the_login_status')}}</el-checkbox>
    </div>
    <div class="login_serve_state" style="color:lime">
      {{$t('Common.Server_connection_is_normal')}}</div>
    <div class="login_submit">
      <mu-button style="width:100%;margin-top:30px;" color="primary" @click="submit">{{$t('Common.Determine')}}</mu-button>
    </div>
  </div>
  <!-- </mu-container> -->
</div>
</template>

<script>
import axios from 'axios'
import {
  ClientLogin
} from '@/api/getdata.js'

import titleZH from '@/assets/title.png';
import titleEN from '@/assets/title_en.png';
import 首页 from '@/assets/首页.png';
import LangSelect from "@/components/LangSelect";
import {
  RSA_encrypt,
  RSA,
  SHA256,
  RsaHashedKey
} from '@/utils/crypto_RSA_AES.js'
import Worker from "@/assets/rsakey.worker.js";
export default {
  name: 'home',
  components: {
    LangSelect
  },
  data() {
    return {
      validateForm: {
        CustomerName: '',
        username: '',
        password: '',
        systemName: '',
        isAgree: false,
        language_lang: 'zh'
      },
      checked: true,
      people: this.$t('Common.个人'),
      // arrpeople:['管理员','个人'],
      
      language_lang: 'zh',
      title_zh: titleZH,
      title_en: titleEN,
      首页: this.$t('navbar.dashboard'),
      pwdType: 'password',
      RsaKey: null
    }
  },
  computed:{
    item:{
      get(){return this.$t('Common.卡号或编号')},
      set(){return this.$t('Common.卡号或编号')}
      
    }
  },
  created() {
    console.log('0000');
    if (window.crypto.subtle) {
      let RsaKey = {}
      RsaHashedKey(2048, (pri, pub) => {
        RsaKey.public = pub;
        RsaKey.private = pri;
        console.log(RsaKey)
        this.RsaKey = RsaKey;
      })
    } else {
      var work = new Worker("./rsakey.worker.js");
      work.postMessage("100");
      // 监听消息
      work.onmessage = (event) => {
        console.log(event.data)
        let rsam = event.data
        let RsaKey = {}
        RsaKey.public = rsam.public;
        RsaKey.private = rsam.private;
        this.RsaKey = RsaKey;
      };
    }
  },
  mounted() {
    let localStoraged = window.localStorage;
    if (localStoraged.getItem('LoginState') == 'true') {
      this.checked = true;
      this.validateForm.CustomerName = localStoraged.getItem('CustomerName');
      this.validateForm.username = localStoraged.getItem('UserName');
      this.validateForm.password = localStoraged.getItem('UserPassWord');
      this.item = localStoraged.getItem('authMode');
    } else {
      localStoraged.setItem('LoginState', false);
      this.validateForm.CustomerName = '';
      localStoraged.removeItem('CustomerName', '');
      this.validateForm.username = '';
      localStoraged.removeItem('UserName', '');
      this.validateForm.password = '';
      localStoraged.removeItem('UserPassWord', '');
      this.item = this.$t('Common.卡号或编号');
      localStoraged.removeItem('authMode', '');
    }
  },
  methods: {
    setPeople(value) {
      this.people = value;
    },
    setItem(value) {
      this.item = value;
    },
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    submit() {
      //  console.log(this.$router.path)
      //  this.$router.push({path:'Index'})
      // validateForm.username
      let authMode = 1;
      if (this.item == this.$t('Common.imgTips6')) {
        authMode = 1;
      } else if (this.item == this.$t('Common.卡号或编号')) {
        authMode = 2;
      } else {
        authMode = 3;
      }
      if (this.validateForm.CustomerName === '') {
        this.$toast.warning({
          message: this.$t('Common.Please_enter_the_name_of_the_set_of_books'),
          position: 'top'
        })
        return
      }
      if (this.validateForm.username === '') {
        this.$toast.warning({
          message: this.$t('Common.请输入卡号或编号'),
          position: 'top'
        })
        return
      }
      if (this.validateForm.password === '') {
        this.$toast.warning({
          message: this.$t('Common.Please_enter_your_password'),
          position: 'top'
        })
        return
      }
      window.sessionStorage.setItem('CustomerName', this.validateForm.CustomerName)
      var parma = {
        CustomerName: this.validateForm.CustomerName,
        UserName: this.validateForm.username,
        UserPassWord: this.validateForm.password,
        authMode: authMode
      }
      const params = [
        this.validateForm.CustomerName,
        this.validateForm.username,
        this.validateForm.password,
      ];
      let Loginciphertext = RSA_encrypt().encrypt(params.join(','));
      // console.log(RSA_encrypt().decrypt(Loginciphertext))
      let paramsjson = {
        Loginciphertext: Loginciphertext,
        authMode: authMode
      }
      let localStoraged = window.localStorage;
      // if (this.checked) { // 都将这些先存储起来
      if (true) {
        localStoraged.setItem('LoginState', true);
        localStoraged.setItem('CustomerName', this.validateForm.CustomerName);
        localStoraged.setItem('UserName', this.validateForm.username);
        localStoraged.setItem('UserPassWord', this.validateForm.password);
        localStoraged.setItem('authMode', this.item);
      } else {
        localStoraged.setItem('LoginState', false);
      }

      // if(this.people=='个人'){

      ClientLogin(paramsjson).then(res => {
        this.$router.push({
          path: 'Index'
        });
      }).catch(err => {
        //  console.error(err);
        this.$toast.config({
          position: 'top',
          time: 2000,
        })
        this.$toast.error(err.ErrDesc);
      })
      // }else{
      //   window.location.href= `../Login/login.html?CustomerName=${this.validateForm.CustomerName}&systemName=${this.validateForm.systemName}`
      // }
    },
    clear() {
      this.$refs.form.clear();
      this.validateForm = {
        username: '',
        password: '',
        isAgree: false
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 95%;
  height: 100%;
  box-sizing: border-box;
  margin: auto;
  position: relative;

  .container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .title {
      font-size: 20px;
      font-weight: 600;
    }
  }

  .submit {
    text-align: center;

    button {
      margin: 0 5px;
    }
  }
}

.mu-form-item-content {
  justify-content: space-around;
}

.mu-demo-form {
  width: 100%;
  max-width: 460px;
}

.container form {
  margin: auto;
}
</style>
<style lang="scss" scoped>
.login_serve_state {
  margin: auto;
  margin-top: 0.2867rem;
}

* {
  touch-action: pan-y;
}

.login_img {
  margin: auto;
  margin-top: 2.4667rem;
  width: 6.6533rem;

  img {
    width: 100%;
  }
}

.login_from {
  width: 9.2rem;
  // height: 4.3067rem;
  padding: 0.15rem 0.16rem;
  // background-color: #66afe2;
  border-radius: 0.1333rem;
  margin: auto;
  margin-top: 0.5333rem;
  box-sizing: border-box;

  .login_from_box {
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 0.1067rem;

    >div {
      margin: auto;
      width: 7.9467rem;

      >div {
        margin-top: 0.4rem;

        &:nth-last-child(1) {
          margin-bottom: 0.4rem;
        }
      }
    }
  }
}

.login_state {
  overflow: hidden;
  margin: auto;
  margin-top: 0.3733rem;
  width: 8.8rem;
}

.login_serve_state {
  margin: auto;
  margin-top: 0.2867rem;
}

.login_submit {
  width: 8.0rem;
  margin: auto;
  margin-top: 0.44rem;
}

.signin {
  // background-color: #fff;
  // padding: 10px;
  overflow: hidden;
  position: relative;

  // top: 10%; /*偏移*/
  .login_from {
    width: 100%;
    box-sizing: border-box;

    .login_from_box {
      width: 100%;
      padding: 0 0.1333rem;
      box-sizing: border-box;

      >div {
        width: 100%;

        >div {
          margin-top: 0.2rem;
        }
      }
    }
  }
}

.signinsub {
  margin: auto;
  position: relative;

  .login_submit {
    width: 100%;
    margin: auto;
    /*margin-top: 0.44rem;*/
    margin-top: 0.2rem;
  }
}

.forgetPwd {
  background-image: url("./../assets/首页.png");
  background-size: cover;
}

@media screen and (max-width: 374px) {
  .signin {
    width: 80%;
    margin: auto;
  }

  .signinsub {
    width: 80%;
  }
}

@media screen and (min-width: 374px) {
  .signin {
    width: 9.3333rem;
    margin: auto;
  }

  .signinsub {
    width: 9.3333rem;
  }
}

.topPer {
  position: fixed;
  top: 0.5rem;
  right: .1rem;
  user-select: none;
  outline: none;
  -webkit-appearance: none;
  border-radius: 3px;
  background-color: #52b0f9;
  background-image: -webkit-linear-gradient(180deg, #52b0f9 25%, #4799ff 100%);
  background-image: -moz-linear-gradient(180deg, #52b0f9 25%, #4799ff 100%);
  background-image: -o-linear-gradient(180deg, #52b0f9 25%, #4799ff 100%);
  background-image: linear-gradient(180deg, #52b0f9 25%, #4799ff 100%);

  >a {
    display: inline-block;
    padding: 5px 7px;
    color: #fff;
  }
}
</style>

<style lang="scss">
.AppWarp.login {
  height: 100%;
  max-width: 1024px;
  margin: auto;
  background-image: url("./../assets/首页.png");
  background-size: cover;
  overflow: hidden;

  .el-input--prefix,
  .select_system.operater {
    width: 100%;
    border-radius: 4px;

    .el-input__prefix {
      width: 80px;
      height: 32px;
      line-height: 32px;

      .label_num {
        display: block;
        margin-top: 6.5px;
        border-right: 1px solid #b9b9b9;
        height: 21px;
        line-height: 21px;
        color: #757575;

        widows: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .login_from .el-input--prefix .el-input__inner {
    padding-left: 90px;
    border-radius: 4px;
  }

  .el-input {
    .el-input__suffix {
      right: 15px;
    }
  }

  .login_state {
    .el-checkbox {
      margin: 0;

      .el-checkbox__label {
        font-size: 10px;
      }
    }
  }
}

.signin {
  .el-form {
    margin: 10px;
    margin-bottom: 0;
    padding: 10px;
    padding-bottom: 0;
    background: #fff;
  }
}

.operater .el-scrollbar {
  overflow-y: auto;
}
</style>
