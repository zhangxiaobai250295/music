<template>
  <div class="page">
    <div class="search-header">
      <i class="iconfont icon-chaxun" @click="searchSongs"></i>
      <input type="text" v-model="keyWord" @keyup.enter="searchSongs" @focus="toggleResultShow(false)">
      <i class="iconfont icon-shanchu2" v-show="keyWord" @click="clearKeyWord"></i>
      <div class="cancel" @click="goBack">取消</div>
    </div>
    <Scroll class="list-container history-list" v-show="!resultShow">
      <ul>
        <li class="list-title" v-if="searchText.length">搜索历史</li>
        <li class="list-item history-item" v-for="(item,index) in searchText" :key="index" @click="addToSearch(item)">
          {{item}} <i class="iconfont icon-shanchu1" @click.stop="delKeyWord(item)"></i>
        </li>
        <li class="list-title">热门搜索</li>
        <li class="list-item" v-for="(item,index) in hotWord" :key="`hot-${index}`" @click="addToSearch(item.first)">{{item.first}}</li>
      </ul>
    </Scroll>
    <div v-show="resultShow">
      <p class="list-count">共有{{resultData.length}}首歌曲</p>
      <Scroll class="list-container result-list">
        <ul>
          <li class="list-item" v-for="(item,index) in resultData" :key="index" @click="addToPlay(item, index)">
            <p>{{item.name}}</p>
            <p class="artists-name">
              <span v-for="(info,list) in item.ar" :key="list">{{info.name}}</span>
            </p>
          </li>
        </ul>
      </Scroll>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Scroll from '../components/scroll';
  import { mapGetters, mapMutations } from 'vuex';
  import { formatSongDetail } from '../common/js/util';
  import PlayMixin from '../common/js/playMixin';

  export default {
    name: 'search',
    mixins: [PlayMixin],
    components: {
      Scroll
    },
    data() {
      return {
        // 控制搜索界面或者搜索结果的显示
        resultShow: false,
        // 热门搜索的数据
        hotWord: [],
        // 搜索框的输入值
        keyWord: '',
        // 搜索的结果
        resultData: []
      };
    },
    computed: {
      ...mapGetters([
        'searchText'
      ])
    },
    methods: {
      ...mapMutations([
        'SET_SEARCH_TEXT',
        'DEL_FROM_SEARCH_TEXT'
      ]),
      async searchHotWords() {
        // 获取热门搜索结果
        const { data } = await axios.get('/api/search/hot');
        if (data.code === 200) {
          this.hotWord = data.result.hots;
        }
      },
      async searchSongs() {
        if (!this.keyWord.trim()) return;
        const { data } = await axios.get(`/api/search?keywords=${this.keyWord}`);
        if (data.code === 200) {
          this.resultData = formatSongDetail(data.result.songs);
        }
        this.SET_SEARCH_TEXT(this.keyWord);
        this.toggleResultShow(true);
      },
      toggleResultShow(val) {
        this.resultShow = val;
      },
      addToSearch(val) {
        // 点击搜索历史和热门搜索的数据时
        this.keyWord = val;
        this.searchSongs();
      },
      goBack() {
        this.$router.back();
      },
      delKeyWord(val) {
        this.DEL_FROM_SEARCH_TEXT(val);
      },
      clearKeyWord() {
        this.keyWord = '';
      },
      addToPlay(item, index) {
        // mini播放器或者全屏播放器
        this.SET_FULLSCREEN(true);
        // 播放列表
        this.SET_PLAY_LIST(this.resultData);
        // 顺序播放列表
        this.SET_SEQUENCE_LIST(this.resultData);
        // 当前播放歌曲的下标
        this.SET_CURRENT_INDEX(index);
      }
    },
    created() {
      this.searchHotWords();
    }
  };
</script>

<style lang="less" scoped>
.search-header{
  padding: 15px 30px;
  background-color: #f2353c;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;

  input{
    border-radius: 10px;
    height: 60px;
    font-size: 32px;
    color: #999;
    padding-left: 65px;
    flex: 1;
    box-sizing: border-box;
    outline: none;
  }
  .icon-chaxun{
    position: absolute;
    left: 45px;
    top: 29px;
    font-size: 32px;
    color: #999;
  }
  .icon-shanchu2{
    position: absolute;
    top: 29px;
    right: 130px;
    font-size: 32px;
    color: #999;
  }
  .cancel{
    margin-left: 30px;
    font-size: 28px;
    color: #fff;
  }
}
.history-list{
  height: calc(100vh - 200px);
}
.list-container{
  overflow: hidden;
  .list-title{
    padding: 0 30px;
    line-height: 65px;
    color: #989898;
    font-size: 24px;
  }
  .list-item{
    padding: 30px;
    font-size: 28px;
    color: #333;
    background-color: #fff;
    border-bottom: 1PX solid #e6e6e6;
  }
  .history-item{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .icon-shanchu1{
    font-size: 30px;
    color: #999;
  }
  .artists-name{
    margin-top: 10px;
    color: #b2b2b2;
    font-size: 20px;
  }
}
.list-count{
  padding: 0 30px;
  line-height: 80px;
  color: #808080;
  font-size: 26px;
}
.result-list{
  height: calc(100vh - 280px);
}
</style>
