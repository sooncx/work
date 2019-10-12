<template>
  <div class="changePwd-wrap">
    <el-form ref="userData" :model="userData" :rules="rules" label-width="100px" class="demo-userData">
      <el-form-item label="用户名">
        <el-input v-model="userData.username" disabled />
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="userData.name" disabled />
      </el-form-item>
      <el-form-item label="所在单位">
        <el-input v-model="userData.company" disabled />
      </el-form-item>
      <el-form-item label="原密码" prop="oldPwd">
        <el-input v-model="userData.oldPwd" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd1">
        <el-input v-model="userData.newPwd1" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPwd2">
        <el-input v-model="userData.newPwd2" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="isSubmiting" type="primary" @click="submitForm('userData')">确认修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      ruleForm: {
        oldPwd: '',
        newPwd1: '',
        newPwd2: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入原密码', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        newPwd1: [
          { required: true, message: '请输入新密码', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' }
        ],
        newPwd2: [
          { required: true, message: '请再次输入新密码', trigger: 'change' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'change' },
          { required: true, trigger: 'change', validator: this.validatePassword }
        ]
      },
      isSubmiting: false
    }
  },
  computed: {
    ...mapGetters(['userData'])
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isSubmiting = true
          debugger
          this.$store.dispatch('user/changePwd', {
            newPwd: this.userData.newPwd1,
            oldPwd: this.userData.oldPwd,
            username: this.userData.username
          }).then(rst => {
            this.isSubmiting = false
            if (rst.code === 0) {
              Message({
                showClose: true,
                message: '修改密码成功，请重新登录',
                type: 'success',
                duration: 1500

              })
              this.$router.push(`/login`)
            }
          }).catch(e => {
            this.isSubmiting = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    validatePassword(rule, value, callback) {
      if (this.userData.newPwd2 !== this.userData.newPwd1) {
        callback(new Error('两次密码输入不一致，请重新输入'))
      } else {
        // this.$refs[ruleForm].clearValidate(['newPwd2', 'newPwd1'])
        callback()
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }

}
</script>
<style lang="scss" scoped>
.changePwd-wrap{
  margin-top:30px;
  padding: 20px;
}
</style>

