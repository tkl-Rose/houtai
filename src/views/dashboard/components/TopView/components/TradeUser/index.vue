<template>
  <div>
    <CommCard title="交易用户数" :count="orderUser | numberFormat">
      <template #main>
        <v-chart :options="getOptions()" autoresize></v-chart>
      </template>
      <template #bottom>
        <span class="leftText">退货率</span>
        <span>{{returnRate}}%</span>
      </template>
    </CommCard>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import CommCard from '../CommCard'
export default {
  name: 'TradeUser',
  computed:{
    ...mapState({
      /**
      "orderUser": 182425,
      "returnRate": 5.91,
      "orderUserTrend": [410, 82, 200, 334, 390, 330, 220, 150, 82, 200, 134, 290, 330, 150],
      "orderUserTrendAxis": ["00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00"],
       */
      orderUser:state => state.echarts.echartsData.orderUser,
      returnRate:state => state.echarts.echartsData.returnRate,
      orderUserTrend:state => state.echarts.echartsData.orderUserTrend,
      orderUserTrendAxis:state => state.echarts.echartsData.orderUserTrendAxis,
    })
  },
  components:{
    CommCard
  },
  methods:{
    getOptions(){
      return {
        // title:{},
        grid:{
          left:0,
          right:0,
          top:0,
          bottom:0,
        },
        xAxis:{
          data:this.orderUserTrendAxis || [],
          show:false,
        },
        yAxis:{
          show:false
        },
        tooltip:{
          trigger:'axis'
        },
        series:{
          name:'实时用户数',
          type:'bar',
          data: this.orderUserTrend || [],
          barWidth:'50%',
          // itemStyle:{
          //   color:'green'
          // }
        },

        color:'green'
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

</style>
