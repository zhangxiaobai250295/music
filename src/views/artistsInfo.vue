<template>
  <div class="page">
    <Top
      :title="title"
      :img="img"
      :count="formatData.length"
    ></Top>
    <Scroll class="page-info-list" :data="formatData">
      <!--@clickItem="addToPlay"-->
      <SongList :data="formatData" @clickItem="addToPlay"></SongList>
    </Scroll>
  </div>
</template>

<script>
  import axios from 'axios';
  import infoMixin from '../common/js/infoMixin';
  import { formatSongDetail } from '../common/js/util';
  import { mapMutations } from 'vuex';
  export default {
    name: 'artistsInfo',
    mixins: [infoMixin],
    methods: {
      ...mapMutations([
        'SET_FULLSCREEN',
        'SET_PLAY_LIST',
        'SET_SEQUENCE_LIST',
        'SET_CURRENT_INDEX'
      ]),
      async getInfo(id) {
        const { data } = await axios.get(`/api/artists?id=${id}`);
        this.formatData = formatSongDetail(data.hotSongs);
      },
      addToPlay(item, index) {
        console.log(111);
        // mini播放器或者全屏播放器
        this.SET_FULLSCREEN(true);
        // 播放列表
        this.SET_PLAY_LIST(this.formatData);
        // 顺序播放列表
        this.SET_SEQUENCE_LIST(this.formatData);
        // 当前播放歌曲的下标
        this.SET_CURRENT_INDEX(index);
      }
    },
    created() {
      this.getInfo(this.$route.params.id);
    }
  };
</script>

<style lang="less" scoped>

</style>
