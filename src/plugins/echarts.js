// 引入并声明使用echarts

import Vue from 'vue'
import * as echarts from 'echarts'

// 使用echarts5版本会报这个警告，按照下面提示信息去修改，没反应，还是会报错
// import * as echarts from 'echarts/lib/echarts'

// 我们需要把echarts版本回退到4版本，使用上面的引入方式

import VueEcharts from 'vue-echarts'  //它是一个插件，但是里面暴露出来是组件


Vue.prototype.$echarts = echarts
Vue.component('v-chart',VueEcharts)
