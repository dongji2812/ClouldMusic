import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: '',
    videoUpdateTime: []
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

  /* 点击导航 的回调。 */
  changeNav(event) {
    const navId = event.currentTarget.id
    this.setData({
      navId: navId>>>0,
      videoList: [] /* 切换时候，上一页视频置为空，等待下面调用函数得到新的视频数据列表。 */
    })
    wx.showLoading({
      title: "正在加载"
    })
    this.getVideoList(this.data.navId)
  },

  async getVideoList(navId) {
    //if (!navId) return
    const videoListData = await request('/video/group', {id: navId})
    //console.log(videoListData)
    wx.hideLoading() /* 调用wx.hideLoading函数。 */

    let index = 0
    const videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList
    })
  },

  /* 点击 视频播放时/图片时 的回调 */
  handlePlay(event) {
    let vid = event.currentTarget.id
    this.setData({
      videoId: vid
    })

    //this.vid !== vid && this.videoContext && this.videoContext.stop() 
    /* this.vid和this.videoContext 都是上一个播放视频的。  this.videoContext.stop()也是暂停播放的上一个视频。*/
    /* 这段代码解决 多个视频同时播放的问题。 点击下个视频的时候，关闭上个视频。 后来优化为图片后，不存在这个问题了。 */
    //this.vid = vid

    this.videoContext = wx.createVideoContext(vid)
    const {videoUpdateTime} = this.data
    const videoItem = videoUpdateTime.find(item => item.vid === event.currentTarget.id)
    if (videoItem) {
      this.videoContext.seek(videoItem.currentTime)
    }
    this.videoContext.play()
  },

  /* 视频实时播放时 的回调。 */
  handleTimeUpdate(event) {
    const {videoUpdateTime} = this.data
    const videoItem = videoUpdateTime.find(item => item.vid === event.currentTarget.id)
    if (videoItem) {
      videoItem.currentTime = event.detail.currentTime
    } else {
      const videoTimeObj = {vid: event.currentTarget.id, currentTime: event.detail.currentTime}
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({ /* 一定要更新data中的数据。 */
      videoUpdateTime
    })
  },

  handleEnded(event) {
    const {videoUpdateTime} = this.data
    const videoItemIndex = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id)
    videoUpdateTime.splice(videoItemIndex, 1)
    this.setData({
      videoUpdateTime
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