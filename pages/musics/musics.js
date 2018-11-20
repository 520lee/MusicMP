// pages/musics/musics.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topList: ['新歌榜', '原创榜', '热歌榜', '飙升榜', 'Top榜'],
    topid: 2,
    musicLrc: [],
    musicShow: true,
    searchShow: true,
    count: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(app.globalData.musicBase + app.globalData.hotList);
    var songsList = wx.getStorageSync('id' + this.data.topid);
    if (songsList) {
      this.proccessSong(this.data.count);
    } else {
      wx.request({
        url: app.globalData.musicBase + app.globalData.hotList,
        data: '',
        header: { 'Content-Type': 'json' },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.proccessData(res.data, that.data.topid);
        },
        fail: function (res) { console.log('getHotList error') },
        complete: function (res) { },
      });
    }
    this.setData({
      playing: app.globalData.playing
    });

    var bam = wx.getBackgroundAudioManager();
    wx.onBackgroundAudioPlay(function () {
      that.rotatePlayer();
      that.setData({
        playing: true
      });
    });

    wx.onBackgroundAudioPause(function () {
      that.rotatePlayer('stop');
      that.setData({
        playing: false
      });
    });

    wx.onBackgroundAudioStop(function () {
      that.rotatePlayer('stop');
      that.setData({
        playing: false
      });
      that.setData({
        id: ++that.data.id,
        playerLrc: ''
      })
      if (that.data.id >= that.data.songsList.length){
        that.setData({
          id: 0,
        })
      };
      var index = index = that.data.id;
      var song = that.data.songsList[index];
      that.getLrc(song.id);
      that.rotatePlayer();
      that.setData({
        playBar: song,
        playing: true
      });
      wx.playBackgroundAudio({
        dataUrl: song.dataUrl,
        title: song.name + '--' + song.singer,
        coverImgUrl: song.album,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    });

    bam.onTimeUpdate(function () {
      var musicLrc = that.data.musicLrc;
      var playerTime = Math.floor(bam.currentTime);
      if (musicLrc[playerTime] && musicLrc[playerTime] != ' ' && musicLrc[playerTime] != '') {
        that.setData({
          playerLrc: musicLrc[playerTime]
        })
      }
    });
  },

  proccessSong: function(count){
    var songsList = '';
    var cache = wx.getStorageSync('id' + this.data.topid);
    if (count < cache.length){
      songsList = cache.slice(0, count); 
    } else {
      songsList = wx.getStorageSync('id' + this.data.topid);
    }
    this.setData({
      songsList: songsList
    });
  },

  proccessData: function (songsData, topid) {
    var that = this;
    var List = [];
    this.setData({
      songsList: ''
    });
    console.log(songsData);
    for (var index in songsData.playlist.tracks) {
      var song = songsData.playlist.tracks[index];
      var id = song.id;
      var name = song.name;
      var singer = song.artists[0].name;
      var album = song.album.picUrl;
      var dataUrl = 'http://music.163.com/song/media/outer/url?id=' + id + '.mp3';
      var temp = {
        id: id,
        name: name,
        singer: singer,
        album: album,
        dataUrl: dataUrl
      };
      List.push(temp);
    }
    this.setData({
      List: List
    });
    wx.setStorageSync('id' + this.data.topid, List);
    this.proccessSong(this.data.count);
  },

  bindSong: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;  //获取自定义的ID值
    var song = this.data.songsList[id];
    this.getLrc(song.id);
    that.setData({
      id: id,
      playing: true,
      playBar: song
    });
    wx.playBackgroundAudio({
      dataUrl: song.dataUrl,
      title: song.name + '--' + song.singer,
      coverImgUrl: song.album,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
    this.rotatePlayer();
  },

  getLrc: function (songid) {
    var that = this;
    var url = app.globalData.lrc;
    wx.request({
      url: url,
      data: { id: songid },
      header: { 'Content-Type': 'json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.nolyric || res.data.uncollected || res.data.lrc.lyric == ''){
          that.setData({
            lrc: '纯音乐，无歌词',
            playerLrc: '纯音乐，无歌词',
            musicLrc: ''
          });
        } else {
          that.setData({
            lrc: res.data.lrc.lyric,
            musicLrc: that.proccessLyric(res.data.lrc.lyric)
          });
        }
      },
      fail: function (res) { console.log('getlrc error') },
      complete: function (res) { },
    })
  },

  getTopList: function (topid) {
    var url;
    var that = this;
    switch (topid) {
      case 0:
        url = app.globalData.musicBase + app.globalData.newList;
        break;
      case 1:
        url = app.globalData.musicBase + app.globalData.originalList;
        break;
      case 2:
        url = app.globalData.musicBase + app.globalData.hotList;
        break;
      case 3:
        url = app.globalData.musicBase + app.globalData.soaringList;
        break;
      case 4:
        url = app.globalData.musicBase + app.globalData.topList;
        break;
    }
    wx.request({
      url: url,
      data: '',
      header: { 'Content-Type': 'json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        that.proccessData(res.data, that.data.topid);
      },
      fail: function (res) { console.log('getList error') },
      complete: function (res) { },
    })
  },

  onTap: function (event) {
    var album = this.data.playBar.album.split('=');
    var lrc = this.data.lrc.split('&');
    wx.navigateTo({
      url: 'detail/detail?name=' + this.data.playBar.name + '&singer=' + this.data.playBar.singer + '&albumPre=' + album[0] + '&albumPost=' + album[2] + '&id=' + this.data.playBar.id + '&playing=' + this.data.playing + '&lrcPost=' + lrc[1] + '&lrcPre=' + lrc[0],
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  proccessLyric: function (lrc) {
    var lyrics = lrc.split("\n");
    var lrcObj = {};
    for (var i = 0; i < lyrics.length; i++) {
      var lyric = decodeURIComponent(lyrics[i]);
      var timeReg = /\[\d*:\d*((\.|\:)\d*)*\]/g;
      var timeRegExpArr = lyric.match(timeReg);
      if (!timeRegExpArr) continue;
      var clause = lyric.replace(timeReg, '');
      for (var k = 0, h = timeRegExpArr.length; k < h; k++) {
        var t = timeRegExpArr[k];
        var min = Number(String(t.match(/\[\d*/i)).slice(1)),
          sec = Number(String(t.match(/\:\d*/i)).slice(1));
        var time = min * 60 + sec;
        lrcObj[time] = clause;
      }
    }
    return lrcObj;
  },

  onScroll: function () {
    if (!this.data.musicShow) {
      setTimeout(function () {//滚动时隐藏播放器;
        this.hiddenMusicPlay(),
        this.hiddenImage(),
        this.hiddenText()
      }.bind(this), 300)
    }
  },

  rotatePlayer: function (pause) {
    var rotatePic = wx.createAnimation({
      duration: 500000
    })
    if (pause == 'stop') {
      rotatePic.rotate(0).step()
    } else {
      rotatePic.rotate(36000).step()
    }
    this.setData({
      playerAnimation: rotatePic.export()
    })
  },

  musicPlaySwith: function () {//播放器显示开关
    if (this.data.musicShow) {
      this.showMusicPlay();
      this.showImage();
      this.showText();
    } else if (this.data.musicShow == false) {
      this.hiddenMusicPlay();
      this.hiddenImage();
      this.hiddenText();
    }
  },

  showMusicPlay: function () {//显示播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    });
    animation.width('695rpx').left('30rpx').step();
    this.setData({
      musicAnimation: animation.export()
    });
    this.setData({
      musicShow: false
    });
  },

  showImage: function () {//显示播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    });
    animation.width('120rpx').step();
    this.setData({
      imageAnimation: animation.export()
    });
  },

  showText: function () {//显示播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    });
    animation.rotateX(0).step();
    this.setData({
      textAnimation: animation.export()
    });
  },

  hiddenMusicPlay: function () {//隐藏播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    setTimeout(function () {
      animation.width(0).step()
      this.setData({
        musicAnimation: animation.export()
      })
    }.bind(this), 300)
    this.setData({
      musicShow: true
    })
  },

  hiddenImage: function () {//隐藏播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    setTimeout(function () {
      animation.width(0).step()
      this.setData({
        imageAnimation: animation.export()
      })
    }.bind(this), 300);
  },

  hiddenText: function () {//隐藏播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    setTimeout(function () {
      animation.rotateX(-90).step()
      this.setData({
        textAnimation: animation.export()
      })
    }.bind(this), 300);
  },

  onBindchange: function (event) {
    this.data.count = 10;
    var topid = event.detail.current;
    var songsList = wx.getStorageSync('id' + topid);
    this.setData({
      topid: topid,
    });
    if (songsList) {
      this.proccessSong(this.data.count);
    } else {
      this.getTopList(topid);
    }
  },

  onSearch: function (event) {
    if (this.data.searchShow) {
      this.showSearch();
    } else if (this.data.searchShow == false) {
      this.hiddenSearch();
    }
  },

  clearCache: function(){
    wx.clearStorageSync();
  },

  showSearch: function () {//显示播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    animation.right('0').step()
    this.setData({
      searchAnimation: animation.export()
    })
    this.setData({
      searchShow: false
    })
  },

  hiddenSearch: function () {//隐藏播放器动画
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease'
    })
    setTimeout(function () {
      animation.right('-400rpx').step()
      this.setData({
        searchAnimation: animation.export()
      })
    }.bind(this), 300)
    this.setData({
      searchShow: true
    })
  },

  bindSearch: function (event) {
    var that = this;
    var value = event.detail.value;
    var url = app.globalData.musicBase + app.globalData.searchUrl + value;
    if (value) {
      wx.request({
        url: url,
        data: '',
        header: { 'Content-Type': 'json' },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          that.proccessSearch(res.data);
        },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else {
      this.getTopList(this.data.topid);
    }
  },

  proccessSearch: function (searchResult) {
    var songsList = [];
    this.setData({
      songsList: ''
    });
    for (var index in searchResult.result.songs) {
      var song = searchResult.result.songs[index];
      var id = song.id;
      var name = song.name;
      var singer = song.artists[0].name;
      var album = song.album.picUrl;
      var dataUrl = 'http://music.163.com/song/media/outer/url?id=' + id + '.mp3';
      var temp = {
        id: id,
        name: name,
        singer: singer,
        album: album,
        dataUrl: dataUrl
      };
      songsList.push(temp);
    }
    this.setData({
      songsList: songsList
    });
  },

  onMore: function(){
    this.data.count += 5; 
    this.proccessSong(this.data.count);
  },

  tapImage: function(){
    var playing = this.data.playing;
    var bam = wx.getBackgroundAudioManager();
    if (playing){
      bam.pause();
      this.setData({
        playing: false
      });
    } else {
      bam.play();
      this.setData({
        playing: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})