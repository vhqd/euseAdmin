<template>
  <div>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246);">
      <el-menu :default-active="activeIndex">
        <router-link to="/">
          <el-menu-item index="0">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
        </router-link>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-receiving"></i>栏目管理
          </template>
          <router-link :to="{path:'/category',query:{'activeIndex':'1-1'}}">
            <el-menu-item index="1-1">栏目列表</el-menu-item>
          </router-link>
        </el-submenu>

        <!-- 所有文章 -->
        <div v-for="(item,index) in cates" :key="index">
          <router-link
            v-if="item.children.length == 0"
            :to="{path:'/articles',query:{'activeIndex':index+'-'+(index+1),id:'allCategroy'}}"
          >
            <el-menu-item index="0-0">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">{{item.categoryname}}</span>
            </el-menu-item>
          </router-link>
        </div>

        <!-- 栏目分类 -->
        <div v-for="(item,index) in cates" :key="'key'+index">
        <div v-if="item.children.length != 0">
          <el-submenu :index="index+'-'+(index+1)" v-if="item.children">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>{{item.categoryname}}</span>
            </template>
            <div v-for="(secitem,indexs) in item.children" :key="indexs">
              <el-submenu :index="index+'-'+(index)+'-'+(indexs+1)">
                <template slot="title">{{secitem.categoryname}}</template>

                <div v-for="(thirditem,thirdindex) in secitem.children" :key="thirdindex">
                  <router-link
                    v-if="!thirditem.children"
                    :to="{path:'/articles',query:{'activeIndex':index+'-'+indexs+'-'+thirdindex,id:thirditem._id,pid:secitem._id}}"
                  >
                    <el-menu-item
                      :index="index+'-'+indexs+'-'+thirdindex"
                    >{{thirditem.categoryname}}</el-menu-item>
                  </router-link>
                </div>
              </el-submenu>
            </div>
          </el-submenu>
        </div>
        </div>

        <el-submenu index="99">
          <template slot="title">
            <i class="el-icon-setting"></i>系统管理
          </template>
          <router-link :to="{path:'/users',query:{'activeIndex':'4-1'}}">
            <el-menu-item index="99-1">用户管理</el-menu-item>
          </router-link>
          <el-menu-item index="99-2">权限管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import service from "../../service";
import { sortarr } from "../../untils/base";
import store from "../../store";

export default {
  data() {
    return {
      activeIndex: "0",
      cates: []
    };
  },
  watch: {
    $route(to) {
      console.log(to);
      if (to.path == "/category") {
        let tabs = ["栏目管理"];
        store.commit("setTabs", tabs);
        localStorage.setItem("tabs", JSON.stringify(tabs));
      } else if (to.path == "/articles") {
        this.getTabs(store.getters.getAllCategory);
      } else if (to.path == "/users") {
        let tabs = ["用户管理"];
        store.commit("setTabs", tabs);
        localStorage.setItem("tabs", JSON.stringify(tabs));
      }
    }
  },
  methods: {
    getTabs(allCate) {
      let navi = this.$route.query.activeIndex.split("-");
      let tabs = [];
      console.log(navi.length);

      if (navi.length == 2) {
        tabs.push(allCate[0].categoryname);
      } else {
        tabs.push(allCate[navi[0]].categoryname);
        tabs.push(allCate[navi[0]].children[navi[1]].categoryname);
        tabs.push(
          allCate[navi[0]].children[navi[1]].children[navi[2]].categoryname
        );
      }
      store.commit("setTabs", tabs);
      localStorage.setItem("tabs", JSON.stringify(tabs));
    }
  },
  mounted() {
    if (this.$route.query && !(JSON.stringify(this.$route.query) == "{}")) {
      this.activeIndex = this.$route.query.activeIndex;
    } else {
      this.activeIndex = "0";
    }
    service
      .getcateall()
      .then(res => {
        console.log(1111111111111);
        console.log(res);
        let categorys = res.data.data.category;
        this.cates = sortarr(categorys);
        store.commit("setAllCategory", categorys);
        /* store.commit("firstCategory", firstCate);
        store.commit("setSecCategory", secCate); */
      })
      .catch(err => {
        console.log(err);
      });

  }
};
</script>

<style scoped>
.el-aside {
  color: #333;
  z-index: 999;
}
</style>
