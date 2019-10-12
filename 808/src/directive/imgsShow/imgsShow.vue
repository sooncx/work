<template>
  <div class="layout-mgt-30 noselect">
    <div v-if="largeContainer">
      <div class="btn-close">
        <i class="el-icon-close" title="关闭" @click="hide" />
      </div>
      <div v-show="pageShow" class="pageTip">
        {{ imageIndex + "/" + Number(curData.length) }}
      </div>
      <div v-show="false">
        <div v-for="(itemUrl, index) in displayImgList" :key="itemUrl">
          <img
            v-if="
              index === imageIndex ||
                index === imageIndex + 1 ||
                index === imageIndex + 2
            "
            :src="itemUrl"
          >
        </div>
      </div>
      <div v-show="tip1" class="tip">不能再放大了哦！</div>
      <div v-show="tip2" class="tip">不能再缩小了哦！</div>
      <div v-show="tip3" class="tip">前面已经没有了！</div>
      <div v-show="tip4" class="tip">已经是最后一张了哦！</div>

      <div class="largeContainer">
        <div v-show="isShowLeft" class="fl sideClick">
          <div @click="prevImg">
            <span class="clickArrow el-icon-arrow-left" />
          </div>
        </div>
        <div class="box-image-wrapper fl">
          <img
            id="myImg"
            :src="displayImg"
            class="mainImg"
            :style="{ maxWidth: mWidth, width: widthImg }"
            :class="{
              rotate90: rotate == 1,
              rotate180: rotate == 2,
              rotate270: rotate == 3,
              rotate0: rotate == 0
            }"
            @click.stop="doThis"
          >
          <canvas
            id="myCanvas"
            class="mainImg"
            style="z-index:-22;position: absolute;"
          />
          <br>
        </div>
        <div v-show="isShowRight" class="fr sideClickR">
          <div @click="nextImg">
            <span class="clickArrow el-icon-arrow-right" />
          </div>
        </div>
        <div v-if="largeContainer" class="bottom">
          <span
            class="rotate el-icon-zoom-in"
            title="放大"
            @click="largeImg"
          />
          <span
            class="rotate el-icon-zoom-out"
            title="缩小"
            @click="smallImg"
          />
          <span
            class="rotate el-icon-refresh"
            title="旋转"
            @click="rotateImg"
          />
          <span class="rotate">
            <span class="total-sp">{{
              imageIndex + "/" + displayImgList.length
            }}</span>
          </span>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImgsShow',
  props: {
    data: {
      type: Array
    }
  },
  data() {
    return {
      largeContainer: false,
      enlargeImgUrl: '',
      imageIndex: '',
      imageName: '',
      preImgUrl: '',
      nextImgUrl: '',
      rotate: 0,
      tip1: false,
      tip2: false,
      tip3: false,
      tip4: false,
      mWidth: '60%',
      widthImg: '60%',
      pageShow: false,
      curData: [],
      rorateSrc: ''
    }
  },
  computed: {
    displayData() {
      return this.curData[this.imageIndex - 1]
    },
    displayImg() {
      return typeof this.displayData === 'object'
        ? this.displayData.url
        : this.displayData
    },
    displayTitle() {
      return typeof this.displayData === 'object'
        ? this.displayData.title
        : this.displayData
    },
    isShowRight() {
      if (this.imageIndex < this.curData.length) {
        return true
      }
      return false
    },
    isShowLeft() {
      if (this.imageIndex === 1) {
        return false
      }
      return true
    },
    displayImgList() {
      var result = []
      this.curData.map(item => {
        if (typeof item === 'object') {
          result.push(item.url)
        } else {
          result.push(item)
        }
      })
      return result
    }
  },
  methods: {
    show({ imgList, index }) {
      this.curData = imgList
      index = index || 1
      this.enlargeImg(index)
    },
    hide() {
      this.enSmallImg()
    },
    enlargeImg(i) {
      this.pageShow = true
      this.imageIndex = Math.max(0, i)
      this.largeContainer = true
    },
    rotateImg() {
      if (this.rotate === 0) {
        this.rotate = 1
      } else if (this.rotate === 1) {
        this.rotate = 2
      } else if (this.rotate === 2) {
        this.rotate = 3
      } else {
        this.rotate = 0
      }
    },
    // rotateImgBackrotateImgBack() {
    //   if (this.rotate == 0) {
    //     this.rotate = 3;
    //   } else if (this.rotate == 1) {
    //     this.rotate = 0;
    //   } else if (this.rotate == 2) {
    //     this.rotate = 1;
    //   } else {
    //     this.rotate = 2;
    //   }
    // },
    largeImg() {
      if (this.mWidth == '100.0%') {
        this.tip1 = true
        setTimeout(() => {
          this.tip1 = false
        }, 1500)
      } else {
        this.mWidth = parseFloat(this.mWidth) + 10
        this.widthImg = parseFloat(this.widthImg) + 10
        this.mWidth = Number(this.mWidth).toFixed(1)
        this.mWidth += '%'
        this.widthImg = Number(this.widthImg).toFixed(1)
        this.widthImg += '%'
      }
    },
    smallImg() {
      if (this.mWidth == '10.0%') {
        this.tip2 = true
        setTimeout(() => {
          this.tip2 = false
        }, 1500)
      } else {
        this.mWidth = parseFloat(this.mWidth) - 10
        this.widthImg = parseFloat(this.widthImg) - 10
        this.mWidth = Number(this.mWidth).toFixed(1)
        this.mWidth += '%'
        this.widthImg = Number(this.widthImg).toFixed(1)
        this.widthImg += '%'
      }
    },
    enSmallImg() {
      this.pageShow = false
      this.largeContainer = false
      this.rotate = 0
      this.imageIndex = 0
      this.$set(this, 'curData', [])
    },
    prevImg() {
      if (this.imageIndex === 1) {
        this.tip3 = true
        setTimeout(() => {
          this.tip3 = false
        }, 1500)
      } else {
        this.imageIndex = this.imageIndex - 1
      }
    },
    nextImg() {
      // this.mWidth = "50%";
      // this.widthImg = "50%";
      if (this.imageIndex == this.curData.length) {
        this.tip4 = true
        setTimeout(() => {
          this.tip4 = false
        }, 1500)
      } else {
        this.imageIndex = this.imageIndex + 1
      }
    },
    doThis() {
      console.log('doThis')
    },
    downloadIamge(imgsrc, name) {
      // 下载图片地址和图片名
      var image = new Image()
      // 解决跨域 Canvas 污染问题
      image.src = imgsrc
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function() {
        var canvas = document.createElement('canvas')
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
        debugger
        var a = document.createElement('a') // 生成一个a元素
        var event = new MouseEvent('click') // 创建一个单击事件
        a.download = name || 'photo' // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
    },
    downloadCanvasIamge(path, name) {
      // 通过选择器获取canvas元素
      let base64 = ''
      var canvas = document.querySelector('#myCanvas')
      var cxt = canvas.getContext('2d')
      var img = new Image()
      // img.src = path;
      img.crossOrigin = 'Anonymous'
      // img.setAttribute("crossOrigin", "Anonymous");
      img = document.getElementById('myImg')
      // 使用toDataURL方法将图像转换被base64编码的URL字符串
      img.onload = function() {
        // 图片加载完，再draw 和 toDataURL
        debugger
        cxt.drawImage(img, 0, 0, img.width, img.height)
        base64 = canvas.toDataURL('image/png')
        // 生成一个a元素
        var a = document.createElement('a')
        // 创建一个单击事件
        var event = new MouseEvent('click')

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || '下载图片名称'
        // 将生成的URL设置为a.href属性
        a.href = base64

        // 触发a的单击事件
        a.dispatchEvent(event)
      }

      debugger
      cxt.drawImage(img, 0, 0, img.width, img.height)
      base64 = canvas.toDataURL('image/png')
      // 生成一个a元素
      var a = document.createElement('a')
      // 创建一个单击事件
      var event = new MouseEvent('click')

      // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
      a.download = name || '下载图片名称'
      // 将生成的URL设置为a.href属性
      a.href = base64

      // 触发a的单击事件
      a.dispatchEvent(event)
    }
  }
}
</script>

<style scoped>
.largeContainer {
  top: 0;
  right: 0;
  left: 0;
  position: fixed;
  width: 100%;
  height: -webkit-fill-available;
  height: fill-available;
  background-color: rgba(55, 55, 55, 0.7);
  z-index: 9999;
  overflow: auto;
  box-sizing: border-box;
}
.btn-close {
  position: fixed;
  cursor: pointer;
  top: 20px;
  right: 20px;
  z-index: 10000;
  color: #fff;
  font-size: 26px;
}
.box-image-wrapper {
  top: 0;
  position: fixed;
  width: 100%;
  height: -webkit-fill-available;
  height: fill-available;
  z-index: 99;
  text-align: center;
  overflow-y: auto;
  display: flex;
  padding-bottom: 60px;
}
.layout-mgt-30 {
  margin-top: 0px;
  z-index: 99;
}
.mainImg {
  cursor: pointer;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.largeImg60 {
  max-width: 60%;
  width: 60%;
}
.largeImg70 {
  max-width: 70%;
  width: 70%;
}
.largeImg80 {
  max-width: 80%;
  width: 80%;
}
.largeImg90 {
  max-width: 90%;
  width: 90%;
}
.largeImg100 {
  max-width: 100%;
  width: 100%;
}
.smallImg {
  height: 80px;
  width: 80px;
  float: left;
  margin-left: 20px;
  cursor: pointer;
}
.sideClick {
  height: 100%;
  width: 6%;
  cursor: pointer;
}
.sideClickR {
  height: 100%;
  width: 6%;
  cursor: pointer;
}
.sideClick div {
  position: fixed;
  z-index: 999;
  background-color: rgba(40, 40, 40, 0.8);
  height: 75px;
  width: 60px;
  top: 0;
  bottom: 0;
  margin: auto;
  margin-left: 20px;
}
.sideClickR div {
  position: fixed;
  z-index: 999;
  background-color: rgba(40, 40, 40, 0.8);
  height: 75px;
  width: 60px;
  top: 0;
  bottom: 0;
  margin: auto;
  right: 20px;
}
.clickArrow {
  text-align: center;
  padding-top: 20px;
  font-size: 36px;
  color: #fff;
  display: block;
}

.rotate0 {
  transform: rotate(0deg);
}
.rotate90 {
  transform: rotate(90deg);
}
.rotate180 {
  transform: rotate(180deg);
}
.rotate270 {
  transform: rotate(270deg);
}
.fr {
  float: right;
}
.fl {
  float: left;
}
.rotate {
  /* height: 30px; */
  cursor: pointer;
  vertical-align: middle;
  /* display: none; */
}
.rotateR {
  height: 30px;
  cursor: pointer;
  transform: rotateY(180deg);
}
.bottom {
  width: 100%;
  position: fixed;
  z-index: 99;
  bottom: 0;
  padding: 15px 0;
  margin-left: -8px;
  background-color: #464646;
  text-align: center;
}
.bottom span {
  font-size: 28px;
  color: #fff;
  margin: 0px 10px;
  z-index: 999;
}
.bottom span img {
  width: 26px;
  vertical-align: middle;
  margin-top: -2px;
}
.tip {
  position: fixed;
  top: 200px;
  margin: auto;
  left: 0;
  right: 0;
  background-color: #888;
  color: #fff;
  font-size: 12px;
  max-width: 150px;
  text-align: center;
  padding: 5px 5px;
  border-radius: 3px;
  z-index: 10000;
}
.pageTip {
  position: fixed;
  bottom: 74px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #888;
  color: #fff;
  padding: 2px 5px;
  font-size: 12px;
  display: inline-block;
  text-align: center;
  width: auto;
  border-radius: 6px;
  z-index: 999;
}
.img-name {
  font-size: 14px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: #1184e5;
  cursor: pointer;
}
.rotate .total-sp {
  font-size: 14px;
  font-weight: 100;
}
</style>
