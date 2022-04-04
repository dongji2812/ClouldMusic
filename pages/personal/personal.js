import request from '../../utils/request'

let startY = 0, moveY = 0, distanceY = 0

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: 'translateY(0)',
    coverTransition: '',
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const userInfo = wx.getStorageSync('userInfo') /* 得到本地存储的json对象的数据。 */
    this.setData({
      userInfo: JSON.parse(userInfo) /* json对象转换为js对象，赋值给data中的userInfo。 */
    })
    this.getrecentPlayList(this.data.userInfo.userId) /* 调用该函数。 */
  },

  async getrecentPlayList(userId) {
    const recentPlayListData = await request('/user/record', {uid: userId, type: 1})
    let index = 0
    const recentPlayList = recentPlayListData.weekData.splice(0, 10).map(item => {
      item.id = index++
      return item
    })
    this.setData({
      recentPlayList
    })
  },

  handleTouchStart(event) {
    this.setData({
      coverTransition: ''
    })
    startY = event.touches[0].clientY
  },

  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    distanceY = moveY - startY
    if (distanceY < 0) return
    if (distanceY >= 80) {
      distanceY = 80
    }
    this.setData({
      coverTransform: `translateY(${distanceY}rpx)` /* 模板字符串。 */
    })
  },

  handleTouchEnd() {
    this.setData({
      coverTransform: 'translateY(0)',
      coverTransition: 'transform 1s linear' /* 过渡的是transform这个属性，这个属性前后的属性值 就是过渡前的值 和 过渡后的结果。 */
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login' /* 这里写绝对路径，不然是在当前路径下寻找。 */
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