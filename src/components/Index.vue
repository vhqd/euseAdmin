<template>
  <div class="hello">
    <el-container>
      <el-header class="eu-el-header">
        <eu-header></eu-header>
      </el-header>
      <el-container style="padding-top:60px;">
        <el-aside width="200px" class="eu-el-aside">
          <eu-aside></eu-aside>
        </el-aside>
        <el-main class="eu-el-main">
          <router-view></router-view>
          <!-- <eu-main></eu-main> -->
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import euHeader from "@/components/header";
import euAside from "@/components/aside";
import euMain from "@/components/main";

export default {
  name: "HelloWorld",
  data() {
    return {};
  },
  created() {},
  components: {
    euAside,
    euHeader,
    euMain
  },
  methods: {}
};
</script>

<style scoped>
.el-main{
  padding: 0;
}
.eu-el-header {
  padding: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}
.eu-el-aside {
  height: 100%;
  position: fixed;
  left: 0;
  top: 60px;
  padding-bottom: 60px;
  background: #fff;
}
.eu-el-main {
  padding-left: 200px;
  background:transparent url(../../static/images/bg.png) no-repeat 100% 0;
  background-size: 358px 120px;
}
</style>
