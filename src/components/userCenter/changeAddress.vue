<script setup>
import { ref, computed } from 'vue'
import { regionData, CodeToText } from 'element-china-area-data'
import { useUserStore } from '@/store'
import { ElMessage } from 'element-plus'
//组件名称
defineOptions({
  name: 'AddAddress'
})
//数据
const options = regionData
const selectedOptions = ref([])
// const addAddressDialog = ref(false)
// const newAddress = ref({
//   isDefault: false,
//   name: '',
//   area: '',
//   address: '',
//   phone: '',
//   isShow: false
// })
const userstore = useUserStore()
//计算属性
const { newAddress, areaCode } = computed({
  newAddress() {
    return userstore.newAddress
  },
  areaCode() {
    return userstore.areaCode
  }
})
//方法
const emit = defineEmits(['hideAddDialog', 'cancelAdd'])
const addressChange = (arr) => {
  // console.log(arr)
  // console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]])
  userstore.newAddress.area = `${CodeToText[arr[0]]}-${CodeToText[arr[1]]}-${CodeToText[arr[2]]}`
  userstore.setNewAddress(arr)
}
const newAddressData = () => {
  if (newAddress.value.area === '') {
    ElMessage.error('请选择地区!');
    return;
  }
  if (newAddress.value.address === '') {
    ElMessage.error('请填写详细地址!');
    return;
  }
  if (newAddress.value.phone === '') {
    ElMessage.error('请填写手机号码!');
    return;
  }
  emit('hideAddDialog', newAddress.value)
  newAddress.value = {
    isDefault: false,
    name: '',
    area: '',
    address: '',
    phone: ''
  }
  selectedOptions.value = []
}
//取消
// const cancelAdd () => {
emit('cancelAdd')
// }

// export default {
//     ...mapMutations({
//       seNewAddress: 'SET_NEWADDRESS' // 新增修改收货地址
//     }),
//}
</script>

<template>
  <div class="editAddressBox">
    <div class="editArea itemStyle">
      <span><i>*</i>所在地区：</span>
      <div class="rightForm">
        <el-cascader size="large" :options="options" v-model="areaCode" @change="addressChange">
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
        <el-input v-model="newAddress.name" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="itemStyle">
      <span><i>*</i>手机号码：</span>
      <div class="rightForm">
        <el-input v-model="newAddress.phone" placeholder="请输入内容"></el-input>
      </div>
    </div>
    <div class="itemStyle">
      <span></span>
      <div class="rightForm">
        <el-checkbox v-model="newAddress.isDefault">设置为默认收货地址</el-checkbox>
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
  padding: 0 100px;

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
      height: 25px;
      width: 120px;
    }
  }
}
</style>
