<template>
  <div class="leftContainer">
    <v-chart :options="getOptions()" autoresize></v-chart>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'LeftView',
  props:['activeIndex'],
  data() {
    return {
    };
  },

  computed:{
    ...mapState({
      /*
        "orderFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        "orderFullYear": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290],
        "userFullYearAxis": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
        "userFullYear": [110, 120, 90, 220, 175, 212, 192, 95, 88, 120, 250, 310],
      */
      orderFullYearAxis:state => state.echarts.echartsData.orderFullYearAxis,
      orderFullYear:state => state.echarts.echartsData.orderFullYear,
      userFullYearAxis:state => state.echarts.echartsData.userFullYearAxis,
      userFullYear:state => state.echarts.echartsData.userFullYear,
    })
  },

  methods:{
    getOptions(){
      let {activeIndex,orderFullYearAxis,userFullYearAxis,orderFullYear,userFullYear} = this
      return {
        title:{
          text:activeIndex === '1'?'销售趋势':'用户趋势',
          textStyle:{
            // color:,
            fontSize:14
          },
          left:'3%',
          top:'5%'
        },
        // grid:{
        //   left:0,
        //   right:0,
        //   top:0,
        //   bottom:0,
        // },
        xAxis:{
          data:activeIndex === '1'?orderFullYearAxis:userFullYearAxis,
          axisTick: {
            alignWithLabel: true  //刻度线是否和lable标题对齐  刻度线是否和柱对齐
          }
        },
        yAxis:{
          axisLine:{
            show:false
          },
          axisTick:{
            show:false
          }
        },

        tooltip:{},

        series:{
          name:activeIndex === '1'?'销售额':'用户量',
          type:'bar',
          data:activeIndex === '1'?orderFullYear:userFullYear,
          barWidth:'40%'
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .leftContainer{
    width: 100%;
    height: 350px;
  }
</style>
