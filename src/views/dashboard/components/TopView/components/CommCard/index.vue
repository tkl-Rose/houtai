<template>
  <el-card>
    <!-- 头部：后期主要是写标题和数字 -->
    <div class="header">
      <div class="title">{{title}}</div>
      <div class="count">{{count}}</div>
    </div>

    <!-- 后期用来专门画图 -->
    <div class="main">
      <slot name="main"></slot>
    </div>

    <!-- 分割线 -->
    <div class="line"></div>

    <!-- 底部的文字 -->
    <div class="bottom">
      <slot name="bottom"></slot>
    </div>
  </el-card>
</template>
<script>
export default {
  name: 'CommCard',
  props:['title','count'],
  data() {
    return {
      
    };
  },
}
</script>

<style lang="scss" scoped>
  .title{
    font-size: 12px;
    color: #aaa;
  }
  .count{
    font-size: 24px;
    letter-spacing: 1px;
  }
  .main{
    width: 100%;
    height: 50px;
  }
  .line{
    height: 2px;
    background-color: #aaa;
    margin: 10px 0;
  }
  .bottom{
    font-size: 12px;
    color: #aaa;
  }
</style>
