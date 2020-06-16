<template>
  <el-dropdown trigger="click" class="international" @command="handleSetLanguage">
    <div>
      <span class="international-icon iconfont icon-language" icon-class="icon-language"></span>
    </div>
    <el-dropdown-menu slot="dropdown">
      <!-- <el-dropdown-item :disabled="language==='zh'||language==='zh-CN'" command="zh">中文</el-dropdown-item> -->
      <el-dropdown-item v-for="item in langs" :key="item.LngType" :disabled="language===item.LngType" :command="item.LngType"><svg-icon :icon-class="langIcon[item.LngType]?langIcon[item.LngType]:''" />　{{item.LngName}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
// import request from '@/utils/axios'
import axios from 'axios'
const ApiURL=['']
if(process.env.NODE_ENV === 'production'){
    ApiURL[0]='WebAPI/'
}else{
    ApiURL[0]='api/WebAPI/'
}
export default {
  data(){
    return{
      langs:[
        {LngType: "zh", LngName: "中文", LngPWD: "", SrclngType: ""},
        {LngType: "en", LngName: "English", LngPWD: "", SrclngType: "zh"}
      ],
      langIcon:{
        zh:'China',
        en:'英国',
        JP:'日本',
        fa:'波斯利亚和黑塞维那',
        th:'泰国',
        nk:'朝鲜',
        fr:'法国',
        'ru-RU':'俄罗斯',
        es:'西班牙',
        id:'india',
        da:'德国',
      }
    }
  },
  computed: {
    language() {
      console.log(this.$store.getters.language,'this.$store.getters.languagethis.$store.getters.language');
      return this.$store.getters.language
    }
  },
  created(){
    axios({url:`${ApiURL[0]}/LanguageType/GetAll`,method: 'get'}).then(res=>{
      console.error(res);
      if(res.data.RetCode==1){
        this.langs=res.data.RetData
        sessionStorage.setItem('langList', JSON.stringify(this.langs))
      }

    }).catch(err=>{console.log(err);})
  },
  methods: {
    async handleSetLanguage(lang) {//处理设置语言
      console.log(lang);
      try {
        let lsg=window.localStorage,islang;
      if(lang!='zh'){
        lsg.setItem('langitem',lang)
        await axios({url:`${ApiURL[0]}LanguageLog/GetJson?LngType=${lsg.getItem('langitem')}&FileType=ui`,method:'get'}).then(res=>{
          // console.log('-----------------------------------------------------------------------------------------');
          console.log(res);
          // console.log(messages[lsg.getItem('langitem')],res.data);

          let langjson=window.JSON.parse(res.data.RetData);
          let zh=this.$i18n.getLocaleMessage(lang);


          // 判断其它语言不存在某个key用中文的key值替换
          for(let item in zh){
            if(langjson[item]){
              let copyzhitem=zh[item]
              for(let item1 in copyzhitem){
                if(!langjson[item][item1]){
                  langjson[item][item1]=copyzhitem[item1]
                }
              }
            }else{
            //   console.log(zh[item]);
              langjson[item]=zh[item]
            }
          }

          this.$i18n.setLocaleMessage(lang, langjson);
          this.$i18n.locale = lang;
          this.$store.dispatch('setLanguage', lang)
          console.log(this.$i18n.getLocaleMessage(lang));
          this.$toast.success({
                message: 'success',
                position: 'top'
              })
        }).catch(err=>{
          console.log(err);
         islang=true
          // this.$store.dispatch('setLanguage', 'zh')
        })
        if(islang){
           await import('@/lang/en.UI.json').then(res=>{
            console.log(res.default);
            let langjson=res.default;
            let zh=this.$i18n.getLocaleMessage(lang);


            // 判断其它语言不存在某个key用中文的key值替换
            for(let item in zh){
              if(langjson[item]){
                let copyzhitem=zh[item]
                for(let item1 in copyzhitem){
                  if(!langjson[item][item1]){
                    langjson[item][item1]=copyzhitem[item1]
                  }
                }
              }else{
              //   console.log(zh[item]);
                langjson[item]=zh[item]
              }
            }

            this.$i18n.setLocaleMessage(lang, langjson);
            this.$i18n.locale = lang;
            this.$store.dispatch('setLanguage', lang)
            console.log(this.$i18n.getLocaleMessage(lang));
            this.$toast.success({
                message: 'success',
                position: 'top'
              })
          })
        }
      }else{
        lsg.setItem('langitem',lang)
        this.$i18n.locale = lang;
          this.$store.dispatch('setLanguage', lang)
          this.$toast.success({
            message: 'success',
            position: 'top'
          })
      }
      } catch (error) {
        console.log(error);
      }

      this.$nextTick(() => {
        this.$router.replace({
          path: this.$route.path + `?Math=${Math.ceil(Math.random()*10)}`
        })
      })
      console.log(this.$store.getters.language);
    }
  }
}
</script>

<style scoped>
.international-icon {
  font-size: 20px;
  cursor: pointer;
  vertical-align: -5px!important;
}
</style>

