<template>
  <div class="page">
    <mHeader>最近听过</mHeader>
    <Count class="mt90">{{historyList.length}}</Count>
    <Scroll class="user-list-container">
      <SongList :data="historyList" @clickItem="addToPlay"></SongList>
    </Scroll>
  </div>
</template>

<script>
  import mHeader from '../components/mHeader';
  import Count from '../components/count';
  import Scroll from '../components/scroll';
  import SongList from '../components/songList';
  import { mapGetters } from 'vuex';
  import PlayMixin from '../common/js/playMixin';
  export default {
    name: 'userHistoryList',
    mixins: [PlayMixin],
    components: {
      mHeader, Count, Scroll, SongList
    },
    computed: {
      ...mapGetters([
        'historyList'
      ])
    },
    methods: {
      addToPlay(item, index) {
        // mini播放器或者全屏播放器
        this.SET_FULLSCREEN(true);
        // 播放列表
        this.SET_PLAY_LIST(this.historyList);
        // 顺序播放列表
        this.SET_SEQUENCE_LIST(this.historyList);
        // 当前播放歌曲的下标
        this.SET_CURRENT_INDEX(index);
      }
    }
  };
</script>

<style lang="less" scoped>
.user-list-container{
  height: calc(100vh - 280px);
  overflow: hidden;
}
</style>
