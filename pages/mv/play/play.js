// pages/mv/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var videoId = options.videoId;
    var url = 'http://www.yinyuetai.com/api/info/get-video-urls?videoId=' + videoId;
    wx.request({
      url: url,
      data: '',
      header: { 'Content-Type': 'json' },
      method: 'GET',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        console.log(res.data)
        if (res.data.heVideoUrl){
          that.setData({
            src: res.data.heVideoUrl
          })
        } else if (res.data.hdVideoUrl){
          that.setData({
            src: res.data.hdVideoUrl
          })
        } else {
          that.setData({
            src: res.data.hcVideoUrl
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
    // var video = wx.createVideoContext('video', this)
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