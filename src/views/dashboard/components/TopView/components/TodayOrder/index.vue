<template>
  <div>
    <CommCard title="今日订单" :count="orderToday | numberFormat">
      <template #main>
        <div class="main" ref="main"></div>
      </template>

      <template #bottom>
        <span class="leftText">昨日订单量</span>
        <span>{{orderLastDay | numberFormat}}</span>
      </template>

    </CommCard>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import throttle from 'lodash/throttle'
import debounce from 'lodash/debounce'

import CommCard from '../CommCard'
export default {
  name: 'TodayOrder',
  components:{
    CommCard
  },
  computed:{
    ...mapState({
      /*
      "orderToday": 2562061,
      "orderLastDay": 2100000,
      "orderTrend": [610, 432, 220, 534, 790, 430, 220, 320, 532, 320, 834, 690, 530, 220],
      "orderTrendAxis": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
      */
      orderToday:state => state.echarts.echartsData.orderToday,
      orderLastDay:state => state.echarts.echartsData.orderLastDay,
      orderTrend:state => state.echarts.echartsData.orderTrend,
      orderTrendAxis:state => state.echarts.echartsData.orderTrendAxis,
    })
  },

  mounted(){
    // 1、准备带有宽高的容器
    // 2、初始化一个echarts实例对象
    // 3、通过echarts实例对象调用setOption方法，传递配置对象
    this.chart = this.$echarts.init(this.$refs.main)
    this.chart.setOption(this.getOptions())


    // 对浏览器窗口添加改变大小的事件监听

    window.addEventListener('resize',debounce(() => {
      this.chart.resize()
    },100))
  },

  watch:{
    orderToday:{
      handler(newval,oldVal){
        this.chart.setOption(this.getOptions())
      }
    }
  },
  methods:{
    getOptions(){
      return {
        // 标题
        // title:{
        //   text:'哈哈哈'
        // },
        // 网格 控制整个图标在容器当中的大小
        // 图标距离容器上下左右的边距
        grid:{
          left:0,
          right:0,
          top:0,
          bottom:0
        },
        // x轴
        xAxis:{
          data:this.orderTrendAxis || [],
          show:false, //隐藏坐标轴
        },
        // y轴 
        yAxis:{
          show:false
        },

        // 提示
        tooltip:{
          trigger:'axis'
        },

        // 系列（说的就是图的线line  柱bar  饼pie）
        // 系列必须写type 
        series:{
          name:"实时订单数",
          type:'line', //图的类型
          data:this.orderTrend || [], //数据
          smooth:true, //线是否平滑
          areaStyle:{
            color:'hotpink' //设置区域颜色
          },
          lineStyle:{
            opacity:0 ///去掉线
          },
          itemStyle:{
            color:'red',
            opacity:0 //去掉折点（item项）
          }
        }

      }
    }
  },

  data() {
    return {
      
    };
  },
}
</script>

<style scoped>
  /* .leftText{
    margin-right: 5px;
  } */

  .main{
    width: 100%;
    height: 50px;
  }
</style>
