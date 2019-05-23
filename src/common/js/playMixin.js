import { mapMutations } from 'vuex';
export default {
  methods: {
    ...mapMutations([
      'SET_FULLSCREEN',
      'SET_PLAY_LIST',
      'SET_SEQUENCE_LIST',
      'SET_CURRENT_INDEX'
    ]),
    addToPlay(item, index) {
      // mini播放器或者全屏播放器
      this.SET_FULLSCREEN(true);
      // 播放列表
      this.SET_PLAY_LIST(this.formatData);
      // 顺序播放列表
      this.SET_SEQUENCE_LIST(this.formatData);
      // 当前播放歌曲的下标
      this.SET_CURRENT_INDEX(index);
    }
  }
};
