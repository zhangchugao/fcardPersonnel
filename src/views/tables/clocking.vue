<template>
<!-- 考勤 -->
  <div class="home">
    <Nav icon="search" @openDialog="openD" :title="$route.query.item"></Nav>
    <div class="wrap">
      <!-- {{}} -->
      <Table
          border
          @row-click="rowClick" size='mini'
          ref="table_data"
          style="width: 100%;position:fixed;z-index:50;" :height='36'
        >
          <table-column  label="门名称" width></table-column>
          <table-column  label="日期" width></table-column>
          <table-column  label="地址"></table-column>
        </Table>
      <mu-load-more @refresh="refresh" :refreshing="refreshing" :loading="loading" @load="load">
        <Table
          :data="list"
          border
          @row-click="rowClick" size='mini'
          ref="table_data"
          style="width: 100%;"
        >
          <table-column prop="name" label="门名称" width></table-column>
          <table-column align="" prop="calories" label="日期" width></table-column>
          <table-column prop="fat" label="事件"></table-column>
        </Table>
      </mu-load-more>
    </div>
    <mu-drawer style="width:7.4667rem" :open.sync="open" :docked="false" right="right">
      <mu-appbar style="width: 100%;" title="搜索" color="teal"></mu-appbar>
      <mu-row justify-content="center" class="mu-person-form">
        <mu-form ref="form" :model="form" label-width="74">
          <mu-form-item label-position="right" label="姓名:">
            <mu-text-field v-model="form.name"></mu-text-field>
          </mu-form-item>
          <mu-form-item label-position="right" label="搜索条件:">
            <mu-text-field v-model="form.data1"></mu-text-field>
          </mu-form-item>

          <mu-form-item label-position="right" label="搜索条件:">
            <mu-text-field type="password" v-model="form.data2"></mu-text-field>
          </mu-form-item>

         <mu-button color="primary" @click="submit" class="submit">搜索</mu-button>
          <!-- <div class="submit"> -->
            
          <!-- </div> -->
        </mu-form>
      </mu-row>
    </mu-drawer>
    <mu-dialog width="360" :open.sync="openSimple">
      <mu-list>
        <mu-list-item button :ripple="false">
          <mu-list-item-action></mu-list-item-action>
          <mu-list-item-title>
            {{rowdata}}
          </mu-list-item-title>
        </mu-list-item>
      </mu-list>
    </mu-dialog>
  </div>
</template>
<script>
import Nav from "@/components/nav_top_menu";
import { Table, TableColumn } from "element-ui";
export default {
  components: {
    Nav,
    Table,
    TableColumn
  },
  data() {
    return {
      open: false,
      refreshing: false,
      loading: false,
      openSimple:false,
      
      columns: [
        {
          title: "Dessert (100g serving)",
          //   width: '30%',
          name: "name"
        },
        {
          title: "Calories",
          name: "calories",
          //   width: '35%',
          align: "center",
          sortable: true
        },
        {
          title: "Fat (g)",
          name: "fat",
          //   width: '35%',
          align: "center",
          sortable: true
        }
      ],
      list: [
        {
          name: "Frozen Yogurt",
          calories: '2018-01-01 12:00',
          fat: '广州广州',
          carbs: 24,
          protein: 4.0,
          iron: 1
        },
        {
          name: "Ice cream sandwich",
          calories: '2018-01-01 12:00',
          fat: '广州广州',
          carbs: 37,
          protein: 4.3,
          iron: 1
        },
        {
          name: "Eclair",
          calories: '2018-01-01 12:00',
         fat: '广州广州',
          carbs: 23,
          protein: 6.0,
          iron: 7
        },
        {
          name: "Cupcake",
          calories: '2018-01-01 12:00',
          fat: '广州广州',
          carbs: 67,
          protein: 4.3,
          iron: 8
        },
        {
          name: "Gingerbread",
          calories: '2018-01-01 12:00',
          fat: '广州广州',
          carbs: 49,
          protein: 3.9,
          iron: 16
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: '广州广州',
          carbs: 94,
          protein: 0.0,
          iron: 0
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2
        },
        {
          name: "Honeycomb",
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: 45
        },
        {
          name: "Donut",
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: 22
        },
        {
          name: "KitKat",
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: 6
        },
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1
        },
        {
          name: "Eclair",
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: 7
        },
        {
          name: "Cupcake",
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: 8
        },
        {
          name: "Gingerbread",
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: 16
        },
        {
          name: "Jelly bean",
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: 0
        },
        {
          name: "Lollipop",
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: 2
        }
      ],
      rowdata:'',
      form: {
        name: "name",
        data1: "http://192.168.1.125:8080",
        data2: "123123"
      }
    };
  },
  mounted() {
    console.log(this.$route.query.item)
  },
  methods: {
    openD() {
      //打开侧边
      this.open = true;
    },
    handleSortChange() {
      console.log(data);
    },
    rowClick(data) {
      console.log(data);
      this.openSimple=true;
      this.rowdata=data;
      ['姓名','data1','data2','data3'].map((item)=>{
        console.log(item);
        
      })
    },
    refresh() {
      this.refreshing = true;
      this.$refs.table_data.scrollTop = 0;
      setTimeout(() => {
        this.refreshing = false;
      }, 2000);
    },
    load() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 2000);
    },
    submit(){

    }
  }
};
</script>
<style>
.home {
  height: 100%;
}
.wrap {
  position:relative;
  height: calc(100% - 60px);
  margin-top: 0.1067rem;
  overflow: auto;
}
</style>


