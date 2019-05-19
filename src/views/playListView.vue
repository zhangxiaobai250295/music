<template>
  <div class="page">
    <div>
      <mHeader>全部歌单</mHeader>
      <div class="play-wrapper">
        <PlayList :data="playListData" @clickItem="goToPlayListInfo"></PlayList>
      </div>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import mHeader from '../components/mHeader';
  import PlayList from '../components/playList';

  export default {
    name: 'playListView',
    components: {
      mHeader, PlayList
    },
    data() {
      return {
        playListData: []
      };
    },
    methods: {
      async getPlayList() {
        const { data } = await axios.get('/api/personalized');
        // console.log(data);
        if (data.code === 200) {
          this.playListData = data.result;
        }
      },
      goToPlayListInfo(item) {
        this.$router.push({
          name: 'playListInfo',
          params: {
            id: item.id
          }
        });
      }
    },
    created() {
      this.getPlayList();
    }
  };
</script>

<style lang="less" scoped>
.play-wrapper{
  margin-top: 90px;
  background-color: #fff;
  padding: 30px 20px;
}
</style>
