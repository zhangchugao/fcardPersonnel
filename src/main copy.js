import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
//
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';


Vue.use(MuseUI);
//
import 'font-awesome/css/font-awesome.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'lib-flexible/flexible.js'
import {
  axios
} from './js/axios'
import Axios from 'axios'

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
  Checkbox,
  Form,
  FormItem,
  Table,
  TableColumn,
  Tabs,
  TabPane
} from 'element-ui';

Vue.prototype.$ELEMENT = { size: 'mini', zIndex: 3000 };
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
  ApiURL[0] = 'WebAPI'
} else {
  ApiURL[0] = 'api'
}
async function start() {
  let pro;
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
  console.log(parma);
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

  console.log(result);
  if (true) {
    let url = `api/WebAPI/PersonalReportLogin/ClientLogin`;
    let pdata = setparam(parma);
    Axios({url:url,data:pdata,method:'post'}).then(res=>{
      console.log(res);
      router.push({path:'Report'})
    })
    console.log(url, pdata);
  }

  // console.log(Cookies.get('Login-Out'));
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')

}
var ua = navigator.userAgent.toLowerCase();
if (ua.match(/MicroMessenger/i) == "micromessenger") {
  //ios的ua中无miniProgram，但都有MicroMessenger（表示是微信浏览器）
  start()
} else {
  console.log(Cookies.get('Login-Out'));
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app')
}
