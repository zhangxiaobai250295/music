<template>
  <div>
    <div v-show="!fullScreen" class="mini-player">
      <div class="player-info" @click="toogleShow(true)">
        <div class="player-img">
          <img :src="songImg" alt="">
        </div>
        <div>
          <p class="player-name">{{songName}}</p>
          <p class="player-artists">
            <span v-for="(item,index) in songArtists" :key="index">{{item.name}}</span>
          </p>
        </div>
      </div>
      <div class="player-operate">
        <i class="iconfont icon-op" @click="togglePlay" :class="playIcon"></i>
        <i class="iconfont icon-xiayiqu" @click="next"></i>
      </div>
      <div class="mini-progress" :style="{width: `${barPercent}`}"></div>
    </div>
    <transition name="player">
      <div v-show="fullScreen" class="player" :style="{'backgroundImage': `url(${songImg})`}">
        <div class="player-mask"></div>
        <div class="player-header">
          <i class="iconfont icon-xia" @click="toogleShow(false)"></i>
          <div class="header-info">
            <p>{{songName}}</p>
            <p class="header-artists">
              <span v-for="(item,index) in songArtists" :key="index">{{item.name}}</span>
            </p>
          </div>
        </div>
        <swiper :options="swiperOption">
          <swiper-slide class="img-container">
            <img :src="songImg" alt="">
            <i class="iconfont icon-xiai"></i>
          </swiper-slide>
          <swiper-slide class="lyric-container">
            <Scroll ref="lyricScroll" class="lyric-scroll">
              <div>
                <ul v-if="lyricLines.length > 0">
                  <li ref="lyricLine" class="list-item" :class="{'active': index === currentLineNumber}" v-for="(item,index) in lyricLines" :key="index">
                    {{item.text}}
                  </li>
                </ul>
                <div v-else>暂无歌词</div>
              </div>
            </Scroll>
          </swiper-slide>
          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
        <div class="player-operate">
          <div class="operate-mask"></div>
          <div class="progress">
            <span class="time">{{formatTime(currentTime)}}</span>
            <div class="progress-bar" ref="progressBar" @click="progressClick">
              <div class="bar-moved" :style="{width: `${barPercent}`}"></div>
              <div class="bar-btn" :style="{left: `${barPercent}`}" @touchmove.prevent="progressMove" @touchend="progressEnd" ></div>
            </div>
            <span class="time">{{formatTime(overTime)}}</span>
          </div>
          <div class="operate-icon">
            <i class="iconfont  fs-40" @click="changeMode" :class="modeIcon"></i>
            <i class="iconfont icon-shangyiqu fs-80" @click="prev"></i>
            <i class="iconfont fs-100" @click="togglePlay" :class="playIcon"></i>
            <i class="iconfont icon-xiayiqu fs-80" @click="next"></i>
            <i class="iconfont icon-more fs-40" @click="togglePlaylistshow"></i>
          </div>
        </div>
      </div>
    </transition>
    <div v-if="playlistShow" class="playlist-mask" @click="togglePlaylistshow"></div>
    <transition name="playlist">
      <Scroll class="playlist-scroll" v-if="playlistShow">
        <ul>
          <li v-for="(item,index) in playList" :key="index">
            <p>{{item.name}} - <span class="artists-name" v-for="(arItem,arIndex) in item.ar" :key="arIndex">{{arItem.name}}</span></p>
            <i class="iconfont icon-shanchu2"></i>
          </li>
        </ul>
        <div class="close" @click="togglePlaylistshow">关闭</div>
      </Scroll>
    </transition>
    <audio :src="musicData.url" ref="audio" @ended="end" @timeupdate="updateTime"></audio>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';
  import { playMode } from '../common/js/aliasConfig';
  import axios from 'axios';
  import Scroll from './scroll';
  export default {
    name: 'player',
    components: {
      Scroll
    },
    data() {
      return {
        swiperOption: {
          pagination: {
            el: '.swiper-pagination'
          }
        },
        musicData: {},
        lyricData: null,
        // 播放的状态
        playing: false,
        // 当前播放的时间
        currentTime: 0,
        overTime: 0,
        // 控制updateTime
        touchBarWillMove: false,
        // 格式化的歌词
        lyricLines: [],
        // 当前的歌词的位置
        currentLineNumber: 0,
        // 播放器里面的歌曲列表
        playlistShow: false
      };
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'sequencesList',
        'currentIndex',
        'currentSong',
        'mode'
      ]),
      songName() {
        return this.currentSong ? this.currentSong.name : '暂无播放歌曲';
      },
      songArtists() {
        return this.currentSong ? this.currentSong.ar : [];
      },
      songImg() {
        return this.currentSong ? `${this.currentSong.al.picUrl}?param=400y400` : '';
      },
      playIcon() {
        return this.playing ? 'icon-bofang' : 'icon-zanting';
      },
      modeIcon() {
        return this.mode === playMode.sequence ? 'icon-liebiaoxunhuan' : (this.mode === playMode.loop ? 'icon-danquxunhuan' : 'icon-suiji');
      },
      barPercent() {
        let p = this.currentTime / this.overTime;
        if (p === 0) {
          return 0;
        }
        // toFixed 四舍五入
        p = Number(p * 100).toFixed();
        return `${p}%`;
      }
    },
    methods: {
      ...mapMutations([
        'SET_FULLSCREEN',
        'SET_CURRENT_INDEX',
        'SET_MODE',
        'SET_PLAY_LIST'
      ]),
      toogleShow(val) {
        this.SET_FULLSCREEN(val);
        // this.fullScreen = val;
      },
      async getMusicUrl(id) {
        // 请求歌曲播放地址
        const { data } = await axios.get(`/api/song/url?id=${id}`);
        if (data.code === 200 && data.data[0].code === 200) {
          this.musicData = data.data[0];
          this.$nextTick(() => {
            this.togglePlay(true);
          });
        }
      },
      async getLyricData(id) {
        // 获取歌词
        const { data } = await axios.get(`/api/lyric?id=${id}`);
        if (data.code === 200 && data.lrc) {
          this.lyricData = data.lrc.lyric;
          // 格式化歌词
          this.initLines();
        } else {
          this.lyricData = null;
        }
      },
      togglePlay(val) {
        // 播放暂停操作
        if (!this.currentSong) return;
        if (val === true || val === false) {
          this.playing = val;
        } else {
          this.playing = !this.playing;
        }
        const audio = this.$refs.audio;
        if (this.playing) {
          audio.play();
        } else {
          audio.pause();
        }
      },
      prev() {
        const len = this.playList.length;
        let newIndex = this.currentIndex - 1;
        if (newIndex < 0) {
          newIndex = len - 1;
        }
        this.SET_CURRENT_INDEX(newIndex);
      },
      next() {
        const len = this.playList.length;
        let newIndex = this.currentIndex + 1;
        if (newIndex === len) {
          newIndex = 0;
        }
        this.SET_CURRENT_INDEX(newIndex);
      },
      changeMode() {
        const modeNumber = (this.mode + 1) % 3;
        this.SET_MODE(modeNumber);
        let newPlayList = [];
        if (this.mode === playMode.random) {
          newPlayList = this.getRandomList(this.sequencesList);
        } else {
          newPlayList = this.sequencesList;
        }
        const newIndex = newPlayList.findIndex(item => item.id === this.currentSong.id);
        this.SET_PLAY_LIST(newPlayList);
        this.SET_CURRENT_INDEX(newIndex);
      },
      getRandomList(arr) {
        const newArr = [].concat(arr);
        return newArr.sort((a, b) => (Math.random() > 0.5 ? -1 : 1));
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop();
        } else {
          this.next();
        }
      },
      loop() {
        const audio = this.$refs.audio;
        // currentTime 设置或返回音频中的当前播放位置（以秒计）。
        audio.currenTime = 0;
        audio.play();
      },
      updateTime(e) {
        if (!this.touchBarWillMove) {
          // currentTime 设置或返回音频中的当前播放位置（以秒计）。
          this.currentTime = e.target.currentTime;
          // duration 返回音频的长度（以秒计）。
          this.overTime = e.target.duration;
        }
        if (this.lyricData) {
          this.moveLyric();
        }
      },
      formatTime(val) {
        // 格式化时间
        if (isNaN(val)) return '00:00';
        let m = Math.floor(val / 60);
        let s = Math.floor(val % 60);
        if (m < 10) {
          m = `0${m}`;
        }
        if (s < 10) {
          s = `0${s}`;
        }
        return `${m}:${s}`;
      },
      progressMove(e) {
        this.touchBarWillMove = true;
        // 时间点拖动
        const pageX = e.touches[0].pageX;
        this.calcPercent(pageX);
      },
      calcPercent(x) {
        // 计算移动的百分比
        const offsetLeft = this.$refs.progressBar.offsetLeft;
        const barWidth = this.$refs.progressBar.clientWidth;
        let moveWidth = x - offsetLeft;
        if (moveWidth > barWidth) moveWidth = barWidth;
        if (moveWidth < 0) moveWidth = 0;
        let p = moveWidth / barWidth;
        this.currentTime = this.overTime * p;
        this.moveLyric();
      },
      progressEnd() {
        this.resetPlayer();
      },
      resetPlayer() {
        // 设置播放时间
        this.$refs.audio.currentTime = this.currentTime;
        // 开始播放
        this.togglePlay(true);
        this.touchBarWillMove = false;
      },
      progressClick(e) {
        // 播放条点击事件
        this.touchBarWillMove = true;
        const pageX = e.pageX;
        this.calcPercent(pageX);
        this.resetPlayer();
      },
      initLines() {
        // 格式化歌词
        this.lyricLines = [];
        if (this.lyricData) {
          // 把字符串分割成数组
          const lines = this.lyricData.split('\n');
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            // 匹配 [00:17.881]
            const timeExp = /\[(\d{2}):(\d{2}\.\d{2,3})\]/g;
            // exec() 方法用于检索字符串中的正则表达式的匹配。
            // 返回一个数组，其中存放匹配的结果。如果未找到匹配，则返回值为 null。
            const result = timeExp.exec(line);
            if (result) {
              const time = Number(result[1] * 60 * 1000) + Number(result[2] * 1000);
              // trim()去掉空格
              const text = line.replace(timeExp, '').trim();
              this.lyricLines.push({
                time,
                text
              });
            }
          }
        }
      },
      moveLyric() {
        // 歌词滚动
        this.currentLineNumber = this.findCurrentNumber(this.currentTime * 1000);
        if (this.currentLineNumber > 6) {
          this.$refs.lyricScroll.scrollToElement(this.$refs.lyricLine[this.currentLineNumber - 6], 1000);
        } else {
          this.$refs.lyricScroll.scrollTo(0, 0, 1000);
        }
      },
      findCurrentNumber(time) {
        for (let i = 0; i < this.lyricLines.length; i++) {
          if (time < this.lyricLines[i].time) {
            return i - 1;
          }
        }
        // 当歌词唱完后 时间却还没结束时 最后一句歌词高亮
        return this.lyricLines.length - 1;
      },
      togglePlaylistshow() {
        this.playlistShow = !this.playlistShow;
      }
    },
    watch: {
      currentSong(newVal, oldVal) {
        if (oldVal === undefined || newVal.id !== oldVal.id) {
          this.getMusicUrl(newVal.id);
          this.getLyricData(newVal.id);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
.mini-player{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #150a06;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  padding: 10px 30px 10px 20px;
  z-index: 9999;

  .player-info{
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .player-img{
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    border-radius: 50%;
    overflow: hidden;
    border: 4PX solid #695945;
    margin-right: 20px;

    img{
      width: 100%;
    }
  }
  .player-name{
    font-size: 26px;
    margin-bottom: 10px;
    line-height: 30px;
  }
  .player-artists{
    font-size: 20px;
    color: #b2b2b2;
  }
  .player-operate{
    i{
      font-size: 65px;
      color: #c9c3c1;
    }
    .icon-op{
      margin-right: 50px;
    }
  }
  .mini-progress{
    /*width: 30%;*/
    height: 6px;
    background-color: #f2353c;
    position: absolute;
    left: 0;
    bottom: 0;
  }
}
.player{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  /*background-image: url("../assets/image/user-bg.png");*/
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  overflow: hidden;
  color: #fff;

  &:after{
    content: '';
    background: inherit;
    position: absolute;
    top: -40px;
    left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    filter: blur(20px);
    z-index: -2;
  }
  .player-mask{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: black;
    opacity: .5;
    z-index: -1;
  }
  .player-header{
    height: 60px;
    padding: 30px;
    i{
      font-size: 46px;
      position: absolute;
      left: 30px;
      top: 30px;
    }
    .header-info{
      width: 70%;
      margin: 0 auto;
      text-align: center;
      /*background-color: pink;*/
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 30px;
    }
    .header-artists{
      font-size: 18px;
      color: #b2b2b2b2;
      margin-top: 12px;
    }
  }
  .swiper-container{
    width: 100%;
    height: calc(100% - 360px);
  }
  .img-container{
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    img{
      height: 500px;
      width: 500px;
      border-radius: 50%;
      border: 20PX solid #2b433c;
    }
    i{
      position: absolute;
      left: 30px;
      bottom: 30px;
      font-size: 50px;
      color: #c4b9bb;
    }
  }
  .player-operate{
    height: 300px;
    width: 100%;
    position: relative;
    /*background-color: pink;*/
    .operate-mask{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background-color: rgba(0,0,0,.1);
      z-index: -1;
    }
  }
  .progress{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 50px;
    padding: 30px;
    .time{
      width: 60px;
    }
    .progress-bar{
      width: 560px;
      height: 4px;
      background-color: #7e7374;
      position: relative;
      margin: 0 30px;
    }
    .bar-moved{
      position: absolute;
      left: 0;
      top: 0;
      height: 4px;
      background-color: #f2353c;
      /*width: 30px;*/
    }
    .bar-btn{
      position: absolute;
      /*left: 30px;*/
      top: 0;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #fff;
      border: 5PX solid #5d5759;
      transform: translate3d(-50%, -50%, 0);
    }
  }
  .operate-icon{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
    color: #c4b9bb;
    .fs-40{
      font-size: 40px;
    }
    .fs-80{
      font-size: 80px;
    }
    .fs-100{
      font-size: 100px;
    }
  }
}
.player-enter-active, .player-leave-active{
  transition: all .3s;
  opacity: 1;

  .player-header, .player-operate{
    transform: translate3d(0,0,0);
    transition: all .3s cubic-bezier(0.86,0.18,0.82,1.32);
  }
}
.player-enter, .player-leave-to{
  opacity: 0;
  .player-header{
    transform: translate3d(0,-100px,0);
  }
  .player-operate{
    transform: translate3d(0,100px,0);
  }
}
.lyric-container{
  height: 100%;
  box-sizing: border-box;
  padding: 30px 30px 70px 30px;
  overflow: hidden;
}
.lyric-scroll{
  height: 100%;
  width: 100%;
  color: #fff;
  overflow: hidden;
  text-align: center;
  .list-item{
    font-size: 24px;
    line-height: 1.5;
    min-height: 50px;
    opacity: .5;
    &.active{
      opacity: 1;
    }
  }
}
.playlist-scroll{
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 800px;
  overflow: hidden;
  z-index: 99999;
  background-color: rgba(255,255,255, .95);
  border-radius: 10px 10px 0 0;

  ul{
    padding-bottom: 80px;

    li{
      padding: 30px 20px;
      font-size: 24px;
      border-bottom: 1PX solid #e6e6e6;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      /*color: #000;*/
    }
    .artists-name{
      font-size: 18px;
      color: #b3b3b3;
    }
    i{
      font-size: 24px;
      color: lightgray;
    }
  }
  .close{
    line-height: 80px;
    font-size: 30px;
    color: #333;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1PX solid #e6e6e6;
    background-color: white;
  }
}
.playlist-mask{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background-color: rgba(0,0,0,.4);
}
.playlist-enter-active,.playlist-leave-active{
  transition: all .3s;
}
.playlist-enter,.playlist-leave-to{
  transform: translate3d(0,100%,0);
}
</style>
