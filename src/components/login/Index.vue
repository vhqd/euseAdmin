<template>
  <div class="loginbox">
    <div class="header">
      <div class="k1">
        <a href="/" class="logo" style="float: left;"></a>
        <!-- <h1 class="hospitaltitle">EUSE管理系统</h1> -->
      </div>
    </div>
    <div class="main main_bg1 main_bg2">
      <div class="k1">
        <div class="login r">
          <ul class="hd" id="hd">
            <li class="on">EUSE管理系统</li>
          </ul>
          <ul class="bd" id="bd">
            <li style="display: block;">
              <input type="text" class="tex" placeholder="请输入账号" v-model="username">
              <input type="password" class="tex tex2" placeholder="请输入密码" v-model="password">
              <!-- <p style="font-size: 16px;color:#666;">
                  验证码：
                  <input
                    type="text"
                    class="tex tex2"
                    style="width: 100px;padding-left: 5px;"
                    placeholder="验证码"
                  >
                  <span class="yzm">DFJ6</span>
                  <span class="changeimg">看不清，换一张</span>
              </p>-->
              <div class="forgive">
                <label class="l">
                  <input type="checkbox" class="che" value="1" name="remember" id="remember">
                  自动登录
                </label>
                <a href class="a2 r">忘记密码?</a>
              </div>
              <div class="clear"></div>
              <input class="but" type="button" value="登     录" @click="sendLogin">
              <a class="but register">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</a>
              <!-- <p class="p2">
                        <a href="">免费注册</a>丨
                        <a href="">忘记密码</a>
              </p>-->
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>Copyright©2019 EUSE@www.zhangqiangwo@qq.com 版权所有</p>
    </div>
  </div>
</template>

<script>
import qs from "qs";
import service from "../../service";
import store from '../../store'

export default {
  components: {},
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {},
  watch: {},
  methods: {
    sendLogin() {
      if (this.username == "") {
        this.$message({
          type: "info",
          message: "请输入用户名"
        });
        return;
      }
      if (this.password == "") {
        this.$message({
          type: "info",
          message: "请输入密码"
        });
        return;
      }
      let user = {
        username: this.username,
        password: this.password
      };
      service
        .login(qs.stringify(user))
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            store.commit('setToken',res.data.token)
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('user',JSON.stringify(res.data.user))
            store.commit('setUser',res.data.user)
            this.$router.replace("/");
            console.log(res);
          } else if (res.data.code == -1) {
            this.$message({
              type: "info",
              message: res.data.msg
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped>
@import url(../../../static/css/loginStyle.css);
.loginbox {
  background: #fff !important;
}
.register {
  display: block;
  text-align: center;
  line-height: 42px;
  background: #fff !important;
  border: 1px solid #ccc;
  color: #606266 !important;
  cursor: pointer;
}
</style>