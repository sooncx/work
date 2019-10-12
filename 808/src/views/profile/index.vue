<template>
  <div class="app-container">
    <div v-if="userData">
      <user-card :user="userData" />
      <el-row v-show="false" :gutter="20">
        <el-col :span="24" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="userData" />
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Activity from './components/Activity'
import Timeline from './components/Timeline'
import Account from './components/Account'

export default {
  name: 'Profile',
  components: { UserCard, Activity, Timeline, Account },
  data() {
    return {
      activeTab: 'activity'
    }
  },
  computed: {
    ...mapGetters([
      'userData'
    ])
  },
  methods: {

  }
}
</script>
