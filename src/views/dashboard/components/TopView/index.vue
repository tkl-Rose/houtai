<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="6">
        <TodaySale></TodaySale>
      </el-col>
      <el-col :span="6">
        <TodayOrder></TodayOrder>
      </el-col>
      <el-col :span="6">
        <TradeUser></TradeUser>
      </el-col>
      <el-col :span="6">
        <TotalUser></TotalUser>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import TodaySale from "./components/TodaySale";
import TodayOrder from "./components/TodayOrder";
import TradeUser from "./components/TradeUser";
import TotalUser from "./components/TotalUser";
export default {
  name: "TopView",
  components: {
    TodaySale,
    TodayOrder,
    TradeUser,
    TotalUser
  },
  data() {
    return {};
  }
};
</script>

<style>
.leftText {
  margin-right: 5px;
}
.down {
  border: 5px solid green;
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.up {
  border: 5px solid red;
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
}
</style>
