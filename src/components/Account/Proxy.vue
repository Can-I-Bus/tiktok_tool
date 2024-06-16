<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'配置代理'" width="420" :before-close="handleClose"
            style="border-radius: 8px;">

            <div class="item">
                <p class="mb8">代理账号：</p>
                <el-input style="width: 300px" placeholder="请输入代理账号" v-model="form.acc"></el-input>
            </div>
            <div class="item">
                <p class="mb8">代理密码：</p>
                <el-input style="width: 300px" placeholder="请输入代理密码" v-model="form.pwd"></el-input>
            </div>
            <div class="item">
                <p class="mb8">代理地址：</p>
                <el-input style="width: 300px" placeholder="请输入代理密码" v-model="form.addr"></el-input>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="handleClose">
                        取消
                    </el-button>
                    <el-button :loading="loading" type="primary" @click="handleConfim">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits } from 'vue'
const props = defineProps({
    isShow: Boolean,
})

const emits = defineEmits(['handleClose', 'updateProxy'])

const loading = ref(false)

const form = reactive({
    acc: '',
    pwd: '',
    addr: ''
})

const handleClose = () => {
    emits('handleClose')
    form.acc = ''
    form.pwd = ''
    form.addr = ''
    loading.value = false
}

const handleConfim = async () => {
    if (form.acc === '' || form.addr === '' || form.pwd === '') {
        return ElMessage.warning('以上配置不能为空')
    }
    localStorage.setItem('tool_proxy_acc', form.acc)
    localStorage.setItem('tool_proxy_pwd', form.pwd)
    localStorage.setItem('tool_proxy_addr', form.addr)
    handleClose()
    emits('updateProxy')
}

</script>

<style lang="scss" scoped>
.item {
    display: flex;
    align-items: center;
}

.item:first-child {
    margin-bottom: 20px
}

.item:nth-of-type(2) {
    margin-bottom: 20px;
}
</style>