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
            <i class="el-icon-receiving"></i>分类管理
          </template>
          <router-link :to="{path:'/category',query:{'activeIndex':'1-1'}}">
            <el-menu-item index="1-1">分类列表</el-menu-item>
          </router-link>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-notebook-2"></i>栏目管理
          </template>
          <router-link to="/articles">
            <el-menu-item index="2-1">所有文章</el-menu-item>
          </router-link>
          <el-submenu index="2-2">
            <template slot="title">前端</template>
            <el-menu-item index="2-2-1">JavaScript</el-menu-item>
            <el-menu-item index="2-2-2">HTML5</el-menu-item>
            <el-menu-item index="2-2-3">CSS3</el-menu-item>
          </el-submenu>
          <el-submenu index="2-3">
            <template slot="title">后台</template>
            <el-menu-item index="2-1-1">nodeJs</el-menu-item>
          </el-submenu>
          <el-submenu index="2-4">
            <template slot="title">笔记文章</template>
            <el-menu-item index="2-4-1">文章列表</el-menu-item>
          </el-submenu>
        </el-submenu>
        <!--   <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-document-copy"></i>内容管理
          </template>
          <el-menu-item index="3-1">所有内容</el-menu-item>
        </el-submenu>-->
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-setting"></i>系统管理
          </template>
          <router-link :to="{path:'/users',query:{'activeIndex':'4-1'}}">
            <el-menu-item index="4-1">用户管理</el-menu-item>
          </router-link>
          <el-menu-item index="4-2">权限管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0"
    };
  },
  methods: {},
  mounted() {
    if (this.$route.query && !(JSON.stringify(this.$route.query) == "{}")) {
      this.activeIndex = this.$route.query.activeIndex;
    } else {
      this.activeIndex = "0";
    }
  }
};
</script>

<style scoped>
.el-aside {
  color: #333;
  z-index: 999;
}
</style>
