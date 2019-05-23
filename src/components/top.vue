<template>
  <div>
    <div class="top" :style="{'backgroundImage': `url(${img}?param=400y400)`}">
      <mHeader :red="false">{{title}}</mHeader>
      <img :src="`${img}?param=400y400`" alt="">
    </div>
    <!--<div class="count">-->
      <!--共有{{count}}首歌曲-->
    <!--</div>-->
    <Count>{{count}}</Count>
  </div>
</template>

<script>
  import mHeader from './mHeader';
  import Count from './count';
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      img: {
        type: String,
        default: ''
      },
      count: {
        type: Number,
        default: 0
      }
    },
    name: 'top',
    components: {
      mHeader, Count
    }
  };
</script>

<style lang="less" scoped>
.top{
  position: relative;
  width: 100%;
  height: 300px;
  /*background-image: url("../assets/image/preview.jpg");*/
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  overflow: hidden;
  &:after{
    content: '';
    /*width: calc(100% + 40px);*/
    /*height: calc(100% + 40px);*/
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    position: absolute;
    left: -40px;
    top: -40px;
    background: inherit;
    filter:blur(20px);
  }

  img{
    width: 120px;
    height: 120px;
    border: 10px solid #9e8d7f;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 60%;
    transform: translate3d(-50%, -50%, 0);
    /*transform: translate(-50%, -50%);*/
    z-index: 1;
  }
}
/*.count{*/
  /*height: 80px;*/
  /*line-height: 80px;*/
  /*font-size: 26px;*/
  /*color: #808080;*/
  /*padding-left: 30px;*/
/*}*/
</style>
