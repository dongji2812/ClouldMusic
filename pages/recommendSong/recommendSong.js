import PubSub from 'pubsub-js'
import request from '../../utils/request'

// pages/recommendSong/recommendSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0
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

    /* 把订阅写在onload中。因为onload中的代码只执行一次，订阅只需要发生一次，相当于监视，坐等发布消息/事件触发。
       订阅消息/绑定事件。*/
    PubSub.subscribe('switchType', (msg, type) => {
      //console.log(msg, type)
      let {recommendList, index} = this.data /* 因为index要被修改，所以是let。 */
      if (type === 'pre') {
        (index === 0) && (index = recommendList.length) /* 点击上一首按钮时，要考虑当前歌曲是第一首的情况。 */
        index -= 1
      } else {
        (index === recommendList.length - 1) && (index = -1) /* 点击下一首按钮时，要考虑当前歌曲是最后一首的情况。 */
        index += 1
      }
      this.setData({
        index
      })
      const musicId = recommendList[index].id
      PubSub.publish('musicId', musicId) /* 发布消息/触发事件。 */
    })
  },

  async getReCommendList() {
    const recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  toSongDetail(event) {
    const {song, index} = event.currentTarget.dataset /* 取出传入事件的 对象 和 下标。 */
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?musicId=' + song.id /* 携带数据 去新的路由界面。 */
    })
    this.setData({
      index
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