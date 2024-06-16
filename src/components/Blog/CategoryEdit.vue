<template>
    <div>
        <el-dialog width="320px" style="border-radius: 8px;" :title="props.title" :model-value="props.isShow"
            :append-to-body="true" @close="handleClose">
            <el-form label-width="110px" label-position="left">
                <el-form-item :label="'分类名称'" prop="name">
                    <el-input v-model="name"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button class="btn_form_close" @click="handleClose">取消</el-button>
                    <el-button class="h30" type="primary" @click="handleConfrim()">确认</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, defineProps, getCurrentInstance, defineEmits, watch } from 'vue'

const props = defineProps({
    isShow: Boolean,
    title: String,
    label: String,
    name: String,
    id: Number
})

const { $t, $api } = getCurrentInstance().proxy

const emits = defineEmits(['handleClose', 'updateAndClose'])

const name = ref('')

const handleClose = () => {
    name.value = ''
    emits('handleClose')
}

const handleConfrim = () => {
    if (props.title === '新增分类') {
        addCategory()
        handleClose()
    } else {
        editAccCategory()
    }
}

const editAccCategory = async () => {
    if (props.name !== '' && props.name === name.value) {
        return ElMessage.warning('修改的名称不能与之前相同')
    }
    try {
        const data = {
            class_name: name.value,
            class_id: props.id
        }
        const result = await $api({ type: 'updateBlogCategory', data })
        if (result?.code === 0) {
            ElMessage({
                type: 'success',
                message: '修改成功'
            })
            name.value = ''
            emits('updateAndClose')
        } else {
            ElMessage({
                type: 'error',
                message: result?.message ?? '修改失败'
            })
        }
    } catch (error) {
        console.error(error);
        ElMessage({
            type: 'error',
            message: error?.message ?? '修改失败'
        })
    }
}

const addCategory = async () => {
    try {
        const data = {
            class_name: name.value
        }
        const result = await $api({ type: 'createBlogCategory', data })
        if (result?.code === 0) {
            ElMessage({
                type: 'success',
                message: '添加分类成功'
            })
            name.value = ''
            emits('updateAndClose')
        } else {
            ElMessage({
                type: 'error',
                message: result?.message ?? '添加分类失败'
            })
        }
    } catch (error) {
        console.error(error);
        ElMessage({
            type: 'error',
            message: error?.message ?? '添加分类失败'
        })
    }
}

watch(() => props.isShow, (val) => {
    if (val) {
        if (props.name !== '') {
            name.value = props.name
        }
    }
})
</script>

<style lang="scss" scoped></style>