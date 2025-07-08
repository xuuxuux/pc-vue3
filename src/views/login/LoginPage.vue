<script setup>
import { ref, onMounted } from 'vue';
import api from '../../api'
import { sendReq } from '@/config/mixin'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores';
//组件名称
defineOptions({
  name: 'LoginPage'
})
// 获取store实例
const userStore = useUserStore()
// 定义响应式数据
const userName = ref('');
const nickName = ref('');
const password = ref('');
const repassword = ref('');
const verificationCode = ref('');
const isNoLogin = ref(false);
const haveRead = ref(false);
const codeCountNum = ref('获取验证码');
const dialogAgreement = ref(false);
const isRegistered = ref('2');
// 获取路由参数
const route = useRoute();
const router = useRouter();
// 手机号正则
const reg = /^1[13456789]\d{9}$/
// 监听路由变化
onMounted(() => {
  if (route.query.type) {
    isRegistered.value = route.query.type;
  }
});
// 获取用户信息
const getUserInfo = () => {
  const params = {
    url: api.getUser,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      userStore.setUserInfo(res.data)
    }
  })
}
// 获取验证码
const getCode = () => {
  if (!reg.test(userName.value)) {
    ElMessage.error('手机号格式错误')
    return
  }
  if (codeCountNum.value !== '获取验证码') {
    return
  }
  let params = {
    url: api.vCode,
    method: 'POST',
    data: {
      phone: userName.value
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      codeCountNum.value = res.data
      ElMessage.success('验证码获取成功')
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 阅读协议
const readAgreement = () => {
  dialogAgreement.value = true
}
// 跳转首页
const goToIndex = () => {
  router.push({ path: '/' })
}
// 登录判断
const login = () => {
  if (isRegistered.value === '2') {
    getLogin()
  } else if (haveRead.value) {
    getRegister()
  } else {
    ElMessage.warning('请阅读并同意服务协议')
  }
}
// 登录
const getLogin = () => {
  if (!reg.test(userName.value)) {
    ElMessage.error('手机号码格式错误')
    return
  }
  if (userName.value === '' || password.value === '') {
    ElMessage.error('请输入完整信息')
    return
  }

  const params = {
    url: api.login,
    method: 'POST',
    data: {
      username: userName.value,
      password: password.value
    }
  }

  sendReq(params, (res) => {
    if (res.status === 200) {
      // 使用 Cookie 库直接操作
      const expires = isNoLogin.value ? 7 : 1
      Cookies.set('token', res.data.token, { expires })
      getUserInfo()
      ElMessage.success('登录成功')
      router.push({ path: '/' })
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// 注册
const getRegister = () => {
  if (!reg.test(userName.value)) {
    ElMessage.error('手机号码格式错误')
    return
  }

  if (verificationCode.value === '' || nickName.value === '' || password.value === '') {
    ElMessage.error('请输入完整信息')
    return
  }

  if (password.value !== repassword.value) {
    ElMessage.error('两次密码不一致')
    return
  }

  const params = {
    url: api.register,
    method: 'POST',
    data: {
      account: userName.value,
      captcha: verificationCode.value,
      nickname: nickName.value,
      password: password.value
    }
  }

  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('注册成功')
      registered()
    } else {
      codeCountNum.value = '获取验证码'
      ElMessage.warning(res.msg)
    }
  })
}

const registered = () => {
  userName.value = ''
  verificationCode.value = ''
  nickName.value = ''
  password.value = ''
  repassword.value = ''
  if (isRegistered.value === '1') {
    isRegistered.value = '2'
  } else {
    isRegistered.value = '1'
  }
}
</script>

<template>
  <div class="login">
    <div class="loginTop">
      <div class="loginLogo warp">
        <div class="loginImgBox" @click="goToIndex">
          <img src="@/assets/images/cereshop/home/eshop.png" alt="">
        </div>
        <span>欢迎来到PC商城</span>
      </div>
    </div>
    <div class="loginCent">
      <div class="loginBox warp">
        <div class="loginForm">
          <div class="loginTit">{{ isRegistered == '1' ? '注册' : '登录' }}</div>
          <div class="loginFormBox">
            <div class="inputBox">
              <label>手机号码</label>
              <el-input v-model="userName" placeholder="请输入您的手机号码"></el-input>
            </div>
            <div class="inputBox" v-if="isRegistered === '1'">
              <label>验证码</label>
              <el-input v-model="verificationCode" placeholder="请输入验证码">
                <template #append>
                  <el-button class="codeBtn" @click="getCode">{{ codeCountNum }}</el-button>
                </template>
              </el-input>
            </div>
            <div class="inputBox" v-if="isRegistered === '1'">
              <label>昵称</label>
              <el-input v-model="nickName" placeholder="请输入昵称"></el-input>
            </div>
            <div class="inputBox">
              <label>密码</label>
              <el-input v-model="password" show-password placeholder="请输入密码"></el-input>
            </div>
            <div class="inputBox" v-if="isRegistered === '1'">
              <label>确认密码</label>
              <el-input v-model="repassword" show-password placeholder="请输入确认密码"></el-input>
            </div>
            <div class="noLogin" :class="{ registered: isRegistered === '1' }">
              <el-checkbox v-show="isRegistered === '2'" v-model="isNoLogin">七天免登录</el-checkbox>
              <span @click="registered">{{ isRegistered === '1' ? '登录' : '用户注册' }}</span>
            </div>
            <div class="loginBtn" @click="login">{{ isRegistered === '1' ? '注册' : '立即登录' }}</div>
          </div>
          <div class="loginProtocol" v-if="isRegistered === '1'">
            <el-checkbox v-model="haveRead"></el-checkbox>
            <span>阅读并同意</span>
            <span @click="readAgreement">《eshop 服务协议》</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="服务协议" v-model="dialogAgreement" width="50%">
      <span>这是服务协议</span>
    </el-dialog>
  </div>
</template>
<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  flex-direction: column;
  min-height: 768px;

  .loginTop {
    box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 999;
    flex-shrink: 0;

    .loginLogo {
      display: flex;
      align-items: center;
      height: 88px;

      img {
        width: 180px;
        margin-right: 30px;
      }

      span {
        font-size: 18px;
        color: $fontColor;
      }

      .loginImgBox {
        width: 180px;
        height: 40px;
        align-items: center;
        display: flex;
        margin-right: 20px;
        margin-left: -50px;
        cursor: pointer;

        img {
          width: 100%;
        }
      }
    }
  }

  .loginCent {
    background: url('../../assets/images/loginBg.jpg') no-repeat;
    flex-grow: 1;
    background-size: cover;
    display: flex;
    align-items: center;

    .loginBox {
      display: flex;
      align-items: center;
      margin: 0 auto;
    }

    .loginForm {
      width: 540px;
      background: #ffffff;
      box-shadow: 0px 15px 14px 2px rgba(162, 87, 20, 0.15);
      border-radius: 10px;
      margin: 0 auto;

      .loginTit {
        height: 50px;
        display: flex;
        align-items: center;
        font-size: 30px;
        color: $mainColor;
        width: 100%;
        justify-content: center;
        margin: 30px 0;

        &:before {
          content: '';
          height: 2px;
          width: 98px;
          display: block;
          background: url("@/assets/images/dzuo.png") no-repeat;
          margin-right: 27px;
        }

        &:after {
          content: '';
          height: 2px;
          width: 98px;
          display: block;
          background: url("@/assets/images/dyou.png") no-repeat;
          margin-left: 27px;
        }
      }

      .loginFormBox {
        padding: 0 60px;

        .inputBox {
          margin: 10px 0 10px 0;

          label {
            color: $fontColor;
            font-weight: 500;
            display: block;
            margin-bottom: 5px;
          }

          :deep(.el-input__inner) {
            height: 32px;
            // font-size: 16px;
            border: none;
            margin: 4px 0 4px 0;
            color: #666666;
            padding-left: 0;
          }

          :deep(.el-input-group__append) {
            width: 140px;
            padding: 0;
          }

          :deep(.el-input__wrapper) {
            width: 100%;
          }

          .codeBtn {
            width: 100%;
            height: 100%;
            padding: 0;
            margin: 0;
            background: #EEEEEE;
            border-radius: 4px;
            display: block;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
          }

          .codeCount {
            color: #999999;
          }
        }

        .noLogin {
          color: #333333;
          font-size: 18px;
          margin: 20px 0 30px 0;
          height: 30px;
          align-items: center;
          display: flex;
          justify-content: space-between;

          span {
            cursor: pointer;
            font-size: 16px;
            text-decoration: underline;
            color: #666666;
          }
        }

        .registered {
          justify-content: flex-end;
        }

        .loginBtn {
          width: 100%;
          background: $mainColor;
          height: 40px;
          line-height: 40px;
          text-align: center;
          font-size: 20px;
          color: #ffffff;
          margin-bottom: 60px;
          cursor: pointer;
        }
      }

      .loginProtocol {
        padding: 0 60px;
        display: flex;
        align-items: center;
        height: 80px;
        line-height: 80px;
        border-top: 1px solid #EEEEEE;

        span {
          margin-left: 10px;
        }

        span:nth-child(3) {
          color: #426BEA;
          cursor: pointer;
        }
      }

      :deep(.el-checkbox) {
        display: inherit;
      }

      :deep(.el-checkbox__inner) {
        width: 20px;
        height: 20px;

        &:after {
          height: 10px;
          left: 7px;
          width: 4px;
        }
      }
    }
  }

  :deep(.el-dialog__body) {
    max-height: 500px;
    min-height: 300px;
    overflow: auto;
  }
}
</style>
