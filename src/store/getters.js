const getters = {
  fullScreen(state) {
    return state.fullScreen;
  },
  playList(state) {
    return state.playList;
  },
  sequencesList(state) {
    return state.sequencesList;
  },
  currentIndex(state) {
    return state.currentIndex;
  },
  mode(state) {
    return state.mode;
  },
  currentSong(state) {
    // 当前播放歌曲的信息
    return state.playList[state.currentIndex];
  }
};

export default getters;
