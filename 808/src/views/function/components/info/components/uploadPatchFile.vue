<template>
  <el-upload
    ref="upload"
    class="upload-exeFile"
    action="https://jsonplaceholder.typicode.com/posts/"
    :on-change="handleChange"
    :on-progress="handleProgress"
    :on-success="handleUploadSuccess"
    :show-file-list="false"
    :auto-upload="false"
    :file-list="fileList"
    :multiple="false"
    :data="formData"
    :http-request="doUploadPathFile"
  >
    <span slot="trigger">
      <span v-if="file" class="file-sp" title="重新选取文件">{{ file.name }}</span>
      <el-button v-else size="mini" type="primary">选取文件</el-button>
    </span>
    <el-input v-model="upFileName" placeholder="请输入版本号" class="version-input-box" size="mini" />
    <el-button style="margin-left: 10px;" size="mini" type="success" :loading="isUploading" @click="submitUpload">上传到服务器</el-button>
  </el-upload>
</template>
<script>
import { updateFile } from '@/api/testFunction'
export default {
  data() {
    return {
      file: null,
      fileList: [],
      isUploading: false,
      upFileName: ''
    }
  },
  computed: {
    formData() {
      return {
        sim: this.deviceData.sim,
        type: '1',
        data: {
          fileName: this.file ? this.file.name : ''
        }
      }
    },
    deviceData() {
      return this.$store.state.testFunction.deviceData
    }
  },
  methods: {
    handleUploadSuccess(res, file) {
      console.log('上传成功')
    },
    handleProgress(event, file, fileList) {
      console.log(event, file, fileList, '-progress')
    },
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.file = fileList[0]
    },
    submitUpload() {
      debugger
      this.$refs.upload.submit()
    },
    doUploadPathFile(data) {
      if (!this.upFileName) {
        this.$message({
          message: '请输入版本号',
          type: 'warning'
        })
        return
      }
      this.isUploading = true
      const param = new FormData()
      param.append('sim', this.formData.sim)
      param.append('file', data.file)
      param.append('upFileName', this.upFileName)
      updateFile(param, {
        onUploadProgress: e => {
          var completeProgress = ((e.loaded / e.total * 100) | 0) + '%'
          this.progress = completeProgress
        }
      }).then(rst => {
        this.isUploading = false
        if (rst.code === 0) {
          this.$message({
            message: '上传升级包成功',
            type: 'success'
          })
        }
      }).catch(e => {
        this.isUploading = false
      })
    }
  }
}
</script>
<style scoped  lang="scss">

.upload-exeFile{
  display: inline-block;
  .file-sp{
    color:#1890ff;
    &:hover{
          text-decoration: underline;
    }
  }
}
.version-input-box{
  width:120px;
  display:inline-block
}
</style>
