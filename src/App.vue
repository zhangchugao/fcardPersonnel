<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
// import {RecentAccessRecord} from '@/api/getdata.js'
export default {
  created() {
    let that=this;
    // fetch('api/WebAPI/PersonalReportDetail/Information',{
    //   Method: 'POST'
    // }).then(res => res.text()).then(res=>{
    //   let data=JSON.parse(res);
    //   if(data.ErrCode==0){
        
    //   }else{
    //     that.$router.push({path:'Home'});
    //   }
    // }).catch(err=>{
    //   console.log(err);
    // })
  },
  mounted() {
    let that=this;
    window.addEventListener("popstate", function(e) {
      // alert()
      // console.log(that.$store);
      that.$store.state.transitionName='slide-right'
    }, false);
    
  },  
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
}
html,body{
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.home{
  width: 100%;
}
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  /* margin-top: 60px; */
}

/* 页面切换动画 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
<style lang="scss">
  .box_info{
      .mu-dialog-body{
        padding: 0 0.4rem;
        .mu-item{
          height: 0.9333rem;
          padding:0 0.2133rem;
          .mu-item-action{
            width: 1.6rem;
            text-align: right;
            font-size: 0.32rem;
            display: inline-block;
            height: auto;
          }
          .mu-item-title{
            padding-left: 0.2133rem;
          }
        }
      }
    }
    .mu-input.has-label .mu-input-label{
      top: -0.56rem !important;
    }
</style>

