<template>
  <div>
    <div class="header">
      <div class="personal">我的</div>
      <div>MIKO</div>
      <i class="iconfont icon-chaxun"></i>
    </div>
    <div class="swiper-content home-item">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item,index) in newSongData" :key="index">
          <img :src="`${item.song.album.blurPicUrl}?param=400y400`" alt="">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
      <ul class="nav">
        <li>
          <div class="icon-container">
            <i class="iconfont icon-date icon"></i>
          </div>
          <p>每日推荐</p>
        </li>
        <li>
          <div class="icon-container">
            <i class="iconfont icon-music-list icon"></i>
          </div>
          <p>歌单</p>
        </li>
        <li>
          <div class="icon-container">
            <i class="iconfont icon-rank icon"></i>
          </div>
          <p>排行版</p>
        </li>
      </ul>
    </div>
    <div class="home-item">
      <div class="title-wrapper">
        <div class="title">
          每日推荐
        </div>
        <div class="more">
          <i class="iconfont icon-more"></i>
        </div>
      </div>
      <playList :data="playListData"></playList>
    </div>
    <div class="home-item">
      <div class="title-wrapper">
        <div class="title">
          热门歌手
        </div>
        <div class="more">
          <i class="iconfont icon-more"></i>
        </div>
      </div>
      <ul class="artists-list">
        <li v-for="(item,index) in artistsData" :key="index">
          <img :src="item.picUrl" alt="">
          <div>
            <p class="name">{{item.name}}</p>
            <p class="info">专辑{{item.albumSize}}张，共{{item.musicSize}}首歌</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import playList from '../components/playList';
  export default {
    name: 'home',
    components: {
      playList
    },
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          }
        },
        newSongData: [],
        playListData: [],
        artistsData: []
      };
    },
    methods: {
      async getNewSongs() {
        const { data } = await axios.get('/api/personalized/newsong');
        // console.log(data);
        if (data.code === 200) {
          this.newSongData = data.result;
        }
      },
      async getPlayList() {
        const { data } = await axios.get('/api/personalized');
        // console.log(data);
        if (data.code === 200) {
          this.playListData = data.result.slice(0, 6);
        }
      },
      async getArtists() {
        const { data } = await axios.get('/api/top/artists?limit=10');
        // console.log(data);
        if (data.code === 200) {
          this.artistsData = data.artists;
        }
      }
    },
    created() {
      this.getNewSongs();
      this.getPlayList();
      this.getArtists();
    }
  };
</script>

<style lang="less">
  .header{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 90px;
    background-color: #f2353c;
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    font-size: 36px;
    z-index: 9;

    .personal{
      color: #f9aeb0;
    }
    i{
      font-size: 36px;
    }
  }
  .home-item{
    padding: 20px;
    margin-bottom: 20px;
    background-color: #fff;

    .title-wrapper{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .title{
      padding-left: 20px;
      font-size: 34px;
      border-left: 6px solid #f2353c;
      color: #4c4c4c;
      line-height: 38px;
    }
    .more{
      width: 50px;
      height: 38px;
      border: 1px solid #ccc;
      border-radius: 25px;
      color: #bfbfbf;
      text-align: center;
      line-height: 38px;
    }
  }
  .swiper-content{
    .swiper-container{
      margin-top: 90px;
      width: 100%;
      height: 350px;
      border-radius: 10px;

      img{
        width: 100%;
      }
    }
  }
  .nav{
    padding: 20px 30px 0 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    li{
      text-align: center;
    }
    .icon-container{
      width: 120px;
      height: 120px;
      line-height: 120px;
      border-radius: 50%;
      background-color: red;
      margin-bottom: 20px;
    }
    .icon{
      font-size: 70px;
      color: #fff;
    }
  }
  .artists-list{
    li{
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 30px;
      border-top: 1PX solid #e6e6e6;
      margin-left: -20px;
      margin-right: -20px;

      img{
        width: 80px;
        height: 80px;
        margin-right: 20px;
      }
      .name{
        font-size: 30px;
        color: #000;
        margin-bottom: 20px;
      }
      .info{
        font-size: 24px;
        color: #b2b2b2;
      }
    }
  }
</style>
