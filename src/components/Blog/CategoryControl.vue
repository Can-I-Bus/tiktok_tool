<template>
    <div>
        <el-dialog width="500px" style="border-radius: 8px;" :title="'分类管理'" :model-value="props.isShow"
            :append-to-body="true" @close="handleClose">
            <template #header>
                <div class="top">
                    <p class="fz-16">分类管理</p>
                    <el-button class="btn" @click="handleshowCategoryEdit('新增分类')">{{ '新增分类'
                        }}</el-button>
                </div>
            </template>

            <vxe-table :loading="loading" :height="'400'" ref="tableRef" empty-text="暂无分类，请新增" border show-overflow
                :scroll-x="{ enabled: true, gt: 20 }" :row-config="{ isHover: true }" :data="props.categoryList"
                :scroll-y="{ enabled: true }">
                <vxe-column type="seq" title="分类名称" :fixed="'left'" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.class_name ? row.class_name : '暂无名称' }}</span>
                    </template>
                </vxe-column>
                <vxe-column type="seq" title="分类ID" :fixed="'left'" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.id ? row.id : '暂无ID' }}</span>
                    </template>
                </vxe-column>
                <vxe-column type="seq" title="操作" :fixed="'left'" align="center">
                    <template #default="{ row }">
                        <div class="pointer">
                            <span class="mr10" @click="handleshowCategoryEdit('编辑名称', row)
            ">编辑</span>
                            <span @click="handleDel(row.id)" class="color_ff5d1b">删除</span>
                        </div>
                    </template>
                </vxe-column>
            </vxe-table>


        </el-dialog>

        <CategoryEdit :isShow="showCategoryEdit" :title="title" :name="name" :id="categoryId"
            @handleClose="closeCategoryEdit" @updateAndClose="updateAndClose" />
    </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import { ref, defineProps, defineEmits, getCurrentInstance, watch } from 'vue'
import CategoryEdit from './CategoryEdit.vue'

const props = defineProps({
    isShow: Boolean,
    categoryList: Array
})

const { $api } = getCurrentInstance().proxy

const emits = defineEmits(['handleClose', 'getCategoryList'])

const showCategoryEdit = ref(false)

const loading = ref(false)

const title = ref('')

const name = ref('')

const categoryId = ref(0)

const handleClose = () => {
    loading.value = false
    categoryId.value = 0
    emits('handleClose')
}

const handleshowCategoryEdit = (str, row = null) => {
    if (row !== null) {
        name.value = row.class_name
        categoryId.value = row.id
    }
    title.value = str
    showCategoryEdit.value = true
}

const closeCategoryEdit = () => {
    showCategoryEdit.value = false
    title.value = ''
    name.value = ''
}

const updateAndClose = async () => {
    closeCategoryEdit()
    emits('getCategoryList')
}

const handleDel = (ID) => {
    ElMessageBox.confirm(
        '此操作不可逆，确认删除此分类？',
        '提示',
        {
            closeOnClickModal: false,//点击遮罩关闭弹窗
            distinguishCancelAndClose: true,//区分取消与关闭
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(() => {
        const data = {
            class_id: ID
        }
        delCategory(data)
    }).catch(async (action) => {
        if (action === 'cancel') {
            console.log('取消')
        } else {
            return
        }
    })
}

const delCategory = async (data) => {
    try {
        const result = await $api({ type: 'deleteBlogCategory', data })
        if (result?.code === 0) {
            ElMessage.success('删除成功')
            emits('getCategoryList')
        } else {
            ElMessage({
                type: 'error',
                message: result?.message ?? '删除失败'
            })
        }
    } catch (error) {
        console.error(error);
        ElMessage({
            type: 'error',
            message: error?.message ?? '删除失败'
        })
    }
}

</script>

<style lang="scss" scoped>
.top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mr10 {
    margin-right: 10px;
}

.pointer {
    cursor: pointer;
}
</style>