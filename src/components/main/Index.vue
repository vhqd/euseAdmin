<template>
  <div class="today">
    <h2 class="word">今日,</h2>
    <p class="times">{{dateTime.currentDate+' '+dateTime.currentWeek}} 欢迎您回到阿里云控制台。</p>
  </div>
</template>

<script>
import { DateTime } from "@/common/Date.js";

export default {
  data() {
    return {
      dateTime: {
        currentDate: "",
        currentTime: "",
        currentWeek: ""
      }
    };
  },
  created() {
    let vue = this;
    let date = new DateTime();
    vue.dateTime.currentDate = date.getDate();
    vue.dateTime.currentTime = date.getTime();
    vue.dateTime.currentWeek = date.getWeek();
  }
};
</script>

<style scoped>
.word {
  color: #373d41;
}
.today {
  padding: 10px 10px;
}
.times {
  color: #73777a;
  font-size: 12px;
}
</style>

