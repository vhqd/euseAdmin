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
        <!-- <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-notebook-2"></i>文章管理
          </template>
          <div v-for="(item,index) in cates" :key="index">
            <router-link :to="{path:'/articles',query:{'activeIndex':'2-0',id:'allCategroy'}}">
              <el-menu-item index="2-0" v-if="!item.children">{{item.categoryname}}</el-menu-item>
            </router-link>
          </div>
          <div v-for="(item,index) in cates" :key="'key'+index">
            <el-submenu :index="index+'-'+(index+1)" v-if="item.children">
              <template slot="title">{{item.categoryname}}</template>
              <template v-if="item.children">
                <router-link
                  :to="{path:'/articles',query:{'activeIndex':index+'-'+(index+1)+'-'+(indexs+1),id:secitem._id}}"
                  v-for="(secitem,indexs) in item.children"
                  :key="indexs"
                >
                  <el-menu-item :index="index+'-'+(index+1)+'-'+(indexs+1)">{{secitem.categoryname}}</el-menu-item>
                </router-link>
              </template>
            </el-submenu>
          </div>
        </el-submenu> -->

        <!-- 所有文章 -->
        <div v-for="(item,index) in cates" :key="index">
          <router-link
            v-if="!item.children"
            :to="{path:'/articles',query:{'activeIndex':'20-0',id:'allCategroy'}}"
          >
            <el-menu-item index="0-0">
              <i class="el-icon-notebook-2"></i>
              <span slot="title">{{item.categoryname}}</span>
            </el-menu-item>
          </router-link>
        </div>

        <!-- 栏目分类 -->
        <div v-for="(item,index) in cates" :key="'key'+index">
          <el-submenu :index="index+'-'+(index+1)" v-if="item.children">
            <template slot="title">
              <i class="el-icon-notebook-2"></i>
              <span>{{item.categoryname}}</span>
            </template>
            <div v-for="(secitem,indexs) in item.children" :key="indexs">
              <el-submenu :index="index+'-'+(index+1)+'-'+(indexs+1)">
                <template slot="title">{{secitem.categoryname}}</template>

                <div v-for="(thirditem,thirdindex) in secitem.children" :key="thirdindex">
                   <router-link
                    v-if="!thirditem.children"
                    :to="{path:'/articles',query:{'activeIndex':index+'-'+(indexs+1)+'-'+(thirdindex+1),id:secitem._id}}"
                  >
                    <el-menu-item
                      :index="index+'-'+(indexs+1)+'-'+(thirdindex+1)"
                    >{{thirditem.categoryname}}</el-menu-item>
                  </router-link>
                </div>
              </el-submenu>
            </div>
          </el-submenu>
        </div>

        <!-- <el-submenu index="8">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>导航一</span>
          </template>
          <el-submenu index="8-4">
            <template slot="title">选项4</template>
            <el-menu-item index="8-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu>-->

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
  methods: {},
  mounted() {
    if (this.$route.query && !(JSON.stringify(this.$route.query) == "{}")) {
      this.activeIndex = this.$route.query.activeIndex;
    } else {
      this.activeIndex = "0";
    }
    service
      .getcategorys()
      .then(res => {
        let categorys = res.data.data.category;
        console.log("categorys", categorys);
        let firstCate = [],
          secCate = [];
        categorys.forEach((v, k) => {
          v.children = eval("(" + v.children + ")");
          if (v.children) {
            v.children.forEach((nv, nk) => {
              if (nv.children) {
                nv.children = eval("(" + nv.children + ")");
              }
            });
          }
          if (v.isparent) {
            firstCate.push(v);
          } else {
            secCate.push(v);
          }
        });

        this.cates = sortarr(firstCate);
        store.commit("setAllCategory", categorys);
        store.commit("firstCategory", firstCate);
        store.commit("setSecCategory", secCate);
        console.log(sortarr(firstCate));
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
