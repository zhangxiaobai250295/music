<template>
  <div class="page">
    <div>
      <mHeader>全部歌手</mHeader>
      <ArtistList @clickItem="goToArtistsInfo" :data="artistsData" class="artist"></ArtistList>
    </div>
    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import axios from 'axios';
  import mHeader from '../components/mHeader';
  import ArtistList from '../components/artistList';
  export default {
    name: 'artists',
    components: {
      mHeader, ArtistList
    },
    data() {
      return {
        artistsData: []
      };
    },
    methods: {
      async getArtists() {
        const { data } = await axios.get('/api/top/artists');
        // console.log(data);
        if (data.code === 200) {
          this.artistsData = data.artists;
        }
      },
      goToArtistsInfo(item) {
        this.$router.push({
          name: 'artistsInfo',
          params: {
            id: item.id
          }
        });
      }
    },
    created() {
      this.getArtists();
    }
  };
</script>

<style lang="less" scoped>
.artist{
  margin-top: 90px;
  background-color: #fff;
  padding: 0 20px;
}
</style>
