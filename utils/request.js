import config from './config'

export default (url, data={}, method='GET') => {
    return new Promise ((resolve, reject) => {
        wx.request({
            url: config.host + url,
            //url: config.mobileHost + url,
            data,
            method,
            success: (res) => {
              console.log('请求成功：', res)
              resolve(res.data) /* 固定的都这么写，测试接口的工具 默认 也是返回这个值。 */
            },
            fail: (err) => {
              console.log('请求失败：', err)
              reject(err)
            }
        })
    })
}