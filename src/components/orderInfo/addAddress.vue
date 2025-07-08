<script setup>
import { sendReq } from '@/config/mixin'
import api from '@/api'
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores'

defineOptions({
  name: 'addAddress'
})

const userStore = useUserStore()
const options = ref([])
const areaData = ref('')
const newAddress = computed(() => userStore.getNewAddress)
const emit = defineEmits(['hideAddDialog', 'cancelAdd'])

onMounted(() => {
  if (!newAddress.value) {
    userStore.setNewAddress('SET_NEWADDRESS') // 新增修改收货地址
    userStore.setAreaCode('SET_AREACODE') // 新增修改收货地址
  }
  getArea()
})

const getArea = () => {
  let params = {
    url: api.getArea,
    method: 'GET'
  }
  sendReq(params, (res) => {
    if (res.status === 200) {
      options.value = res.data
    }
  })
}

const addressChange = (arr) => {
  areaData.value = `${arr[0]}-${arr[1]}-${arr[2]}`
}

const newAddressData = () => {
  if (newAddress.value.receiveAdress !== '') {
    if (newAddress.value.address === '') {
      ElMessage.error('请填写详细地址!')
    } else if (newAddress.value.receiveName === '') {
      ElMessage.error('请填写收件人姓名!')
    } else if (newAddress.value.receivePhone === '') {
      ElMessage.error('请填写手机号码!')
    } else {
      let reg = /^1[13456789]\d{9}$/
      if (!reg.test(newAddress.value.receivePhone)) {
        ElMessage.error('手机号格式错误')
        return
      }
      if (areaData.value !== '') {
        newAddress.value.receiveAdress = areaData.value
      }
      emit('hideAddDialog')
    }
  } else {
    if (areaData.value === '') {
      ElMessage.error('请选择地区!')
    } else if (newAddress.value.address === '') {
      ElMessage.error('请填写详细地址!')
    } else if (newAddress.value.receiveName === '') {
      ElMessage.error('请填写收件人姓名!')
    } else if (newAddress.value.receivePhone === '') {
      ElMessage.error('请填写手机号码!')
    } else {
      let reg = /^1[13456789]\d{9}$/
      if (!reg.test(newAddress.value.receivePhone)) {
        ElMessage.error('手机号格式错误')
        return
      }
      newAddress.value.receiveAdress = areaData.value
      emit('hideAddDialog')
    }
  }
}

const cancelAdd = () => {
  emit('cancelAdd')
}
</script>
<template>
  <div class="editAddressBox">
    <div class="editArea itemStyle">
      <span><i>*</i>所在地区：</span>
      <div class="rightForm">
        <el-cascader size="large" :options="options" :props="{ value: 'label', label: 'label' }"
          v-model="userStore.areaCode" @change="addressChange">
        </el-cascader>
      </div>
    </div>
    <div class="itemStyle">
      <span><i>*</i>详细地址：</span>
      <div class="rightForm">
        <el-input type="textarea" :rows="2" placeholder="请输入地址" resize="none" v-model="newAddress.address">
        </el-input>
      </div>
    </div>
    <div class="itemStyle">
      <span><i>*</i>收货人姓名：</span>
      <div class="rightForm">
        <el-input v-model="newAddress.receiveName" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="itemStyle">
      <span><i>*</i>手机号码：</span>
      <div class="rightForm">
        <el-input v-model="newAddress.receivePhone" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="itemStyle">
      <span></span>
      <div class="rightForm">
        <el-checkbox v-model="newAddress.defult">设置为默认收货地址</el-checkbox>
      </div>
    </div>
    <div class="dialogFooter">
      <el-button type="primary" @click="newAddressData">确 定</el-button>
      <el-button @click="cancelAdd">取 消</el-button>
    </div>
  </div>
</template>



<style lang="scss" scoped>
.editAddressBox {
  padding: 0 50px;

  .itemStyle {
    display: flex;
    margin-bottom: 20px;

    span {
      width: 100px;
      margin-right: 20px;
      text-align: right;
      padding-top: 5px;
    }

    i {
      color: red;
      margin-right: 3px;
    }

    .rightForm {
      flex: 1;

      :deep(.el-input__wrapper) {
        padding: 0;
      }

      :deep(.el-textarea__inner) {
        box-shadow: none;
      }

      :deep(.el-cascader) {
        width: 100%;
      }

      :deep(.el-checkbox__label) {
        font-size: 12px;
        color: #666666;
      }
    }
  }

  .dialogFooter {
    display: flex;
    justify-content: center;
    width: 100%;

    button {
      width: 120px;
    }
  }
}
</style>
