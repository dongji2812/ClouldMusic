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
    videoUpdateTime: [],
    isTriggered: false
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
    wx.showLoading({ /* 添加“正在加载”效果。 */
      title: "正在加载"
    })
    this.getVideoList(this.data.navId)
  }, 

  async getVideoList(navId) {
    //if (!navId) return
    const videoListData = await request('/video/group', {id: navId})
    //console.log(videoListData)

    wx.hideLoading() /* 调用wx.hideLoading函数。隐藏“正在加载”的效果。 */

    let index = 0
    const videoList = videoListData.datas.map(item => {
      item.id = index++
      return item
    })
    this.setData({
      videoList,
      isTriggered: false /* 关闭下拉刷新。 */
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

  /* 视频实时播放 的回调。 */
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

  /* 视频结束时 的回调。 */
  handleEnded(event) {
    const {videoUpdateTime} = this.data
    const videoItemIndex = videoUpdateTime.findIndex(item => item.vid === event.currentTarget.id)
    videoUpdateTime.splice(videoItemIndex, 1)
    this.setData({
      videoUpdateTime
    })
  },

  /* 自定义刷新时 的回调。 */
  handleRefresher() {
    this.getVideoList(this.data.navId)
  },

  /* scroll-view滚动到底部/右边时，内容已全部加载完毕时的回调。 */
  handleToLower() {
    const newVideoList = [
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_47003ABF5A38C7C3E98899638937C98E",
              "coverUrl": "https://p1.music.126.net/CCYSOYfMWXaRfxxi8WDMiw==/109951163573017308.jpg",
              "height": 720,
              "width": 1280,
              "title": "莎拉·布莱曼x安德烈·波切利《Time to Say Goodbye》2007音乐会版",
              "description": "莎拉·布莱曼x安德烈·波切利《Time to Say Goodbye》2007音乐会版，世界上最著名的歌曲之一，优雅大气却曲高不和寡，听到的人应该都会被感动吧",
              "commentCount": 334,
              "shareCount": 2850,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 9158176
                  },
                  {
                      "resolution": 480,
                      "size": 17739219
                  },
                  {
                      "resolution": 720,
                      "size": 31206287
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 440000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/ISYw2b6t1ZrJn4ln-eDOWw==/109951163099991417.jpg",
                  "accountStatus": 0,
                  "gender": 2,
                  "city": 440100,
                  "birthday": 843148800000,
                  "userId": 381268157,
                  "userType": 0,
                  "nickname": "热点音乐HeatsMusic",
                  "signature": "分享点音乐，偶尔怀旧。",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951163099991420,
                  "backgroundImgId": 109951163030912370,
                  "backgroundUrl": "http://p1.music.126.net/fDxOUzoFYrM3rNYQiEbLjA==/109951163030912368.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人"
                  },
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951163030912368",
                  "avatarImgIdStr": "109951163099991417"
              },
              "urlInfo": {
                  "id": "47003ABF5A38C7C3E98899638937C98E",
                  "url": "http://vodkgeyttp9.vod.126.net/cloudmusic/4cee759a23ef20be6bd6bd6df0e0e23d.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=OvdKpOPRXwXLPlltHLaCdcUIEfGCtxQi&sign=0a133b23d1dd0176ac1e9b354145b069&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiT076zpvxkF7faw195lJVX",
                  "size": 31206287,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  },
                  {
                      "id": 15105,
                      "name": "古典",
                      "alg": null
                  },
                  {
                      "id": 14137,
                      "name": "感动",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "Time to Say Goodbye (Con te partirò)",
                      "id": 19169096,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 74618,
                              "name": "Sarah Brightman",
                              "tns": [],
                              "alias": []
                          },
                          {
                              "id": 27597,
                              "name": "Andrea Bocelli",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 95,
                      "st": 0,
                      "rt": "",
                      "fee": 8,
                      "v": 7,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 1757583,
                          "name": "Classics - The Best of Sarah Brightman",
                          "picUrl": "http://p4.music.126.net/4kzsUQoOOwESpFojI-b0ug==/6649846325421586.jpg",
                          "tns": [],
                          "pic": 6649846325421586
                      },
                      "dt": 246000,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 9865109,
                          "vd": -22100
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 5919157,
                          "vd": -19400
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3946180,
                          "vd": -17700
                      },
                      "a": null,
                      "cd": "1",
                      "no": 16,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 1,
                      "s_id": 0,
                      "cp": 14002,
                      "mv": 0,
                      "rtype": 0,
                      "rurl": null,
                      "mst": 9,
                      "publishTime": 1159804800000,
                      "privilege": {
                          "id": 19169096,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 320000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 256,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "47003ABF5A38C7C3E98899638937C98E",
              "durationms": 259519,
              "playTime": 502438,
              "praisedCount": 3908,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_D7EACABDDC50FC53860E0B9F0B5EBED3",
              "coverUrl": "https://p1.music.126.net/qO66QPG3Jer760GX2jnsVA==/109951164120220916.jpg",
              "height": 1080,
              "width": 1920,
              "title": "告五人｜愛人錯過｜杭州西湖音樂節｜2019.06.02",
              "description": "",
              "commentCount": 170,
              "shareCount": 578,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 81546504
                  },
                  {
                      "resolution": 480,
                      "size": 159994150
                  },
                  {
                      "resolution": 720,
                      "size": 269610570
                  },
                  {
                      "resolution": 1080,
                      "size": 473830306
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 330000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/3SMojtuY_D6_vbDZIe8IiA==/109951162843134044.jpg",
                  "accountStatus": 0,
                  "gender": 2,
                  "city": 330200,
                  "birthday": -2209017600000,
                  "userId": 299565295,
                  "userType": 0,
                  "nickname": "反正4偶",
                  "signature": "",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951162843134050,
                  "backgroundImgId": 109951163739480820,
                  "backgroundUrl": "http://p1.music.126.net/bKDRzJejJ0UYG8D3lREnfg==/109951163739480820.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": null,
                  "djStatus": 10,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951163739480820",
                  "avatarImgIdStr": "109951162843134044"
              },
              "urlInfo": {
                  "id": "D7EACABDDC50FC53860E0B9F0B5EBED3",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/eWUjNIrZ_2532559282_uhd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=jmJlyKJHCRDUxeFRycqVyieHzOsvnfcG&sign=4bba0343896add1bd3e957000b56bd56&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 473830306,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 1080
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 59101,
                      "name": "华语现场",
                      "alg": null
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": null
                  },
                  {
                      "id": 58104,
                      "name": "音乐节",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "D7EACABDDC50FC53860E0B9F0B5EBED3",
              "durationms": 248184,
              "playTime": 486392,
              "praisedCount": 4392,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_07DDA590274D05485EE72A374881E30F",
              "coverUrl": "https://p1.music.126.net/VC1lHtDSWo-4s6sQ5l3kVA==/109951163572848238.jpg",
              "height": 720,
              "width": 1280,
              "title": "邓紫棋最新现场，深情献唱《再见》，完美表演征服你的耳朵！",
              "description": "第13届KKBOX风云榜颁奖典礼，邓紫棋深情献唱《再见》，完美演绎，征服你的耳朵！",
              "commentCount": 258,
              "shareCount": 370,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 24167844
                  },
                  {
                      "resolution": 480,
                      "size": 34678119
                  },
                  {
                      "resolution": 720,
                      "size": 55489881
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 340000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
                  "accountStatus": 0,
                  "gender": 0,
                  "city": 340100,
                  "birthday": -2209017600000,
                  "userId": 479954154,
                  "userType": 207,
                  "nickname": "音乐诊疗室",
                  "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 18499283139231828,
                  "backgroundImgId": 1364493978647983,
                  "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人",
                      "2": "音乐资讯达人"
                  },
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "1364493978647983",
                  "avatarImgIdStr": "18499283139231828"
              },
              "urlInfo": {
                  "id": "07DDA590274D05485EE72A374881E30F",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/dRF6gq7e_135667100_shd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=kCwGrsogegsAGczhBYAIaZdMFSoElosC&sign=9177c146a2c90754d9b746e109359d76&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 55489881,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 12100,
                      "name": "流行",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  },
                  {
                      "id": 14242,
                      "name": "伤感",
                      "alg": null
                  },
                  {
                      "id": 13222,
                      "name": "华语",
                      "alg": null
                  },
                  {
                      "id": 150122,
                      "name": "邓紫棋",
                      "alg": null
                  },
                  {
                      "id": 14255,
                      "name": "颁奖晚会盛典",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "再见",
                      "id": 36024806,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 7763,
                              "name": "G.E.M.邓紫棋",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": null,
                      "fee": 8,
                      "v": 38,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 3189002,
                          "name": "新的心跳",
                          "picUrl": "http://p4.music.126.net/kVwk6b8Qdya8oDyGDcyAVA==/1364493930777368.jpg",
                          "tns": [],
                          "pic": 1364493930777368
                      },
                      "dt": 206053,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 8244288,
                          "vd": -16900
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 4946590,
                          "vd": -14500
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3297741,
                          "vd": -12900
                      },
                      "a": null,
                      "cd": "1",
                      "no": 2,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 2,
                      "s_id": 0,
                      "cp": 1415926,
                      "mv": 499045,
                      "rtype": 0,
                      "rurl": null,
                      "mst": 9,
                      "publishTime": 1446739200007,
                      "privilege": {
                          "id": 36024806,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 4,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "07DDA590274D05485EE72A374881E30F",
              "durationms": 201696,
              "playTime": 755326,
              "praisedCount": 3809,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_7CBF54D9230B1B3A9A9056DB7DFD35D1",
              "coverUrl": "https://p1.music.126.net/qF2-jq9tpvJulb0FXjJpcA==/109951164222097659.jpg",
              "height": 1080,
              "width": 1920,
              "title": "骑在银龙的背上（最初的梦想日文原版）",
              "description": "",
              "commentCount": 42,
              "shareCount": 180,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 31870123
                  },
                  {
                      "resolution": 480,
                      "size": 50617082
                  },
                  {
                      "resolution": 720,
                      "size": 71831968
                  },
                  {
                      "resolution": 1080,
                      "size": 153890247
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 110000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/vKkk01TrVxeLgOYaIVq92A==/109951165298347140.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 110101,
                  "birthday": 595267200000,
                  "userId": 327935910,
                  "userType": 0,
                  "nickname": "音乐清酒",
                  "signature": "个人公众号：音乐清酒（感谢关注）",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951165298347140,
                  "backgroundImgId": 109951165298346180,
                  "backgroundUrl": "http://p1.music.126.net/GQoS_hFmRs0TSALL0yAaOw==/109951165298346170.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": null,
                  "djStatus": 10,
                  "vipType": 11,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951165298346170",
                  "avatarImgIdStr": "109951165298347140"
              },
              "urlInfo": {
                  "id": "7CBF54D9230B1B3A9A9056DB7DFD35D1",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/R3l8VXWU_2564467093_uhd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=RTKSeDVFhbSgOTGRONZWIlRhBOUgFyIm&sign=362b5810fd50c8b200ae12f66645d575&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 153890247,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 1080
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "7CBF54D9230B1B3A9A9056DB7DFD35D1",
              "durationms": 387886,
              "playTime": 82892,
              "praisedCount": 648,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_1736088285ED41F68DF9BC1C2B422A3E",
              "coverUrl": "https://p1.music.126.net/REzDnaYsWEavdHosNOLLuQ==/109951163573866732.jpg",
              "height": 720,
              "width": 1280,
              "title": "Coldplay《Yellow》最经典现场之一，感动！",
              "description": "Coldplay《Yellow》现场版，你是否曾经很喜欢一个人，喜欢到眼里没有别人了？",
              "commentCount": 452,
              "shareCount": 3914,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 40823366
                  },
                  {
                      "resolution": 480,
                      "size": 69088452
                  },
                  {
                      "resolution": 720,
                      "size": 95512245
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 340000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/OqEkaKwFoV2XgsddPGfcow==/109951165474023172.jpg",
                  "accountStatus": 0,
                  "gender": 0,
                  "city": 340100,
                  "birthday": 631123200000,
                  "userId": 415197557,
                  "userType": 207,
                  "nickname": "全球音乐吧",
                  "signature": "",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951165474023170,
                  "backgroundImgId": 109951166223106900,
                  "backgroundUrl": "http://p1.music.126.net/p1stKDNMdYwRKoEtTcQogQ==/109951166223106890.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人",
                      "2": "欧美音乐资讯达人"
                  },
                  "djStatus": 10,
                  "vipType": 11,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951166223106890",
                  "avatarImgIdStr": "109951165474023172"
              },
              "urlInfo": {
                  "id": "1736088285ED41F68DF9BC1C2B422A3E",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/5wBwJmO0_1730231299_shd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=CaQGHqfzrdbpaEdBhgzJrtoYqcoLYlca&sign=780a622a7200dbe8dd7e7734e640c697&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 95512245,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 57106,
                      "name": "欧美现场",
                      "alg": null
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": null
                  },
                  {
                      "id": 59108,
                      "name": "巡演现场",
                      "alg": null
                  },
                  {
                      "id": 12125,
                      "name": "Coldplay",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "Yellow",
                      "id": 17177324,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 89365,
                              "name": "Coldplay",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": "",
                      "fee": 1,
                      "v": 52,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 1582613,
                          "name": "Yellow",
                          "picUrl": "http://p3.music.126.net/p_NmEdZzca741GfIBMYgZQ==/109951163863085142.jpg",
                          "tns": [],
                          "pic_str": "109951163863085142",
                          "pic": 109951163863085140
                      },
                      "dt": 268469,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 10741595,
                          "vd": -58759
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 6444974,
                          "vd": -56163
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 4296664,
                          "vd": -54540
                      },
                      "a": null,
                      "cd": "1",
                      "no": 1,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 1,
                      "s_id": 0,
                      "cp": 7002,
                      "mv": 292165,
                      "rtype": 0,
                      "rurl": null,
                      "mst": 9,
                      "publishTime": 961948800007,
                      "privilege": {
                          "id": 17177324,
                          "fee": 1,
                          "payed": 0,
                          "st": 0,
                          "pl": 0,
                          "dl": 0,
                          "sp": 0,
                          "cp": 0,
                          "subp": 0,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 0,
                          "toast": false,
                          "flag": 4,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "1736088285ED41F68DF9BC1C2B422A3E",
              "durationms": 408160,
              "playTime": 764430,
              "praisedCount": 5850,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_19A12586087210338E1FC51AB5307DE8",
              "coverUrl": "https://p1.music.126.net/0yb49Ghk_dtysxVipIkRjA==/109951163573142253.jpg",
              "height": 720,
              "width": 1280,
              "title": "Fifth Harmony神曲《Worth It》超美现场，实力太强了！",
              "description": "Fifth Harmony 神曲《Worth It》超美现场，劲歌热舞，燃爆全场！",
              "commentCount": 131,
              "shareCount": 395,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 21526865
                  },
                  {
                      "resolution": 480,
                      "size": 30476769
                  },
                  {
                      "resolution": 720,
                      "size": 48789581
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 340000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/C6VID_CReqmt8ETsUWaYTQ==/18499283139231828.jpg",
                  "accountStatus": 0,
                  "gender": 0,
                  "city": 340100,
                  "birthday": -2209017600000,
                  "userId": 479954154,
                  "userType": 207,
                  "nickname": "音乐诊疗室",
                  "signature": "当我坐在那架破旧古钢琴旁边的时候，我对最幸福的国王也不羡慕。（合作推广请私信，或者+V信：mjs927721）",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 18499283139231828,
                  "backgroundImgId": 1364493978647983,
                  "backgroundUrl": "http://p1.music.126.net/i4J_uvH-pb4sYMsh4fgQAA==/1364493978647983.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人",
                      "2": "音乐资讯达人"
                  },
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "1364493978647983",
                  "avatarImgIdStr": "18499283139231828"
              },
              "urlInfo": {
                  "id": "19A12586087210338E1FC51AB5307DE8",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/DqqMLvJn_1359785022_shd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=AtgSPFRNwBVnIlxasSGDuuUYdhqofFFC&sign=b60fa1aea311cfceac7902da9cfd4b50&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 48789581,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 1101,
                      "name": "舞蹈",
                      "alg": null
                  },
                  {
                      "id": 57106,
                      "name": "欧美现场",
                      "alg": null
                  },
                  {
                      "id": 59108,
                      "name": "巡演现场",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 12100,
                      "name": "流行",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  },
                  {
                      "id": 13164,
                      "name": "快乐",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "Worth It",
                      "id": 30212890,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 794152,
                              "name": "Fifth Harmony",
                              "tns": [],
                              "alias": []
                          },
                          {
                              "id": 37969,
                              "name": "KiD Ink",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": null,
                      "fee": 8,
                      "v": 110,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 2975059,
                          "name": "Reflection",
                          "picUrl": "http://p3.music.126.net/SoMMouLU7OaVwhE9piFFqg==/109951166152776270.jpg",
                          "tns": [],
                          "pic_str": "109951166152776270",
                          "pic": 109951166152776270
                      },
                      "dt": 224573,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 8985120,
                          "vd": -40300
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 5391089,
                          "vd": -37800
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3594074,
                          "vd": -36500
                      },
                      "a": null,
                      "cd": "1",
                      "no": 4,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 2,
                      "s_id": 0,
                      "cp": 7001,
                      "mv": 392150,
                      "rtype": 0,
                      "rurl": null,
                      "mst": 9,
                      "publishTime": 1422892800000,
                      "privilege": {
                          "id": 30212890,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 4,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "19A12586087210338E1FC51AB5307DE8",
              "durationms": 184357,
              "playTime": 924103,
              "praisedCount": 3834,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_8F08A8F1FD55F203AFDADF0DA7E7B188",
              "coverUrl": "https://p1.music.126.net/zbLOh-YH88MnbhGcAZSGKg==/109951164261550234.jpg",
              "height": 720,
              "width": 1280,
              "title": "曾被很多人设为铃声的韩语歌曲，百听不厌！",
              "description": null,
              "commentCount": 116,
              "shareCount": 178,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 8755530
                  },
                  {
                      "resolution": 480,
                      "size": 15257345
                  },
                  {
                      "resolution": 720,
                      "size": 23007992
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 1000000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/gJKrSjijRwddEtBc8EIe0A==/18500382650828663.jpg",
                  "accountStatus": 0,
                  "gender": 0,
                  "city": 1004400,
                  "birthday": 560966400000,
                  "userId": 309230489,
                  "userType": 0,
                  "nickname": "全球精选音乐",
                  "signature": "种一棵树最好的时间是十年前，其次是现在！2019年与君共勉！",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 18500382650828664,
                  "backgroundImgId": 19161189137394620,
                  "backgroundUrl": "http://p1.music.126.net/okmmZ7uzNZKEC-d9zEjgjQ==/19161189137394619.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": {
                      "1": "音乐视频达人"
                  },
                  "djStatus": 0,
                  "vipType": 0,
                  "remarkName": null,
                  "backgroundImgIdStr": "19161189137394619",
                  "avatarImgIdStr": "18500382650828663"
              },
              "urlInfo": {
                  "id": "8F08A8F1FD55F203AFDADF0DA7E7B188",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/utLccahh_2470426130_shd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=NuAecIDbbbzwPDMdRxlCtTMqITebxPiW&sign=19e00801a8c8e2d8c55f5fcfbe9ee78a&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 23007992,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 720
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 57107,
                      "name": "韩语现场",
                      "alg": null
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "총 맞은 것처럼",
                      "id": 22846518,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 125216,
                              "name": "白智英",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 100,
                      "st": 0,
                      "rt": "",
                      "fee": 8,
                      "v": 47,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 2098375,
                          "name": "Timeless; The Best",
                          "picUrl": "http://p4.music.126.net/jCJUdfh5yvSE9LrCErydWQ==/697090372033029.jpg",
                          "tns": [],
                          "pic": 697090372033029
                      },
                      "dt": 239800,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 9594296,
                          "vd": -77716
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 5756594,
                          "vd": -77716
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 3837744,
                          "vd": -77716
                      },
                      "a": null,
                      "cd": "1",
                      "no": 4,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 2,
                      "s_id": 0,
                      "cp": 1410822,
                      "mv": 34102,
                      "rtype": 0,
                      "rurl": null,
                      "mst": 9,
                      "publishTime": 1278259200007,
                      "tns": [
                          "像中枪一样"
                      ],
                      "privilege": {
                          "id": 22846518,
                          "fee": 8,
                          "payed": 0,
                          "st": 0,
                          "pl": 128000,
                          "dl": 0,
                          "sp": 7,
                          "cp": 1,
                          "subp": 1,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 128000,
                          "toast": false,
                          "flag": 260,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "8F08A8F1FD55F203AFDADF0DA7E7B188",
              "durationms": 97037,
              "playTime": 898118,
              "praisedCount": 1938,
              "praised": false,
              "subscribed": false
          }
      },
      {
          "type": 1,
          "displayed": false,
          "alg": "onlineHotGroup",
          "extAlg": null,
          "data": {
              "alg": "onlineHotGroup",
              "scm": "1.music-video-timeline.video_timeline.video.181017.-295043608",
              "threadId": "R_VI_62_BE34DD8586A78726C056000444774DE9",
              "coverUrl": "https://p1.music.126.net/RaQAHttbla_1ag9t0hkwig==/109951165183902479.jpg",
              "height": 1080,
              "width": 1920,
              "title": "鹿晗 - 超级冠军（2016鹿晗Reloaded演唱会广州站 Live版）1080P",
              "description": "鹿晗 - 超级冠军 Football Gang（2016鹿晗Reloaded演唱会广州站 Live版）2016/04/02 1080P\r\n\n投稿材料：\n1：超清画质以上（可包含）的视频 \n2：视频的原链接 \n3：视频标题（艺人/歌曲名/节目名/是否为Live版） \n4：视频封面（选填） \n\n投稿邮箱：ly-to@foxmail.com",
              "commentCount": 12,
              "shareCount": 13,
              "resolutions": [
                  {
                      "resolution": 240,
                      "size": 54654400
                  },
                  {
                      "resolution": 480,
                      "size": 94967433
                  },
                  {
                      "resolution": 720,
                      "size": 142221129
                  },
                  {
                      "resolution": 1080,
                      "size": 227363404
                  }
              ],
              "creator": {
                  "defaultAvatar": false,
                  "province": 460000,
                  "authStatus": 0,
                  "followed": false,
                  "avatarUrl": "http://p1.music.126.net/4vOGIEMQNJPkDX8I-Lg-NA==/109951165108395413.jpg",
                  "accountStatus": 0,
                  "gender": 1,
                  "city": 460100,
                  "birthday": 916070400000,
                  "userId": 449157773,
                  "userType": 207,
                  "nickname": "LY-TO",
                  "signature": "私人号，不是站子。\n持续更新优质舞台，转赞评加热度哦！\n专注自家即可，记得关注我哦！\n其他艺人舞台也可更新，接受粉丝视频投稿！\n\n投稿材料：\n1：超清画质以上（可包含）的视频\n2：视频的原链接\n3：视频标题（艺人/歌曲名/节目名/是否为Live版）\n4：视频发生日期（年/月/日）\n5：视频封面（选填）\n\n投稿邮箱：ly-to@foxmail.com\n\n.",
                  "description": "",
                  "detailDescription": "",
                  "avatarImgId": 109951165108395410,
                  "backgroundImgId": 109951163885412640,
                  "backgroundUrl": "http://p1.music.126.net/9k73nsZ09YzW8_7EUGZPcA==/109951163885412633.jpg",
                  "authority": 0,
                  "mutual": false,
                  "expertTags": null,
                  "experts": null,
                  "djStatus": 0,
                  "vipType": 11,
                  "remarkName": null,
                  "backgroundImgIdStr": "109951163885412633",
                  "avatarImgIdStr": "109951165108395413"
              },
              "urlInfo": {
                  "id": "BE34DD8586A78726C056000444774DE9",
                  "url": "http://vodkgeyttp9.vod.126.net/vodkgeyttp8/wN7Ch4nH_3072604605_uhd.mp4?ts=1649300403&rid=1FD50EBFEF97C6C4F90EB544979E2157&rl=3&rs=ULevuYVzeFJSyjeTZGwIPQITKIABzLHA&sign=20049c431e46b47749fb4926165008ae&ext=zM2w%2BAOqnNWbygmG8n8fe%2BdeG1xVjWVgPNHMs%2BCB4kt2k%2BrrdLANlcbLmiLd%2FcHuxnVcpho9Y4Ye2RhR9eGjhmRJZPwgFUj4wD%2FBnGL1ML175dYteGwa9Up6p6QfJP11rHq69dBYFsp3qtc3nZOznbJ9eKHOPCvI057UyFdtFLv4nJ3DeKsry1NY1IBmFuvQ9WTWyeHDyZWDJJYyyzgnkvUsYJM1bpI78F4y6nEQlkiOjMQpJq2YroLiBaYE5rUc",
                  "size": 227363404,
                  "validityTime": 1200,
                  "needPay": false,
                  "payInfo": null,
                  "r": 1080
              },
              "videoGroup": [
                  {
                      "id": 58100,
                      "name": "现场",
                      "alg": null
                  },
                  {
                      "id": 9102,
                      "name": "演唱会",
                      "alg": null
                  },
                  {
                      "id": 59101,
                      "name": "华语现场",
                      "alg": null
                  },
                  {
                      "id": 57108,
                      "name": "流行现场",
                      "alg": null
                  },
                  {
                      "id": 59108,
                      "name": "巡演现场",
                      "alg": null
                  },
                  {
                      "id": 1100,
                      "name": "音乐现场",
                      "alg": null
                  },
                  {
                      "id": 5100,
                      "name": "音乐",
                      "alg": null
                  },
                  {
                      "id": 16231,
                      "name": "鹿晗",
                      "alg": null
                  },
                  {
                      "id": 23116,
                      "name": "音乐推荐",
                      "alg": null
                  }
              ],
              "previewUrl": null,
              "previewDurationms": 0,
              "hasRelatedGameAd": false,
              "markTypes": null,
              "relateSong": [
                  {
                      "name": "超级冠军 (Live in Guangzhou)",
                      "id": 517713041,
                      "pst": 0,
                      "t": 0,
                      "ar": [
                          {
                              "id": 1038093,
                              "name": "鹿晗",
                              "tns": [],
                              "alias": []
                          }
                      ],
                      "alia": [],
                      "pop": 20,
                      "st": 0,
                      "rt": null,
                      "fee": 1,
                      "v": 15,
                      "crbt": null,
                      "cf": "",
                      "al": {
                          "id": 36705109,
                          "name": "2016鹿晗重启Reloaded巡回演唱会广州站",
                          "picUrl": "http://p3.music.126.net/XDBoqaOQ7s0QiFwBpVnvcw==/109951163058933292.jpg",
                          "tns": [],
                          "pic_str": "109951163058933292",
                          "pic": 109951163058933300
                      },
                      "dt": 266341,
                      "h": {
                          "br": 320000,
                          "fid": 0,
                          "size": 10656045,
                          "vd": 33538
                      },
                      "m": {
                          "br": 192000,
                          "fid": 0,
                          "size": 6393645,
                          "vd": 36050
                      },
                      "l": {
                          "br": 128000,
                          "fid": 0,
                          "size": 4262445,
                          "vd": 37518
                      },
                      "a": null,
                      "cd": "1",
                      "no": 14,
                      "rtUrl": null,
                      "ftype": 0,
                      "rtUrls": [],
                      "djId": 0,
                      "copyright": 0,
                      "s_id": 0,
                      "cp": 2708585,
                      "mv": 0,
                      "rtype": 0,
                      "rurl": null,
                      "mst": 9,
                      "publishTime": 1510156800000,
                      "privilege": {
                          "id": 517713041,
                          "fee": 1,
                          "payed": 0,
                          "st": 0,
                          "pl": 0,
                          "dl": 0,
                          "sp": 0,
                          "cp": 0,
                          "subp": 0,
                          "cs": false,
                          "maxbr": 999000,
                          "fl": 0,
                          "toast": false,
                          "flag": 4,
                          "preSell": false
                      }
                  }
              ],
              "relatedInfo": null,
              "videoUserLiveInfo": null,
              "vid": "BE34DD8586A78726C056000444774DE9",
              "durationms": 264592,
              "playTime": 24610,
              "praisedCount": 120,
              "praised": false,
              "subscribed": false
          }
      }
    ]
    const {videoList} = this.data
    videoList.push(...newVideoList) /* ...解构数组，push的应该是对象。 */
    this.setData({
      videoList
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
    /* 在全局json 或 页面json文件中，配置enablePullDownRefresh为true。然后用户 下拉才能触发该函数。
       若刷新被触发 自动显示三个点以及页面向下拉伸，刷新完成后 会自动关闭三个点以及页面复位。和scroll-view不同。 */
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    /* 用户拉到页面底部，内容已全部加载完毕时，该函数会自动触发。 */
  },

  /**
   * 用户点击右上角分享 的回调。
   */
  onShareAppMessage: function ({from}) { /* 形参是个对象，这里从对象中 解构出from。 */
    /* 当一点击分享时，就会触发该函数。 */
    console.log(from)

    if (from === 'button') {
      return { /* 如果不写自定义对象的话，title、path、imageUrl也都有默认值。*/
        title: '来自button的分享',
        path: '/pages/video/video',
        imageUrl: '/static/images/nvsheng.jpg' 
      }
    }else {
      return {
        title: '来自menu的分享',
        path: '/pages/video/video'
      }      
    }
  }
})