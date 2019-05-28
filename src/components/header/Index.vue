<template>
  <div>
    <el-header style="text-align: right; font-size: 12px;">
      <img src="../../../static/images/logo.png" alt="" style="float:left;height:45px;padding-top:5px;">
      <el-dropdown>
        <i class="el-icon-setting" style="margin-right: 15px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>修改密码</el-dropdown-item>
          <el-dropdown-item>用户信息</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span>欢迎{{usernmae}}</span>
    </el-header>
  </div>
</template>

<script>
import store from "../../store";

export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    usernmae() {
      return store.getters.getUser.username;
    }
  }
};
</script>

<style scoped>
.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.08);
}
</style>
