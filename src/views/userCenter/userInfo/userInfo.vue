<script setup>
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { useUserStore } from '@/stores'
import Cookie from 'js-cookie'
import { ref, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'userInfo'
})
const router = useRouter()
const userStore = useUserStore()

const isUpt = ref(false)
const password = ref('')
const newPassword = ref('')
const renewPassword = ref('')
onMounted(() => {
  getUserInfo()
})

const userInfo = computed(() => userStore.userInfo)

if (!Cookie.get('token')) {
  userStore.setUserInfo('SET_USERINFO') // 修改用户信息
  userStore.setCartNumber('SET_CARTNUMBER')
  userStore.setShoppingCart('SET_SHOPPINGCART')
  userStore.setNewAddress('SET_NEWADDRESS')
  userStore.setAreaCode('SET_AREACODE')
}

const getUserInfo = () => {
  let params = {
    url: api.getUser,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      userStore.setUserInfo(res.data)
    }
  })
}
const uptPhone = (type) => {
  if (type === 1) {
    isUpt.value = true
  } else {
    let reg = /^1[13456789]\d{9}$/
    if (!reg.test(userInfo.value.phone)) {
      ElMessage.error('手机号格式错误')
      return
    }
    ElMessageBox.confirm('此操作将修改用户手机号, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let params = {
        url: api.uptUserInfo,
        method: 'POST',
        data: {
          phone: userInfo.value.phone
        }
      }
      sendReq(params, res => {
        if (res.status === 200) {
          ElMessage.success('修改成功!')
          isUpt.value = false
          getUserInfo()
        } else {
          ElMessage.warning(res.msg)
        }
      })
    }).catch(() => {
    })
  }
}
const saveUserInfo = () => {
  if (password.value === '' || newPassword.value === '' || renewPassword.value === '') {
    ElMessage.warning('内容不能为空')
    return
  }
  if (newPassword.value !== renewPassword.value) {
    ElMessage.warning('两次密码不一致')
    return
  }
  ElMessageBox.confirm('此操作将修改用户密码, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    let params = {
      url: api.uptPassword,
      method: 'POST',
      data: {
        password: password.value,
        newPassword: newPassword.value
      }
    }
    sendReq(params, res => {
      if (res.status === 200) {
        ElMessage.success('修改成功，请重新登录')
        Cookie.remove('token')
        userStore.setUserInfo({})
        userStore.setCartNumber('')
        userStore.setShoppingCart({})
        userStore.setNewAddress({})
        userStore.setAreaCode([])
        router.push({ path: '/login', query: { type: 2 } })
      } else {
        ElMessage.warning(res.msg)
      }
    })
  }).catch(() => {
  })
}
</script>
<template>
  <div class="userInfo">
    <div class="userNameBox userBlock">
      <label>昵称：</label>
      <span>{{ userInfo.nickname }}</span>
    </div>
    <div class="bindPhoneBox userBlock">
      <label>手机号：</label>
      <div class="phoneInfo" v-if="isUpt">
        <el-input v-model="userInfo.phone" placeholder="请输入手机号"></el-input>
        <span @click="uptPhone(2)">保存</span>
      </div>
      <div class="phoneInfo" v-else>
        <span>{{ userInfo.phone }}</span>
        <span @click="uptPhone(1)">修改</span>
      </div>
    </div>
    <div class="bindPhoneBox userBlock">
      <label>账户余额：</label>
      <div class="phoneInfo">
        <span>￥{{ userInfo.nowMoney }}</span>
      </div>
    </div>
    <div class="userNameBox userBlock">
      <label>原密码：</label>
      <el-input v-model="password" show-password placeholder="请输入原密码"></el-input>
    </div>
    <div class="userNameBox userBlock">
      <label>新密码：</label>
      <el-input v-model="newPassword" show-password placeholder="请输入新密码"></el-input>
    </div>
    <div class="userNameBox userBlock">
      <label>重复新密码：</label>
      <el-input v-model="renewPassword" show-password placeholder="请输入重复新密码"></el-input>
    </div>
    <div class="userInfoSave" @click="saveUserInfo" v-throttle>修改密码</div>
  </div>
</template>



<style lang="scss" scoped>
.userInfo {
  padding: 30px;
  border: 1px solid #E5E5E5;

  .userNameBox {
    :deep(.el-input__wrapper) {
      padding: 0;
    }

    span {
      color: #333333;
      text-decoration: none;
      cursor: default;
    }
  }

  .userBlock {
    margin-top: 30px;
    display: flex;
    align-items: center;

    label {
      font-weight: normal;
      font-size: 16px;
      color: #666666;
      width: 120px;
    }
  }

  .bindPhoneBox {
    .phoneInfo {
      font-size: 16px;

      :deep(.el-input__wrapper) {
        padding: 0;
      }

      :deep(.el-input) {
        width: 130px;
      }

      span {
        margin-right: 15px;
        text-decoration: underline;
        cursor: pointer;
      }

      span:nth-child(1) {
        color: #333333;
        text-decoration: none;
        cursor: default;
      }

      span:nth-child(2) {
        color: $mainColor;
        margin-left: 10px;
      }

      span:nth-child(3) {
        color: #666666;
      }
    }
  }

  .userInfoSave {
    margin: 50px 0 0 100px;
    width: 115px;
    height: 30px;
    line-height: 30px;
    background: #FFFFFF;
    border: 1px solid $mainColor;
    border-radius: 4px;
    text-align: center;
    color: $mainColor;
    cursor: pointer;
  }
}
</style>
