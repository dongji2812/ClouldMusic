import request from '../../utils/request'

// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],
    recommendList:[],
    topList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
/*     wx.request({
      url: 'http://localhost:3000/banner',
      data: {type: 2},
      success: (res) => {
        console.log(res)
      },
      fail: (err) => {
        console.log(err)
      }
    }) */
    let bannerListData = await request('/banner', {type: 2})
    console.log('得到轮播图数据 成功：', bannerListData)
    this.setData({
      bannerList: bannerListData.banners
    })

    let recommendListData = await request('/personalized', {limit: 10})
    console.log('得到推荐歌单数据 成功：', recommendListData)
    this.setData({
      recommendList: recommendListData.result
    })

    let index = 0
    const resArr = []
    while (index < 5) {
      const topListData = await request ('/top/list', {idx: index++})
      const topListItem = {name: topListData.playlist.name, tracks: topListData.playlist.tracks.slice(0, 3)}
      resArr.push(topListItem)
      
      this.setData({
        topList: resArr
      })
    }
  },

  toRecommendSong() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong'
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