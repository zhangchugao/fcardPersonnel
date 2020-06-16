<template>
  <div class="nav">
    <mu-appbar color="teal">
      <mu-button v-if="showBack" icon slot="left" @click="back">
        <mu-icon value="arrow_back"></mu-icon>
      </mu-button>{{title}}
      <mu-button icon slot="right">
        <!-- <mu-icon value="refresh"></mu-icon> -->
      </mu-button>
    </mu-appbar>
  </div>
</template>

<script>
export default {
  name: "Nav",
  props: {
    title:{
        default:'个人中心'
    },
    showBack:{
      default:true,
      type:Boolean
    }
  },
  methods:{
      back(){
          this.$progress.start();
          setTimeout(() => {
              this.$progress.done();
              // this.$store.state.transitionName='slide-right'
              this.$router.go(-1);
          }, 300);
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
