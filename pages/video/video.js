import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList() /* 函数 调用。 */
  },
  
  async getVideoGroupList() { /* 函数 定义。*/
    const videoGroupListData = await request('/video/group/list')
    this.setData({ /* 小程序中更新data中的数据 是同步的。 */
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId) /* 修改完data中数据后，调用该函数。 */
  },

  changeNav(event) {
    const navId = event.currentTarget.id
    this.setData({
      navId: navId>>>0
    })
  },

  async getVideoList(navId) {
    //if (!navId) return
    const videoListData = await request('/video/group', {id: navId})
    //console.log(videoListData)
    this.setData({
      videoList: videoListData.datas
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