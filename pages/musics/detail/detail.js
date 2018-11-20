// pages/musics/detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    top: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var name = options.name;
    var singer = options.singer;
    var id = options.id;
    var playing = options.playing;
    var album = options.albumPre + '==' + options.albumPost;
    var lrc = options.lrcPre + '&' + options.lrcPost;
    var lrcs = this.proccessLyric(lrc);
    this.proccessLrc(lrc);
    this.setData({
      name: name,
      singer: singer,
      id: id,
      playing: playing,
      album: album,
      lrc: lrc,
      lrcs: lrcs
    });
    var num = 0;
    var index = 0;
    var bam = wx.getBackgroundAudioManager();
    bam.onTimeUpdate(function () {
      var lrcs = that.data.lrcs;
      var playerTime = Math.floor(bam.currentTime);
      if (lrcs[playerTime] && index != playerTime) {
        num++;
        index = playerTime;
        if (num > 4){
          that.moveLrc();
        }
      }
    });
},

moveLrc: function () {//显示播放器动画
  this.data.top -= 32; 
  var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'ease'
  });
  animation.top(this.data.top).step();
  this.setData({
    lrcAnimation: animation.export()
  });
},

stopLrc: function () {//显示播放器动画
  console.log(this.data.top);
  // this.data.top += 32;
  var animation = wx.createAnimation({
    duration: 1000,
    timingFunction: 'ease'
  });
  animation.top(this.data.top).step();
  this.setData({
    lrcAnimation: animation.export()
  });
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

  proccessLrc: function(lrc){
    var musicLrc = [];
    var lrcArr = lrc.split("[");//去除[
    // console.log(lrcArr);
    for (var i = 0; i < lrcArr.length; i++) {
      var arr = lrcArr[i].split("]");
      // console.log(arr[1]);
      var allTime = arr[0].split(".");
      var time = allTime[0].split(":");
      //获取分钟 秒钟 把时间换算成秒钟
      var timer = time[0] * 60 + time[1] * 1;
      var text = arr[1];
      if (text) {
        var temp = {
          timer: timer,
          text: text
        };
        musicLrc.push(temp);
      }
      this.setData({
        playerLrc: musicLrc
      });
    }
  },
  
  // onAudioChange: function (event) {
  //   //歌曲时间发生变化时触发;
  //   var musicLrc = this.data.musicLrc;
  //   console.log(musicLrc)
  //   var playerTime = Math.floor(event.detail.currentTime);
  //   if (musicLrc[playerTime] && musicLrc[playerTime] != ' ' && musicLrc[playerTime] != '') {
  //     this.setData({
  //       playerLrc: musicLrc[playerTime]
  //     })
  //     // console.log(musicLrc[playerTime])
  //   }
  // },

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