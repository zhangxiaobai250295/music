import { playMode } from '../common/js/aliasConfig';

const state = {
  // 屏播放器或者大屏
  fullScreen: false,
  // 播放列表
  playList: [],
  sequencesList: [],
  // 当前播放
  currentIndex: 0,
  // 播放方式
  mode: playMode.sequence
};

export default state;
