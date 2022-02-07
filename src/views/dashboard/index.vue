<template>
  <div class="indexContainer">
    <div class="content">
      <TopView></TopView>
      <MiddleView></MiddleView>
      <BottomView></BottomView>
    </div>
  </div>
</template>

<script>
import TopView from './components/TopView'
import MiddleView from './components/MiddleView'
import BottomView from './components/BottomView'
export default {
  name: 'Dashboard',
  components:{
    TopView,
    MiddleView,
    BottomView
  },
  
  mounted(){
    this.getEchartsData()
  },
  methods:{
    getEchartsData(){
      this.$store.dispatch('echarts/getEchartsData')
    }
  }
}
</script>

<style lang="scss" scoped>
  .indexContainer{
    padding: 20px;
    .content{
      background-color: #ddd;
      padding: 20px;
    }
  }
</style>
