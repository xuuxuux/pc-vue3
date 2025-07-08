<script setup>
import addAddress from '@/components/orderInfo/addAddress.vue'
import api from '@/api'
import { sendReq } from '@/config/mixin'
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import Cookie from 'js-cookie'

defineOptions({
  name: 'signingAddress'
})
// const isDefault = ref(false)
const showDeleteAdd = ref(false)
const addAddressShow = ref(false)
const addressData = ref([])
const delCurrentAdd = ref({})
const loading = ref(false)
const flag = ref(true)
const userStore = useUserStore()
// const page = ref(1)

onMounted(() => {
  if (!Cookie.get('token')) {
    userStore.setNewAddress('SET_NEWADDRESS')
    userStore.setAreaCode('SET_AREACODE')
  }
  getAddressList()
})

const newAddress = computed(() => userStore.getnewAddress())

// 获取地址列表
const getAddressList = () => {
  loading.value = true
  let params = {
    url: api.addressList,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      addressData.value = res.data
      if (res.data.length === 0) {
        flag.value = false
      } else {
        flag.value = true
      }
      loading.value = false
    } else {
      ElMessage.warning(res.msg)
    }
  })
}
// const handleCurrentChange = (val) => {
//   page.value = val
//   getAddressList()
// }
const showDelete = (item) => {
  showDeleteAdd.value = true
  delCurrentAdd.value = item
}
// 删除地址
const deleteAdd = () => {
  let params = {
    url: api.delAddress,
    method: 'POST',
    data: {
      id: delCurrentAdd.value.id
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      showDeleteAdd.value = false
      ElMessage.success('删除成功')
      addressData.value = []
      getAddressList()
    } else {
      ElMessage.error(res.msg)
    }
  })
  showDeleteAdd.value = false
}
// 修改默认地址
const changeDefultAd = (item) => {
  let obj = {
    receiveId: item.id,
    receiveName: item.realName,
    receivePhone: item.phone,
    receiveAdress: item.province + '-' + item.city + '-' + item.district,
    address: item.detail,
    defult: item.isDefault === 1
  }
  userStore.setNewAddress(obj)
  updateAddressFun()
}
// 修改地址信息
const changeAddress = (item) => {
  let areaData = []
  areaData.push(item.province)
  areaData.push(item.city)
  areaData.push(item.district)
  let obj = {
    receiveId: item.id,
    receiveName: item.realName,
    receivePhone: item.phone,
    receiveAdress: item.province + '-' + item.city + '-' + item.district,
    address: item.detail,
    defult: item.isDefault === 1
  }
  userStore.setNewAddress(obj)
  userStore.setAreaCode(areaData)
  addAddressShow.value = true
}
// 新增地址
const addAddressBtn = () => {
  let obj = {
    receiveName: '',
    receivePhone: '',
    receiveAdress: '',
    address: '',
    defult: false
  }
  userStore.setAreaCode([])
  userStore.setNewAddress(obj)
  addAddressShow.value = true
}
// 新增地址
const hideAddDialog = () => {
  addAddressShow.value = false
  if (newAddress.value.receiveId) {
    updateAddressFun()
  } else {
    let address = newAddress.value.receiveAdress.split('-')
    let params = {
      url: api.editAddress,
      method: 'POST',
      data: {
        real_name: newAddress.value.receiveName,
        phone: newAddress.value.receivePhone,
        detail: newAddress.value.address,
        address: {
          province: address[0],
          city: address[1],
          district: address[2]
        },
        is_default: newAddress.value.defult.toString()
      }
    }
    sendReq(params, (res) => {
      if (res.status === 200) {
        ElMessage.success('地址添加成功')
        addressData.value = []
        userStore.setAreaCode([])
        userStore.getAddressList()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }
}
// 修改地址
const updateAddressFun = () => {
  addAddressShow.value = false
  let address = newAddress.value.receiveAdress.split('-')
  let params = {
    url: api.editAddress,
    method: 'POST',
    data: {
      id: newAddress.value.receiveId,
      real_name: newAddress.value.receiveName,
      phone: newAddress.value.receivePhone,
      detail: newAddress.value.address,
      address: {
        province: address[0],
        city: address[1],
        district: address[2]
      },
      is_default: newAddress.value.defult.toString()
    }
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      ElMessage.success('地址修改成功')
      addressData.value = []
      userStore.setAreaCode([])
      userStore.getAddressList()
    } else {
      ElMessage.error(res.msg)
    }
  })
}
const closeAdd = () => {
  addAddressShow.value = false
}
// const handleClose = (done) => {
//   confirm('确认关闭？')
//     .then(() => {
//       done()
//     })
//     .catch(() => { })
// }
</script>
<template>
  <div class="addressBox">
    <div class="addAddressBox">
      <span class="addAddressBtn" @click="addAddressBtn">新增收货地址</span>
    </div>
    <div class="addressList clearfix sub-main" v-loading="loading" v-if="flag">
      <div class="addressItem" :class="{ active: item.defult }" v-for="(item) of addressData" :key="item.receiveId">
        <div class="listItemInfoBox">
          <div class="isDefault">
            <span>设为默认地址</span>
            <el-switch v-model="item.isDefault" :active-value='1' :inactive-value='0' @change="changeDefultAd(item)"
              active-color="#FF7800" inactive-color="#c1c1c1">
            </el-switch>
          </div>
          <div class="addressInfo">
            <div class="infoItem">收货人：{{ item.realName }}</div>
            <div class="infoItem">所在地区：{{ item.province + item.city + item.district }}</div>
            <div class="infoItem">详细地址：{{ item.detail }}</div>
            <div class="infoItem">手机号：{{ item.phone }}</div>
          </div>
        </div>
        <div class="addressChange">
          <span @click="showDelete(item)"><i class="iconfont">&#xe62c;</i>删除</span>
          <span @click="changeAddress(item)"><i class="iconfont">&#xe605;</i>修改</span>
          <div v-show="item.isDefault === 1" class="iconfont defaultActive">&#xe612;</div>
        </div>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="nothing sub-main" v-else>
      <img src="../../../../static/image/nothing@2x.png" alt="">
      <p class="fs20 font-color-999">你还没有收货地址～</p>
    </div>
    <el-dialog title="新建收货地址" v-model:visible="addAddressShow" width="30%">
      <add-address @hideAddDialog="hideAddDialog" @cancelAdd="closeAdd"></add-address>
    </el-dialog>
    <el-dialog title="是否删除此项" v-model:visible="showDeleteAdd" width="30%">
      <div class="deleteAddInfo">
        <p>收货人： {{ delCurrentAdd.realName }}</p>
        <p>手机号码： {{ delCurrentAdd.phone }}</p>
        <p>收货地址： {{ delCurrentAdd.province + delCurrentAdd.city + delCurrentAdd.district }} {{ delCurrentAdd.detail }}
        </p>
      </div>
      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="deleteAdd" v-throttle>确 定</el-button>
          <el-button @click="showDeleteAdd = false">取 消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>



<style lang="scss" scoped>
.addressBox {
  padding: 30px;
  border: 1px solid #E5E5E5;
  min-height: 500px;

  .addAddressBtn {
    font-size: 16px;
    color: $mainColor;
    height: 32px;
    line-height: 32px;
    background: #FFFFFF;
    border: 1px solid #FF7800;
    border-radius: 4px;
    padding: 4px 20px;
    cursor: pointer;
  }

  .addressList {
    margin-top: 20px;

    .addressItem {
      &:nth-child(2n) {
        margin-right: 0;
      }

      width: 477px;
      border: 2px solid #DDDDDD;
      border-radius: 4px;
      box-sizing: border-box;
      margin-right: 20px;
      margin-bottom: 20px;
      float: left;

      .listItemInfoBox {
        padding: 20px;

        .isDefault {
          display: flex;
          align-items: center;
          height: 35px;
          justify-content: flex-end;

          span {
            color: #333333;
            font-size: 16px;
            margin-right: 5px;
          }
        }

        .addressInfo {
          .infoItem {
            color: #333333;
            font-size: 16px;
            margin-bottom: 30px;
          }

          .infoItem:last-child {
            margin-bottom: 0;
          }
        }
      }

      .addressChange {
        border-top: #CCCCCC solid 1px;
        height: 45px;
        line-height: 45px;
        position: relative;

        i {
          margin-right: 5px;
        }

        .defaultActive {
          position: absolute;
          right: -1px;
          bottom: -3px;
          width: 46px;
          height: 46px;
          color: $mainColor;
          font-size: 46px;
        }

        span {
          display: block;
          float: left;
          width: 50%;
          color: #666666;
          text-align: center;
          cursor: pointer;
        }

        span:nth-child(2) {
          border-left: 1px solid #CCCCCC;
          color: $mainColor;
          box-sizing: border-box;
        }
      }
    }

    .active {
      border: 2px solid $mainColor;
    }
  }

  :deep(.el-dialog) {
    width: 33% !important;

    .el-dialog__body {
      background: #F8F8F8;
    }

    .el-dialog__header {
      text-align: center;
    }

    .dialog-footer {
      display: flex;
      justify-content: center;
      width: 100%;

      button {
        height: 45px;
        width: 120px;
      }
    }
  }

  .deleteAddInfo {
    width: 70%;
    margin: 0 auto;

    p {
      line-height: 30px;
    }
  }

  :deep(.el-pagination) {
    text-align: right;
  }
}

.sub-main {
  min-height: 400px;
}

.nothing {
  width: 100%;
  text-align: center;
  min-height: 400px;

  p {
    margin-bottom: 20px;
  }

  .el-button {
    background-color: #FF7800;
    color: #FFFFFF;
    font-weight: normal;
    border-radius: 0;
  }
}
</style>
