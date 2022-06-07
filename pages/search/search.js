import request from '../../utils/request'

let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //默认显示在搜索框中的值。
    hotList: [],
    searchContent: '', //实时 收集表单项数据。
    searchList: [], //根据用户输入的值 搜索到的数据。
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getinitData()

    const historyList  = wx.getStorageSync('searchHistory') /* 获取本地存储中的搜索记录。 */
    if (historyList) {
      this.setData({
        historyList
      })
    }
  },

  /* 获取 搜索框默认显示值、榜单列表。 */
  async getinitData() {
    const placeholderContentData = await request('/search/default')
    const hotListData = await request('/search/hot/detail')
    this.setData({
      placeholderContent: placeholderContentData.data.showKeyword,
      hotList: hotListData.data
    })
  },

  /* 表单项实时更新 的回调。搜索联想功能。 */
  handleInputChange(event) {
    const searchContent = event.detail.value
    this.setData({
      searchContent
    })
    if (isSend) { /* 函数节流。 */
      return
    }
    isSend = true
    this.getSearchList(searchContent)   
    setTimeout(() => {
      isSend = false
    }, 300)
  },

  /* 搜索表单项中的内容 返回搜索列表、并存在历史搜索记录中。*/
  async getSearchList(searchContent) {
    if (!searchContent) { /* 搜索框中 没有值时，不用发请求。 */
      this.setData({
        searchList: []
      })
      return
    }
    
    const searchListData = await request('/search', {keywords: searchContent, limit: 10})
    this.setData({
      searchList: searchListData.result.songs
    })

    const {historyList} = this.data
    if (historyList.indexOf(searchContent) !== -1) {
      historyList.splice(historyList.indexOf(searchContent), 1) /* 搜索记录中存在该值，则删除。 */
    }
    historyList.unshift(searchContent)
    this.setData({
      historyList 
    })

    wx.setStorageSync('searchHistory', historyList)
  },

  /* 点击X清除搜索框中的内容。 */
  clearSearchContent() {
    this.setData({
      searchContent: '',
      searchList: [] //也可以不写，因为自己优化了搜索列表searchList的显示。
    })
  },

  /* 删除搜索记录。 */
  deleteSearchHistory() {
    wx.showModal({
      content: "确定删除吗？",
      success: (res) => { //res是回调函数的参数。可以打印出来看看。
        //console.log(res)
        if (res.confirm) { 
          this.setData({
            historyList: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
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