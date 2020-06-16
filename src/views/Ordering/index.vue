<template>
  <div class="home">
    <Nav title="订餐消费"></Nav>
    <div class="wrap">
      <mu-container>
        <mu-form
          :model="formOrder"
          class="mu-demo-form"
          label-position="left"
          label-width="100">
          <mu-form-item prop="OrderID" label="订餐餐段">
            <mu-select label="Normal" v-model="formOrder.OrderID" full-width>
                <mu-option
                v-for="(option,index) in options"
                :key="index"
                :label="option.val"
                :value="option.id">
                </mu-option>
            </mu-select>
          </mu-form-item>
          <mu-form-item prop="date" label="订餐时间">
            <mu-date-input  v-model="formOrder.date" type="date" label-float full-width></mu-date-input>
          </mu-form-item>
        </mu-form>



        <mu-button color="primary" @click="toOrderList">订餐列表</mu-button>
      </mu-container>
    </div>
  </div>
</template>
<script>
import Nav from "./../../components/nav_top";
import moment from 'moment'
export default {
  components: {
    Nav
  },
  data() {
    return {
      formOrder:{
          OrderID: 1,
          date:new Date()
      },
      
      options: [
        { val: "早餐", id: 1 },
        { val: "午餐", id: 2 },
        { val: "晚餐", id: 3 },
        { val: "夜餐", id: 4 }
      ]
    };
  },
  created() {},
  methods: {
      toOrderList(){
          this.$router.push({path:'/OrderList'})
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
</style>
<style lang='scss'>
.dialog .mu-dialog .mu-dialog-body {
  height: 100%;
}
.quickTime {
  button {
    min-width: 66px;
    margin: 0 5px;
  }
}
.share {
  p {
    margin: 10px 0;
  }
  button {
    min-width: 150px;
  }
}
.mu-dialog {
  .mu-dialog-body {
    width: 100%;
    box-sizing: border-box;
  }
}
</style>
