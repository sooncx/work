<template>
  <el-card style="margin-bottom:20px;">
    <div class="tbl user-profile-tbl ver-ali-m">
      <div class="tbl-cell col-left">
        <div class="user-profile">
          <div class="box-center">
            <img :src="user.avatar" height="100px">
            <!-- <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
              <div>你好</div>
              <div>
                {{ user.permissionLevel===0 ?"管理员":"测试人员" }}
              </div>
            </pan-thumb> -->
          </div>
        </div>
      </div>
      <div class="tbl-cell">
        <div class="user-info-header">
          <div class="user-name text-left">{{ user.name }} <el-tag type="success">{{ user.permissionLevel===0 ?"管理员":"测试人员" }}</el-tag></div>
        </div>
        <div>
          <router-link :to="{ name: 'ChangePwd' }">
            <el-button type="primary">修改密码</el-button>
          </router-link>
          <!-- <el-tag
            v-for="item in permissionList"
            :key="item.label"
            class="permission-tag"

            :type="item.type"
            effect="dark"
          >
            {{ item.label }}
          </el-tag> -->
        </div>
      </div>
    </div>
    <!-- <el-row class="profile-handler-btns">
      <router-link :to="{ name: 'ChangePwd' }">
        <el-button type="primary">修改密码</el-button>
      </router-link>
    </el-row> -->

    <!-- </div> -->
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          avatar: '',
          roles: ''
        }
      }
    }
  },
  data() {
    return {
      permissionList: [
        { type: '', label: '标签一' },
        { type: 'success', label: '标签二' },
        { type: 'info', label: '标签三' },
        { type: 'danger', label: '标签四' },
        { type: 'warning', label: '标签五' }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.permission-tag{
  &+.permission-tag{
    margin-left:10px;
  }
}
 .text-muted {
   color: #777;
 }
.user-profile-tbl{
  >.col-left{
    width: 122px;
  }
  .user-info-header{
    margin-bottom: 10px;
  }
}
 .user-profile {
   .user-name {
     font-weight: bold;
   }

   .user-role {
     padding-top: 10px;
     font-weight: 400;
     font-size: 14px;
   }

   .box-social {
     padding-top: 30px;

     .el-table {
       border-top: 1px solid #dfe6ec;
     }
   }

   .user-follow {
     padding-top: 20px;
   }
 }
 .profile-handler-btns{
   margin-top:30px;
 }
</style>
