const mutations = {
  SET_FULLSCREEN(state, val) {
    // 设置大播放器是否显示
    state.fullScreen = val;
  },
  SET_PLAY_LIST(state, val) {
    // 设置播放列表
    state.playList = val;
  },
  SET_SEQUENCE_LIST(state, val) {
    // 备份播放列表数据
    state.sequencesList = val;
  },
  SET_CURRENT_INDEX(state, val) {
    // 设置当前播放歌曲的下标
    state.currentIndex = val;
  },
  SET_MODE(state, val) {
    // 设置播放模式
    state.mode = val;
  },
  DEL_FROM_PLAY_LIST(state, val) {
    // 删除播放列表的歌曲
    const index = state.playList.findIndex(item => item.id === val.delSong.id);
    state.playList.splice(index, 1);
    if (val.delSong.id !== val.curSong.id) {
      state.currentIndex = state.playList.findIndex(item => item.id === val.curSong.id);
    }
  },
  SET_HISTORY_LIST(state, val) {
    // 设置历史播放记录
    let haveHistory = false;
    for (let i = 0; i < state.historyList.length; i += 1) {
      if (state.historyList[i].id === val.id) {
        haveHistory = true;
        return;
      }
    }
    if (!haveHistory) {
      state.historyList.push(val);
    }
    localStorage.setItem('HistoryList', JSON.stringify(state.historyList));
  },
  SET_LOVE_LIST(state, val) {
    // 设置喜欢歌曲
    let haveLove = false;
    for (let i = 0; i < state.loveList.length; i += 1) {
      if (state.loveList[i].id === val.id) {
        haveLove = true;
        return;
      }
    }
    if (!haveLove) {
      state.loveList.push(val);
    }
    localStorage.setItem('LoveList', JSON.stringify(state.loveList));
  },
  DEL_FROM_LOVE_LIST(state, val) {
    const index = state.loveList.findIndex(item => item.id === val.id);
    state.loveList.splice(index, 1);
    localStorage.setItem('LoveList', JSON.stringify(state.loveList));
  },
  SET_SEARCH_TEXT(state, val) {
    // 搜索历史
    let haveText = false;
    for (let i = 0; i < state.searchText.length; i += 1) {
      if (state.searchText[i] === val.trim()) {
        haveText = true;
        return;
      }
    }
    if (!haveText) {
      state.searchText.unshift(val);
      state.searchText = state.searchText.slice(0, 10);
    }
    localStorage.setItem('SearchText', JSON.stringify(state.searchText));
  },
  DEL_FROM_SEARCH_TEXT(state, val) {
    for (let i = 0; i < state.searchText.length; i += 1) {
      if (state.searchText[i] === val.trim()) {
        state.searchText.splice(i, 1);
      }
      localStorage.setItem('SearchText', JSON.stringify(state.searchText));
    }
  }
};

export default mutations;
