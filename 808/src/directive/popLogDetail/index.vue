<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="700px"
      @open="isShowLonglongRemark=false"
    >
      <template slot="title">
        日志内容
        <span class="multimedia-btns">
          <el-button v-show="displayData.hasPhoto" size="mini " type="primary" plain @click="doShowPhoto">图片</el-button>
          <el-button v-show="displayData.hasVideo" size="mini" type="primary" plain @click="doShowVideo">播放视频</el-button>
          <el-button v-show="displayData.hanExcel" size="mini" type="primary" plain @click="doShowExcel">导出</el-button>
          <el-button v-show="displayData.hasVideo" size="mini" :loading="isDownFileing" type="primary" plain @click="downVideo">下载视频</el-button>
        </span>
      </template>
      <div class="popLogDetail-box">
        <div class="hasPhoto-row-box">
          <div class="popLogDetail-row">
            <div class="col-left">消息时间：</div>
            <div class="col-right">{{ displayData.time || displayData.createTime }}</div>
          </div>
          <div class="popLogDetail-row">
            <div class="col-left">消息来源：</div>
            <div class="col-right">{{ displayData.source }}</div>
          </div>
        </div>
        <div class="popLogDetail-row-box">

          <div class="popLogDetail-row">
            <div class="col-left">消息ID：</div>
            <div class="col-right">{{ displayData.msgNo }}</div>
          </div>
          <div class="popLogDetail-row">
            <div class="col-left">消息描述：</div>
            <div class="col-right">{{ displayData.descp }}</div>
          </div>
        </div>
        <div class="popLogDetail-row-box">
          <div class="popLogDetail-row">
            <div class="col-left">流水号：</div>
            <div class="col-right">{{ displayData.msgSerial }}</div>
          </div>
          <div class="popLogDetail-row">
            <div class="col-left">手机号：</div>
            <div class="col-right">{{ displayData.sim||displayData.phone }}</div>
          </div>
        </div>
        <div class="popLogDetail-row">
          <div class="col-left">原始数据：</div>
          <div class="col-right">
            <div class="textarea-div"> {{ displayData.originalData ||'--' }}</div>

          </div>
        </div>
        <div class="popLogDetail-row">
          <div class="col-left">消息内容：</div>
          <div class="col-right">
            <template v-if="isLongLongRemarkMode">
              <div v-if="!isShowLonglongRemark" class="textarea-div">
                <div v-html="displayData.remark" />
                <span class="openAllRearmk-sp" @click="isShowLonglongRemark=true">展开全部</span>
              </div>
              <div v-else class="textarea-div" v-html="splitDetailContent"  ref="textareaContet"/>
            </template>
            <template v-else>
              <div class="textarea-div" v-html="displayData.remark ||'--'" />
            </template>

          </div>
        </div>

      </div>
    <!-- <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span> -->
    </el-dialog>
    <transition name="el-fade-in">
      <div v-if="videoDialogVisible" class="video-dia">
        <div class="video-cont" :style="diaStyleObj">
          <vueVideo :data="videoData" />
        </div>
        <div class="video-dia-task">
          <svg-icon class="video-dia-close-btn" icon-class="close" @click="doHideVideo" />
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
import vueVideo from "@/components/vueVideo/vueVideo";
import { findOneById } from "@/api/log";
import downloadFile from "@/utils/downloadFile";
import { handlerItemLogData } from "@/utils/functionUtil";
export default {
  components: { vueVideo },
  data() {
    return {
      propData: {},
      dialogVisible: false,
      initStatus: "",
      videoDialogVisible: false, // 是否显示视频播放
      isDownFileing: false, // 是否显示下载视频按钮
      isShowLonglongRemark: false, // 是否显示超长超大超吊remark
      splitDetailContent: "" //  分批加载出来的内容
    };
  },
  watch: {
    isShowLonglongRemark(val) {
      if (val) {
        this.splitDetailContent = this.displayData.allRemark.slice(0,50000)
        this.$nextTick(function () {
          console.log(this.$refs.textareaContet,this.$refs)
        this.$refs.textareaContet.addEventListener("scroll", this.loadDetailContent);
        })
      }
    }
  },
  computed: {
    displayData() {
      return this.propData;
    },
    videoSrc() {
      console.log(this.displayData, "林...");
      // return 'http://vjs.zencdn.net/v/oceans.mp4'
      // return 'http://120.25.212.116:7999/api/multi/getMultiFileStream.json?multiType=2&sim=15321064311&lens=2-4-1'
      return (
        process.env.VUE_APP_BASE_API +
        "api/multi/getMultiFileStream.json?multiType=2&sim=" +
        this.displayData.externData.terminaNo +
        "&lens=" +
        this.displayData.externData.buttonType +
        "&checkLogId=" +
        this.displayData.checkLogId
      );
    },
    videoData() {
      return {
        sources: [
          {
            src: this.videoSrc,
            type: "video/mp4"
          }
        ],
        poster: "//vjs.zencdn.net/v/oceans.png",
        options: {
          width: "400px",
          height: "300px"
        }
      };
    },
    diaStyleObj() {
      return {
        width: this.videoData.options.width,
        height: this.videoData.options.height
      };
    },
    isLongLongRemarkMode() {
      // 是否是remark过长模式
      if (this.displayData.allRemark) {
        return true;
      }
      return false;
    }
  },
  methods: {
    loadDetailContent(e) {
      //  分流加载
      console.log(e.target.scrollTop + 300,e.target.scrollHeight)

      
      if (e.target.scrollTop + 300 == e.target.scrollHeight) {
        this.$message({
          message: '加载中',
          iconClass:'el-icon-loading'
        })
              const SPLIT_LENGTH = 50000; //每次截取的长度
        let ContentLength = this.splitDetailContent.length;
        if (ContentLength >= this.displayData.allRemark.length) {
          this.$refs.textareaContet.removeEventListener("scroll", this.loadDetailContent);
        this.$message({
          message: '没有更多内容了',
          iconClass:'el-icon-loading'
        })
          return; //数量大于总数则停止递归
        }
        this.splitDetailContent += this.displayData.allRemark.slice(
          ContentLength,
          ContentLength + SPLIT_LENGTH
        );

      }
    },
    show({ data, isNeedGetDetail = false }) {
      // webSocket不需要重新获取数据
      this.propData = Object.assign({}, data);
      this.dialogVisible = true;
      if (isNeedGetDetail) {
        this.findOneById();
      }
    },
    findOneById() {
      this.initStatus = "loading";
      findOneById({ id: this.propData.id })
        .then(rst => {
          if (rst.code === 0) {
            rst.data = handlerItemLogData(rst.data);
            this.$set(
              this,
              "propData",
              Object.assign({}, this.propData, rst.data)
            );
            this.initStatus = "success";
          } else {
            this.initStatus = "error";
          }
        })
        .catch(e => {
          this.initStatus = "error";
        });
    },
    downVideo() {
      // 下载在原来视频地址加上sign=1
      this.isDownFileing = true;
      downloadFile(this.videoSrc + "&sign=1");
      setTimeout(() => {
        this.isDownFileing = false;
      }, 1000);
    },
    doShowExcel() {
      // 导出excel
      let { id } = this.displayData;
    
      let  sim = this.displayData.sim || this.displayData.externData.sim   // 获取不到externData  就获取外层sim
      let url = '/api/export/excelInLog.json?sim='+sim
      if(id) url+= `&checkLogDetailId=${id}`
      if(this.displayData.checkLogId) url+= `&checkLogId=${this.displayData.checkLogId}`
      if(this.displayData.type) url+= `&type=${this.displayData.type}`

        window.open(url);
    },
    doShowPhoto() {
      this.$imgsShow.show({
        imgList: [
          process.env.VUE_APP_BASE_API +
            "api/multi/getMultiFileStream.json?multiType=1&sim=" +
            this.displayData.externData.terminaNo +
            "&lens=" +
            this.displayData.externData.buttonType +
            "&checkLogId=" +
            this.displayData.checkLogId
        ]
      });
    },
    doShowVideo() {
      console.log(this.videoData.sources[0].src);
      this.videoDialogVisible = true;
    },
    doHideVideo() {
      this.videoDialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.popLogDetail-row-box {
  display: flex;
  margin-bottom: 10px;
  > .popLogDetail-row {
    width: 50%;
    margin-bottom: 0;
  }
}
.popLogDetail-row {
  margin-bottom: 10px;
  display: flex;
  > .col-left {
    width: 80px;
    padding-right: 5px;
    text-align: right;
    color: #999;
  }
  > .col-right {
    flex: 1;
  }
  .textarea-div {
    padding: 5px;
    width: 80%;
    background: #f5f9fd;
    max-height: 300px;
    overflow-y: auto;
    word-break: break-all;
    // line-height: 16px;
  }
}
.multimedia-btns {
  margin-left: 10px;
  vertical-align: middle;
}
.video-dia {
  height: 100%;
  width: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 999999;
  > .video-cont {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  > .video-dia-task {
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .video-dia-close-btn {
    position: absolute;
    font-size: 24px;
    width: 24px;
    height: 24px;
    right: 18px;
    top: 18px;
    cursor: pointer;
  }
}
.openAllRearmk-sp {
  color: #1890ff;
  cursor: pointer;
}
</style>

