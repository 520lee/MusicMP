// pages/mv/mv.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { name: '周杰伦', id: 154, imgSrc: 'http://img2.c.yinyuetai.com/artist/fan/150804/0/-M-a40dca5083018d6b07bfd5f300cc59fb_0x0.jpg'}, 
      { name: '林俊杰', id: 22, imgSrc: 'http://img0.c.yinyuetai.com/artist/fan/150805/0/-M-f9c6166e0f7f1967bced5e6f03c777c2_0x0.jpg'}, 
      { name: '薛之谦', id: 215, imgSrc: 'http://img3.c.yinyuetai.com/artist/fan/171218/0/-M-eb45f6ce438e085dbd227667dbbc7e26_200x200.png'}, 
      { name: '汪苏泷', id: 15206, imgSrc: 'http://img3.c.yinyuetai.com/artist/fan/160614/0/-M-01d194bc68e2fc613ea3e812ddbb59d6_200x200.jpg'},
      { name: '邓紫棋', id: 273, imgSrc: 'http://img0.c.yinyuetai.com/user/photo/180129/0/-M-73c5df2917bdf7c1c1b604c2331005c6_200x200.jpg'},
      { name: '于文文', id: 25411, imgSrc: 'http://img2.c.yinyuetai.com/uploads/artists/25411/RD862014C79842B7CFF845E8F342B7254.jpg'},
      { name: '张杰', id: 35, imgSrc: 'http://img4.c.yinyuetai.com/artist/fan/150805/0/-M-d2575389a99a16d30bcdad34e7eba5c5_0x0.png'},
      { name: '少女时代', id: 79, imgSrc: 'http://img3.c.yinyuetai.com/user/photo/160701/0/-M-509063319a4c576f1e339eb5124a167f_200x200.jpg'},
      { name: '李宇春', id: 32, imgSrc: 'http://img3.c.yinyuetai.com/user/photo/160705/0/-M-7709ceaed6aa09557015871b85f16b80_200x200.jpg' },
      { name: '周笔畅', id: 30, imgSrc: 'http://img1.c.yinyuetai.com/user/photo/160701/0/-M-ce2d70cd7ea0a78a6e7079c6eff1c148_200x200.jpg' },
      ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  bindTop: function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'mv-detail/mv-detail?id=' + id,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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