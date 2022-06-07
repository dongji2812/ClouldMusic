import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'

const appInstance = getApp() //每个页面都能获取到 应用实例。

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,
    musicId: '',
    song: {},
    musicLink: '', /* 音乐链接，mp3格式的。 */
    currentTime: '00:00',
    durationTime: '00:00',
    currentWidth: 0
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
    
    /* 加载时候先判断，是否该音乐在播放。如果不是就还按照data中的数据，如果是更改data中的状态。 */
    if (appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId) {
      this.setData({
        isPlay: true
      })
    }

    this.getMusicInfo(musicId)

    /* 创建音乐实例，保存到this中。 */
    this.backgroundAudioManager = wx.getBackgroundAudioManager()

    /* 实例的监听函数们：播放/暂停/关闭/自然结束/实时播放。
       监听函数的作用是一旦播放/暂停/关闭/自然结束/实时播放 就会执行该回调函数。 监听isPlay的值，更新到data中。*/
    this.backgroundAudioManager.onPlay(() => { /* 该事件的参数是一个回调函数，事件一触发就调用该回调函数。 */
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId /* 修改 全局实例对象中 的状态。 */
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => { /* 用户点击x号，手动关闭音乐。 */
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onEnded(() => {
      this.handlePubSub('next')  /* 调用函数，函数中包括消息订阅和消息发布，代码意思是切换到下一首。   实参可以传字符串。 */
      this.setData({
        currentTime: '00:00',
        currentWidth: 0
      })
    })
    this.backgroundAudioManager.onTimeUpdate(() => {
      const currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss') /* moment()内传入的数值 单位是ms。 */
      /* this.backgroundAudioManager.currentTime是歌曲播放的实时时间，单位是s。
         this.backgroundAudioManager.duration是歌曲的总时长，单位是s。 */
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450 /* 比例关系。 */
      this.setData({
        currentTime,
        currentWidth
      })
    })
  },

  /* 点击播放/暂停按钮 的回调。 */
  handleMusicPlay() {
    const isPlay = !this.data.isPlay
    /* this.setData({   //上面有监听函数，作用是监听isPlay的值，更新到data中。
      isPlay
    }) */

    const {musicId, musicLink} = this.data
    this.musicControl(isPlay, musicId, musicLink)
  },

  /* 获取某音乐 详细信息的函数。 */
  async getMusicInfo(musicId) {
    const songData = await request('/song/detail', {ids: musicId})
    const durationTime = moment(songData.songs[0].dt).format('mm:ss') /* 给歌曲总的毫秒数 转换为 指定的时间格式。 */
    this.setData({
      song: songData.songs[0], /* songs是数组的形式，只包含一个对象，取它的元素是对象。 */
      durationTime 
    })
    wx.setNavigationBarTitle({ /* 动态设置导航栏 为歌曲名字。 */
      title: this.data.song.name
    })
  },

  /* 自动播放/暂停 的功能函数。单独拎出来写了，没有写在点击播放/暂停按钮 的回调中。 */
  async musicControl(isPlay, musicId, musicLink) {
    if (isPlay) {
      if (!musicLink) { /* 如果相同歌曲播放/暂停，不需要再次发请求。   性能优化，控制函数的形参musicLink，传与不传决定是否发请求。*/
        const musicLinkData = await request('/song/url', {id: musicId})
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      this.backgroundAudioManager.pause() /* 实例暂停音乐，跟实例的监听函数们不同。 */
    }
  },

  /* 修改页面 播放显示状态 的函数。
     监听isPlay的值，更新到data中。*/
  changePlayState(isPlay) {
    this.setData({
      isPlay
    })
    appInstance.globalData.isMusicPlay = isPlay /* 修改实例对象中的状态。 */
  },

  /* 点击上一首/下一首的回调函数。 */
  handleSwitch(event) {
    const type = event.currentTarget.id

    this.backgroundAudioManager.stop() /* 停止当前音乐。 */
    this.handlePubSub(type)
  },

  handlePubSub(type) {
    PubSub.subscribe('musicId', (msg, musicId) => { /* 订阅消息/绑定事件。*/ 
      //console.log(musicId)
      this.getMusicInfo(musicId) /* 点击切换上/下一首后，更新当前音乐详细信息。 */
      this.musicControl(true, musicId) /* 点击切换上/下一首后，实现音乐自动播放。  不传第三个参数，形参值为undefined。 */
      PubSub.unsubscribe('musicId')  /* 取消订阅/解绑事件。 */
      /* 某事件的回调函数会累加，所以每次订阅后都应该取消订阅/解绑事件。*/
    })

    PubSub.publish('switchType', type) /* 发布消息/触发事件。 */
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