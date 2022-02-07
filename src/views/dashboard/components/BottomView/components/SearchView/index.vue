<template>
  <div>
    <el-card>
      <div slot="header">
        关键词搜索
      </div>
      <div class="content">
        <div class="main">
          <el-row :gutter="10">
            <el-col :span="18">
              <div> 
                <div class="title">搜索用户数</div>
                <div class="count">{{searchData.totalUserNum | numberFormat}}</div>
                <div class="view">
                  <v-chart :options="getOptions(1)" autoresize></v-chart>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div> 
                <div class="title">搜索量</div>
                <div class="count">{{searchData.totalSearchNum | numberFormat}}</div>
                <div class="view">
                  <v-chart :options="getOptions(2)" autoresize></v-chart>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="table">
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              type="index"
              label="排名"
              width="100">
            </el-table-column>
            <el-table-column
              prop="word"
              label="关键字"
              width="width">
            </el-table-column>
            <el-table-column
              prop="count"
              label="搜索数量"
              width="width">
            </el-table-column>
            <el-table-column
              prop="user"
              label="搜索用户数"
              width="width">
            </el-table-column>
            <el-table-column
              prop="percent"
              label="搜索占比"
              width="width">
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
            @current-change="page = $event"
            style="text-align:center;margin:20px 0;"
            :current-page="page"
            :page-size="limit"
            layout=" prev,pager,next,total"
            :total="searchWord.length">
          </el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  name: 'SearchView',
  data() {
    return {
      page:1,
      limit:5,
    };
  },
  methods: {
    getOptions(num){
      let {
          keywords,
          userNums,
          searchNums,
        } = this.searchData
      return {
        grid:{
          left:0,
          top:0,
          right:0,
          bottom:0,
        },

        xAxis:{
          show:false,
          data:keywords || []
        },

        yAxis:{
          show:false
        },
        series:{
          type:'line',
          data:num === 1? userNums : searchNums,
          itemStyle:{
            opacity:0
          },
          areaStyle:{
            color:'hotpink'
          },
          smooth:true
        },

        tooltip:{
          trigger:'axis'
        },
        color:'skyblue'
      }
    }  
  },

  computed:{
    ...mapState({
      searchWord:state => state.echarts.echartsData.searchWord || []
    }),
    
    searchData(){
      /*
        "searchWord": [
          {
          "word": "北京",
          "count": 3440,
          "user": 1626
        }]
      */
      // 需要的数据
      // x轴所需要的关键字组成的数组
      // series 里面的data也需要数组 （两种：用户数组成的数组   搜索量组成的数组）
      if(this.searchWord){
        // x轴数据
        let keywords = this.searchWord.map(item => item.word)
        // 用户数量图形series里面的data
        let userNums = this.searchWord.map(item => item.user)
        // 搜索数量图形series里面的data
        let searchNums = this.searchWord.map(item => item.count)
        // 用户的总数
        let totalUserNum = userNums.reduce((prev,item) => {
          prev += item
          return prev
        },0)
        // 搜索的总数
        let totalSearchNum = searchNums.reduce((prev,item) => {
          prev += item
          return prev
        },0)

        this.searchWord.forEach(item => item.percent = (item.count*100 / totalSearchNum).toFixed(2) + '%')
        // 想要完成表格：
        // 1、给searchWord里面每个对象需要添加一个字段
        // 2、前端自己分页计算每页数据

        return {
          keywords,
          userNums,
          searchNums,
          totalUserNum,
          totalSearchNum
        }
      }else{
        return {}
      }
    },
    // 计算分页数据让表格使用
    // 前端分页
    tableData(){
      return this.searchWord.slice((this.page - 1) * this.limit,this.page * this.limit)
    }
  }
}
</script>

<style lang='scss' scoped>
.title{
  font-size: 14px;
  color: #aaa;
}
.count{
  font-size: 24px;
  letter-spacing: 1px;
}
.view{
  width: 100%;
  height: 50px;
}
.table{
  height: 350px;
}
</style>
