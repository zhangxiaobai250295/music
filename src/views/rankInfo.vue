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
  import { formatSongDetail } from '@/common/js/util';
  export default {
    name: 'rankInfo',
    mixins: [infoMixin],
    methods: {
      async getInfo(id) {
        const { data } = await axios.get(`/api/playlist/detail?id=${id}`);
        this.formatData = formatSongDetail(data.playlist.tracks);
      }
    },
    created() {
      this.getInfo(this.$route.params.id);
    }
  };
</script>

<style lang="less" scoped>

</style>
