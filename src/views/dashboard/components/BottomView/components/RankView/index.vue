<template>
  <div>
    <el-card>
      <div slot="header" class="header">
        <div class="title">分类销售排行</div>
        <div class="radio">
          <el-radio-group v-model="radio2" size="small">
            <el-radio-button label="品类"></el-radio-button>
            <el-radio-button label="商品"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
      <div class="main">
        <v-chart :options="getOptions()" autoresize></v-chart>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: "RankView",
  data() {
    return {
      radio2: "品类"
    };
  },

  computed:{
    ...mapState({
      /*
      "saleRank": {
          "category": {
            "axisX": ["粉面粥店", "简餐便当", "汉堡披萨", "香锅冒菜", "小吃炸串", "地方菜系", "轻食简餐"],
            "data1": [56, 52, 95, 41, 30, 69, 63]
          },
          "goods": {
            "axisX": ["草莓", "甘蔗", "榴莲", "菠萝", "香蕉", "梨", "苹果"],
            "data1": [68, 15, 41, 56, 70, 25, 31]
          }
        }
      */
    //  我们最终要的数据是什么?
    // 我们要的是一个数组，数组里面全是对象，每个对象有name和value
    //  [ {name:'粉面粥店|20%'，value:56 }  ]

      saleRank: state => state.echarts.echartsData.saleRank
    }),

    useData(){
      if(this.saleRank){
        // 深度解构对象
        let {category:{axisX:names1,data1:datas1},goods:{axisX:names2,data1:datas2}} = this.saleRank
        // 计算品类相关的数组数据
        let allDatas1Num = datas1.reduce((prev,item) => {
          prev += item
          return prev
        },0)
        let categoryData = names1.map((item,index) => {
          return {
            name: item + '|' + (datas1[index] * 100 / allDatas1Num).toFixed(2) + '%',
            value: datas1[index]
          } 
        })

        // 计算goods相关的数组数据

        let allDatas2Num = datas2.reduce((prev,item) => {
          prev += item
          return prev
        },0)
        let goodsData = names2.map((item,index) => {
          return {
            name: item + '|' + (datas2[index] * 100 / allDatas2Num).toFixed(2) + '%',
            value: datas2[index]
          } 
        })
        return {
          allDatas1Num,
          allDatas2Num,
          categoryData,
          goodsData
        }
      }else{
        return {}
      }
    }
  },

  methods: {
    getOptions() {
      let {
          allDatas1Num,
          allDatas2Num,
          categoryData,
          goodsData
        } = this.useData
      return {
        title:[
          {
            text:`${this.radio2}分布`,
            textStyle:{
              fontSize:14
            },
            left:'6%',
            top:'5%'
          },
          {
            text:'累积数量',
            subtext: this.radio2 === '品类'?allDatas1Num:allDatas2Num, //子标题内容
            textStyle:{   //主标题样式
              fontSize:14
            },

            subtextStyle: { //子标题样式
              fontSize:28,
              color:'#000'
            },
            left:'32%',
            top:'32%',
            textAlign:'center'
          }
        ],

        tooltip: {
          trigger: "item",
          formatter:(params) => {
            return `${this.radio2}分布<br>
            ${params.marker}名称:${params.name.split('|')[0]}<br>
            ${params.marker}数量:${params.value}<br>
            ${params.marker}占比:${params.percent}%<br>`
          }
        },
        // 图例相关，修改位置一会去动
        legend: {
          top: "30%",
          left: "70%",
          orient:'vertical'
        },
        series: [
          {
            name: `${this.radio2}分布`,
            type: "pie",

            center:['33%','40%'], //圆心坐标 left top

            radius: ["30%", "43%"], //内外圆的半径
            avoidLabelOverlap: false, //是否启用防止标签重叠
            label: {   //图形文字
              show: true,
              // 规定图形文字显示的是什么，formatter可以是一个字符串，也可以是一个回调，回调里面
              // 参数当中可以获取到每项的name和value
              formatter:(params) => {
                console.log(params)
                return params.name.split('|')[0]
              }
            },
            // emphasis: {
            //   label: {
            //     show: true,
            //     fontSize: "40",
            //     fontWeight: "bold"
            //   }
            // },
            labelLine: {   //文字引导线
              show: true,
              length:5,
              length2:5
            },

            itemStyle:{
              borderColor:'white',
              borderWidth:2
            },
            data: this.radio2 === '品类'?categoryData:goodsData
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep .el-card__header {
  padding: 11.5px 20px;
}

.main {
  height: 515px;
}
</style>
