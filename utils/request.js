import config from './config'

export default (url, data={}, method='GET') => { /* 三个形参，后两个形参有默认值。 */
  return new Promise ((resolve, reject) => {
    wx.request({
      url: config.host + url,
      //url: config.mobileHost + url,
      data,
      method,
      header: {
        cookie: wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1):''
      },
      /* 用同步sync方法取出本地存储中的数据，这样后面不会出错。 */
      /* wx.getStorageSync('cookies')得到结果是个数组，使用数组的find方法找到某个元素。 */
      success: (res) => {
        //console.log('请求成功：', res)
        if (data.isLogin) { /* 如果是登录请求，把res.cookies存到本地存储中。 */
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        resolve(res.data) /* 固定的都这么写，测试接口的工具 默认 也是返回这个值。 */
      },
      fail: (err) => {
        //console.log('请求失败：', err)
        reject(err)
      }
    })
  })
}