import { playMode } from '../common/js/aliasConfig';

const state = {
  // 屏播放器或者大屏
  fullScreen: false,
  // 播放列表
  playList: [],
  // 列表的备份
  sequencesList: [],
  // 当前播放
  currentIndex: 0,
  // 播放方式
  mode: playMode.sequence,
  // 历史播放记录
  historyList: JSON.parse(localStorage.getItem('HistoryList')) || [],
  // 喜欢列表
  loveList: JSON.parse(localStorage.getItem('LoveList')) || [],
  // 搜索列表
  searchText: JSON.parse(localStorage.getItem('SearchText')) || []
};

export default state;
