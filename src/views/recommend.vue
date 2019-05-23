<template>
  <div class="page">
    <Top
      :title="title"
      :img="img"
      :count="formatData.length"
    ></Top>
    <Scroll class="page-info-list" :data="formatData">
      <SongList :data="formatData" @clickItem="addToPlay"></SongList>
    </Scroll>
  </div>
</template>

<script>
  import axios from 'axios';
  import infoMixin from '../common/js/infoMixin';
  import { formatSongDetail } from '../common/js/util';
  import PlayMixin from '../common/js/playMixin';

  export default {
    name: 'recommend',
    mixins: [infoMixin, PlayMixin],
    methods: {
      async getNewSongs() {
        const { data } = await axios.get('/api/personalized/newsong');
        // console.log(data);
        if (data.code === 200) {
          this.formatData = formatSongDetail(data.result);
          // console.log(this.formatData);
        }
      }
    },
    created() {
      this.getNewSongs();
    }
  };
</script>

<style lang="less" scoped>

</style>
