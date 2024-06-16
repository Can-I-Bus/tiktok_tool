<template>
    <div>
        <el-dialog v-loading="dialogLoading" :model-value="props.isShow" :title="'博主裂变'" width="420"
            :before-close="handleClose" style="border-radius: 8px;">

            <div>
                <p>博主国家</p>
                <el-input class="mb8" v-model="form.code" :rows="5" type="textarea" placeholder="输入国家代码，用空格隔开" />
            </div>
            <div class="mb8" style="display:flex;align-items: center;justify-content: space-between;">
                <el-radio @change="radioChange" label="1" v-model="form.radio">
                    <div style="display: flex;align-items: center;">
                        <p style="margin-right: 70px">选择分类</p>
                        <el-select @change="categoryChange" clearable style=" width: 240px" v-model="form.category"
                            placeholder="请选择分类">
                            <el-option v-for="item in props.categoryList" :label="item.class_name"
                                :value="item.id"></el-option>
                        </el-select>
                    </div>
                </el-radio>
            </div>
            <div class="mb8" style="display:flex;align-items: center;justify-content: space-between;">
                <el-radio @change="radioChange" label="2" v-model="form.radio">
                    <div style="display: flex;align-items: center;">
                        <p style="margin-right: 70px">新建分类</p>
                        <el-input @input="categoryInput" clearable style="width: 240px" v-model="form.new_category"
                            placeholder="请输入分类">
                        </el-input>
                    </div>
                </el-radio>
            </div>
            <div class="mb8" style="display:flex;align-items: center;justify-content: space-between;">
                <p>单博主裂变数量(个)</p>
                <el-input style="width: 240px" placeholder="请输入裂变数量" v-model="form.count"></el-input>
            </div>
            <div style="display: flex;">
                <div style="display:flex;align-items: center;margin-right: 20px">
                    <span style="margin-right: 10px">粉丝裂变</span>
                    <el-checkbox v-model="form.fans"></el-checkbox>
                </div>
                <div style="display:flex;align-items: center">
                    <span style="margin-right: 10px">关注列表</span>
                    <el-checkbox v-model="form.follw"></el-checkbox>
                </div>
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
import { ref, reactive, defineProps, defineEmits, getCurrentInstance, watch } from 'vue'
const { $api } = getCurrentInstance().proxy
const props = defineProps({
    isShow: Boolean,
    uidList: Array,
    categoryList: Array
})

const emits = defineEmits(['handleClose', 'updateBlogStatus', 'closeBlog', 'updateCategory'])

const loading = ref(false)

const dialogLoading = ref(false)

const form = reactive({
    code: '',
    count: '',
    fans: true,
    follw: true,
    category: '',
    new_category: '',
    radio: '1'
})

const handleClose = () => {
    emits('handleClose')
    form.code = ''
    form.fans = true
    form.follw = true
    form.category = ''
    form.count = ''
    loading.value = false
    form.radio = '1'
    form.new_category = ''
}

const categoryChange = (val) => {
    if (val) {
        form.radio = '1'
        form.new_category = ''
    }
}

const radioChange = (val) => {
    if (val === '1') {
        form.new_category = ''
    } else if (val === '2') {
        form.category = ''
    }
}

const categoryInput = () => {
    form.radio = '2'
    form.category = ''
}

const postTask = async (data) => {
    try {
        const res = await $api({ type: 'createSpidertask', data })
        if (res.code === 0) {
            ElMessage.success('创建成功')
            handleClose()
            emits('closeBlog')
        } else {
            ElMessage.error(res?.message ?? '创建失败')
        }
    } catch (error) {
        console.error(error);
    }
}

const handleConfim = async () => {
    try {
        if (form.count === '') {
            return ElMessage.warning('裂变数量不能为空')
        }
        if (!form.follw && !form.fans) {
            return ElMessage.warning('请选择裂变类型')
        }
        if (form.category === '' && form.new_category === '') {
            return ElMessage.warning('请设置裂变分类')
        }
        loading.value = true
        let data = {
            class_id: '',
            task_type: '',
            uids: props.uidList,
            region: form.code.split(' ')[0].length === 0 ? [] : form.code.split(' '),
            spider_first_count: Number(form.count)
        }
        if (form.fans && form.follw) {
            data.task_type = 0
        } else if (form.fans && !form.follw) {
            data.task_type = 1
        } else if (!form.fans && form.follw) {
            data.task_type = 2
        }
        if (form.radio === '2') {
            const categoryData = {
                class_name: form.new_category
            }
            const res = await $api({ type: 'createBlogCategory', data: categoryData })
            if (res.code !== 0) {
                return ElMessage.error(res?.message ?? '新建分类失败，创建裂变任务中止')
            } else {
                const cbId = res?.class?.id
                console.log(res.class.id, '=======')
                data.class_id = cbId
                console.log(data, '====')
                await postTask(data)
                emits('updateCategory')
            }
        } else {
            data.class_id = Number(form.category)
            await postTask(data)
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }
}
</script>

<style lang="scss" scoped>
.mb8 {
    margin-bottom: 20px;
}

.content {
    >div {
        margin-bottom: 20px;

        p:nth-of-type(1) {
            margin-bottom: 8px;
        }
    }
}
</style>