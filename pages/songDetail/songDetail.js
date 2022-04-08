import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    musicId: '',
    song: {},
    //musicLink: '' /* 音乐链接，mp3格式的。 */
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options)   //options接收路由跳转传入的参数，options是对象的形式，包含参数的名字和值。
    const musicId = options.musicId
    this.setData({
      musicId
    })
    this.getMusicInfo(musicId)

    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    /* 实例的监听函数：播放/暂停/停止。 */
    this.backgroundAudioManager.onPlay(() => { /* 该事件的参数是 一个回调函数。 */
      this.changePlayState(true)
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
  },

  /* 点击播放/暂停按钮 的回调。 */
  handleMusicPlay() {
    const isPlay = !this.data.isPlay
    /* this.setData({   //上面有监听函数，作用是监听isPlay的值，更新到data中。
      isPlay
    }) */

    const {musicId} = this.data
    this.musicControl(isPlay, musicId)
  },

  /* 获取某音乐 详细信息的函数。 */
  async getMusicInfo(musicId) {
    const songData = await request('/song/detail', {ids: musicId})
    this.setData({
      song: songData.songs[0] /* songs是数组的形式，只包含一个对象，取它的元素是对象。 */
    })
    wx.setNavigationBarTitle({ /* 动态设置导航栏 为歌曲名字。 */
      title: this.data.song.name
    })
  },

  /* 播放/暂停 的功能函数。单独拎出来写了，没有写在点击播放/暂停按钮 的回调中。 */
  async musicControl(isPlay, musicId) {
    if (isPlay) {
      const musicLinkData = await request('/song/url', {id: musicId})
      const musicLink = musicLinkData.data[0].url

      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause()
    }
  },

  /* 修改页面 播放显示状态 的函数。
     监听isPlay的值，更新到data中。*/
  changePlayState(isPlay) {
    this.setData({
      isPlay
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