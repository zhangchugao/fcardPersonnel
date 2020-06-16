import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import router from './router'
//
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import './style/iconfont/iconfont.css'

import VueI18n from 'vue-i18n';
Vue.use(VueI18n);
import {
  RSA_encrypt,
  RsaHashedKey
} from '@/utils/crypto_RSA_AES.js'
import Worker from "@/assets/rsakey.worker.js";

Vue.use(MuseUI);
//
import '@/icons/index.js'
import 'font-awesome/css/font-awesome.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'lib-flexible/flexible.js'
// import {
  // axios
// } from './js/axios'
import axios from 'axios'

// 页面加载进度
import 'muse-ui-progress/dist/muse-ui-progress.css';
import NProgress from 'muse-ui-progress';
Vue.use(NProgress);

import "element-ui/lib/theme-chalk/index.css";
import {
  Input,
  Button,
  Select,
  Option,
  Icon,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Checkbox,
  Form,
  FormItem,
  Table,
  TableColumn,
  Tabs,
  TabPane
} from 'element-ui';

Vue.prototype.$ELEMENT = {
  size: 'mini',
  zIndex: 3000
};
Vue.use(Input);
Vue.use(Button);
Vue.use(Select);
Vue.use(Icon);
Vue.use(Option);
Vue.use(Checkbox);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

import Toast from 'muse-ui-toast';
import Cookies from 'js-cookie';

Vue.use(Toast);


// 个人写的组件
// import Nav from './components/nav_top.vue'

Vue.config.productionTip = false

// Vue.component('Nav',Nav);
NProgress.start(); //加载条
NProgress.done();
NProgress.config({
  color: 'secondary', // color
  size: 2
});

function setparam(data) {
  var parmass1 = new URLSearchParams()
  for (var i in data) {
    parmass1.append(i, data[i]);
  }
  return parmass1
}

function getQueryString(name) {
  try {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    const urlObj = window.location;
    console.log(urlObj);
    var r = urlObj.href.indexOf('#') > -1 ? urlObj.hash.split("?")[1].match(reg) : urlObj.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2], "utf-8");
    return null;
  } catch (error) {
    return false;
  }

}
const ApiURL = ['']
if (process.env.NODE_ENV === 'production') {
  ApiURL[0] = 'WebAPI/'
} else {
  ApiURL[0] = 'api/WebAPI/'
}
// let ;
async function start() {
  let i18n, pro;
  let isGetlang, isGetEnlang;
  let messages = {},
    lsg = window.localStorage;


  //加载语言
  await axios({
    url: `${ApiURL[0]}LanguageLog/GetJson?LngType=zh&FileType=ui`,
    method: 'get'
  }).then(res => {
    console.log('-----------------------------------------------------------------------------------------');
    // console.log(res.data.RetData);
    let json = window.JSON.parse(res.data.RetData)

    // console.log(window.JSON.parse(res.data.RetData));
    messages = {
      en: {
        ...json
        // ...elementEnLocale
      },
      zh: {
        ...json,
        // ...elementZhLocale
      },
      'zh-CN': {
        ...json,
        // ...elementZhLocale
      },
      es: {
        ...json,
        // ...elementEsLocale
      }
    }

  }).catch(err => {
    console.error(err);
    isGetlang = true; //如果获取不到语言  则取用本地中文

  });
  if (isGetlang) {
    await import('./lang/zh.js').then(res => {
      console.log(res.default);
      messages = {
        en: {
          ...res.default,
          // ...elementEnLocale
        },
        zh: {
          ...res.default,
          // ...elementZhLocale
        },
        'zh-CN': {
          ...res.default,
          // ...elementZhLocale
        },
        es: {
          ...res.default,
          // ...elementEsLocale
        }
      }
    })
  }
  console.log(messages, 'messagesmessagesmessages');

  // 如果是不是中文则使用中文
  if (lsg.getItem('langitem') && lsg.getItem('langitem') != 'zh') {
    await axios({
      url: `${ApiURL[0]}LanguageLog/GetJson?LngType=${lsg.getItem('langitem')}&FileType=ui`,
      method: 'get'
    }).then(res => {

      let langjson = window.JSON.parse(res.data.RetData);
      let zh = messages[lsg.getItem('langitem')];


      // 判断其它语言不存在某个key用中文的key值替换
      for (let item in zh) {
        if (langjson[item]) {
          let copyzhitem = zh[item]
          for (let item1 in copyzhitem) {
            if (!langjson[item][item1]) {
              langjson[item][item1] = copyzhitem[item1]
            }
          }
        } else {
          //   console.log(zh[item]);
          langjson[item] = zh[item]
        }
      }
      messages[lsg.getItem('langitem')] = {
        ...messages[lsg.getItem('langitem')],
        ...langjson
      }
      store.dispatch('setLanguage', lsg.getItem('langitem'));
      console.log(messages, 'messagesmessagesmessages');
    }).catch(err => {
      console.error(err);
      isGetEnlang = true
      //如果获取不到语言  则取用本地中文
    });
  }
  if (isGetEnlang) {
    await import('./lang/en.UI.json').then(res => {
      console.log(res.default);
      let langjson = window.JSON.parse(res.default);
      let zh = messages[lsg.getItem('langitem')];


      // 判断其它语言不存在某个key用中文的key值替换
      for (let item in zh) {
        if (langjson[item]) {
          let copyzhitem = zh[item]
          for (let item1 in copyzhitem) {
            if (!langjson[item][item1]) {
              langjson[item][item1] = copyzhitem[item1]
            }
          }
        } else {
          //   console.log(zh[item]);
          langjson[item] = zh[item]
        }
      }
      messages[lsg.getItem('langitem')] = {
        ...messages[lsg.getItem('langitem')],
        ...langjson
      }
      store.dispatch('setLanguage', lsg.getItem('langitem'));
    })
  }

  i18n = new VueI18n({
    locale: lsg.getItem('langitem') ? lsg.getItem('langitem') : 'zh',
    messages
  });
  var ua = navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    let CustomerName = getQueryString('CustomerName'),
      UserName = getQueryString('UserName'),
      UserPassword = getQueryString('UserPassword'),
      authMode = getQueryString('authMode');
    let parma = {
      CustomerName: CustomerName,
      UserName: UserName,
      UserPassword: UserPassword,
      authMode: authMode,
    }
    // debugger;
    console.error(parma);
    wx.miniProgram.getEnv((res) => {
      if (res.miniprogram) {
        pro = true
      } else {
        pro = false
      }
    })
    let result = await new Promise(resolve => {
      setTimeout(() => {
        resolve(pro);
      }, 100);
    });

    if (true) {
      let url = `api/WebAPI/PersonalReportLogin/ClientLogin`;

      const params = [
        CustomerName,
        UserName,
        UserPassword,
      ];
      let RsaKey = {}
      if (window.crypto.subtle) {

        RsaHashedKey(2048, (pri, pub) => {
          RsaKey.public = pub;
          RsaKey.private = pri;
          console.log(RsaKey)
          // this.RsaKey = RsaKey;
        })

        let Loginciphertext = RSA_encrypt().encrypt(params.join(','));
        // console.log(RSA_encrypt().decrypt(Loginciphertext))
        let paramsjson = {
          Loginciphertext: Loginciphertext,
          authMode: authMode
        }
        let pdata = setparam(paramsjson);
        axios({
          url: url,
          data: pdata,
          method: 'post'
        }).then(res => {
          console.log(res);
          if (res.data.RetCode == 1) {
            router.push({
              path: 'Report'
            })
          } else {
            router.push({
              path: 'Home'
            })
          }

        }).catch(err => {
          router.push({
            path: 'Home'
          })
        })
        console.log(url, pdata);
      } else {
        var work = new Worker("./rsakey.worker.js");
        work.postMessage("100");
        // 监听消息
        work.onmessage = (event) => {
          // alert(event);
          console.log(event.data)
          let rsam = event.data
          let RsaKey = {}
          RsaKey.public = rsam.public;
          RsaKey.private = rsam.private;
          // this.RsaKey = RsaKey;
          let Loginciphertext = RSA_encrypt().encrypt(params.join(','));
          // console.log(RSA_encrypt().decrypt(Loginciphertext))
          let paramsjson = {
            Loginciphertext: Loginciphertext,
            authMode: authMode
          }
          let pdata = setparam(paramsjson);
          axios({
            url: url,
            data: pdata,
            method: 'post'
          }).then(res => {
            if (res.data.RetCode == 1) {
              router.push({
                path: 'Report'
              })
            } else {
              router.push({
                path: 'Home'
              })
            }
          }).catch(err => {
            router.push({
              path: 'Home'
            })
          })
          console.log(url, pdata);
        };
      }


    }
  }






  

  new Vue({
    store,
    router,i18n,
    render: h => h(App)
  }).$mount('#app')

}
start().then(res=>{
  console.log(res)
}).catch(err=>{
  console.log(err)
})