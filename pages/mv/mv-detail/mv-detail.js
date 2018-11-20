// pages/mv/mv-detail/mv-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvsList: [],
    page: 1,
    isEmpty: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.id;
    var page = this.data.page;
    this.getMVList(id, page);
    this.setData({
      id: id
    });
  },

  getMVList: function(id, page){
    var that = this;
    var url = 'http://idol.yinyuetai.com/video/video-list?artistId=' + id + '&page=' + page + '&pageSize=8';
    wx.request({
      url: url,
      data: '',
      header: { 'Content-Type': 'json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.videos) {
          that.proccessData(res.data)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  proccessData: function (mvsData) {
    var that = this;
    var mvsList = {};
    var mvList = [];
    for (var index in mvsData.videos) {
      var mv = mvsData.videos[index];
      var videoId = mv.videoId;
      var title = mv.title;
      if (title.length >= 15) {
        title = title.substring(0, 14) + "...";
      }
      var singer = mv.artistName;
      var bigHeadImgUri = mv.bigHeadImgUri;
      var url = mv.videoUrl2;
      var temp = {
        videoId: videoId,
        title: title,
        singer: singer,
        bigHeadImgUri: bigHeadImgUri,
        url: url
      };
      mvList.push(temp);
    }
    if (!this.data.isEmpty) {
      mvList = this.data.mvsList.concat(mvList);
    } else {
      mvsList = mvList;
      this.data.isEmpty = false;
    }
    this.setData({
      mvsList: mvList
    });
    this.data.page += 1;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  bindTop: function(event){
    var that = this;
    var videoId = event.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: '../play/play?videoId=' + videoId,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  onMore: function(){
    console.log('scroll')
    var id = this.data.id;
    var page = this.data.page;
    this.getMVList(id, page);
    wx.showNavigationBarLoading();
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