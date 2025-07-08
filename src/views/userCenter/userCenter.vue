<script setup>
import Cookie from 'js-cookie'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'
defineOptions({
  name: 'userCenter'
})
const router = useRouter()
const userStore = useUserStore()
onMounted(() => {
  if (!Cookie.get('token')) {
    ElMessage.warning('请先登录')
    userStore.resetStore()
    router.push({ path: '/login' })
  }
})
computed(() => userStore.getUserInfo())

const defaultActive = computed(() => {
  return router.currentRoute.value.path.replace('/', '')
})
</script>

<template>
  <div>
    <div class="userCenter warp">
      <div class="leftMenu">
        <div class="leftMenuBox">
          <el-menu :default-active="defaultActive" active-text-color="#FF7800" router>

            <el-menu-item class="flex-start" index="userInfo"><span class="title">个人信息</span></el-menu-item>
            <el-menu-item class="flex-start" index="myOrder"><span class="title">我的订单</span></el-menu-item>
            <el-menu-item class="flex-start" index="signingAddress"><span class="title">收货地址</span></el-menu-item>
            <el-menu-item class="flex-start" index="recharge"><span class="title">钱包充值</span></el-menu-item>
            <el-menu-item class="flex-start" index="favorites"><span class="title">我的收藏</span></el-menu-item>
            <el-menu-item class="flex-start" index="browseRecords"><span class="title">浏览足迹</span></el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="userCenterInfo">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.userCenter {
  margin-top: 30px;
  display: flex;
  margin-bottom: 140px;

  .leftMenu {
    width: 186px;
    border: 1px solid #E5E5E5;
    margin-right: 16px;

    .leftMenuBox {
      :deep(.el-menu) {
        border-right: none;
      }


      :deep(.el-menu-item) {
        padding: 0 !important;
        display: block;

        .title {
          width: 100%;
          padding-left: 50px;
          border-left: 4px solid #ffffff;
          position: relative;
        }

        .tip {
          height: 18px;
          line-height: 18px;
          border-radius: 9px;
          color: #ffffff;
          font-size: 12px;
          padding: 0 5px;
          background-color: #FF7800;
          position: absolute;
          right: -18px;
          top: -8px;
        }
      }

      :deep(.el-menu-item):focus,
      .el-menu-item:hover {
        background: none;
      }

      :deep(.is-active) {
        .title {
          border-left: 4px solid $mainColor;
          box-sizing: content-box;
        }
      }
    }
  }

  .userCenterInfo {
    flex: 1;
  }
}
</style>
