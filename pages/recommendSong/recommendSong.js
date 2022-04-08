import request from '../../utils/request'

// pages/recommendSong/recommendSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: none,
        success: () => {
          wx.reLaunch('/pages/login/login')
        }
      })
    }

    const day = new Date().getDate()
    const month = new Date().getMonth() + 1
    this.setData({
      day,
      month
    })

    this.getReCommendList()
  },

  async getReCommendList() {
    const recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  toSongDetail(event) {
    const song = event.currentTarget.dataset.song /* 取出传入事件 的对象。 */
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id /* 携带数据 去新的路由界面。 */
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