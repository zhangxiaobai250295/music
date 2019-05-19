<template>
  <div class="page">
    <Top
      :title="title"
      :img="img"
      :count="formatData.length"
    ></Top>
    <Scroll class="page-info-list" :data="formatData">
      <SongList :data="formatData"></SongList>
    </Scroll>
  </div>
</template>

<script>
  import axios from 'axios';
  import infoMixin from '../common/js/infoMixin';
  import { formatSongDetail } from '../common/js/util';

  export default {
    name: 'recommend',
    mixins: [infoMixin],
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
