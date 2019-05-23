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
  },
  isLove(state) {
    // 判断歌曲是否被收藏
    let isLove = false;
    const currentSong = state.playList[state.currentIndex];
    for (let i = 0; i < state.loveList.length; i += 1) {
      if (currentSong && state.loveList[i].id === currentSong.id) {
        isLove = true;
        return isLove;
      }
    }
    return isLove;
  },
  searchText(state) {
    return state.searchText;
  },
  historyList(state) {
    return state.historyList;
  },
  loveList(state) {
    return state.loveList;
  }
};

export default getters;
