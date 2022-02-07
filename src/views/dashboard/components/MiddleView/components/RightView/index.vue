<template>
  <div>
    <div class="title">{{activeIndex==1?'销售排行榜':'用户排行榜'}}</div>
    <div class="item" v-for="(item,index) in useData" :key="item.no">
      <div class="no" :class="index < 3 && 'active'">{{item.no}}</div>
      <div class="name">{{item.name}}</div>
      <div class="count">{{item.count}}</div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'RightView',
  props:['activeIndex'],
  data() {
    return {
      
    };
  },
  computed:{
    ...mapState({
      orderRank:state => state.echarts.echartsData.orderRank,
      userRank:state => state.echarts.echartsData.userRank
    }),
    useData(){
      let {activeIndex,orderRank,userRank} = this
      return activeIndex === '1'?orderRank:userRank
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  margin-top: 50px;
}
.item{
  display: flex;
  font-size: 12px;
  align-items: center;
  margin: 10px 0;
  .no{
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border-radius: 50%;
    margin-right: 10px;
    &.active{
      background-color: #000;
      color: white;
    }
  }
  .name{
    width: 100px;
  }
}
</style>
