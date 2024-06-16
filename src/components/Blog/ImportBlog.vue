<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'博主信息'" width="1200" :before-close="handleClose"
            style="border-radius: 8px;">
            <div style="margin-bottom: 10px">
                <el-button @click="handleFission">选中博主并开始裂变</el-button>
                <span style="font-size: 14px;margin-left: 20px;">博主数量: {{ props.tableData.length }}</span>
            </div>
            <vxe-table ref="tableRef" @checkbox-all="selectAllChange" @checkbox-change="selectChange"
                empty-text="暂无数据，将链接txt文件拖入即可获取数据" border show-overflow :scroll-x="{ enabled: true, gt: 20 }"
                width="980" height="600" :row-config="{ isHover: true }" :data="props.tableData"
                :scroll-y="{ enabled: true }">
                <vxe-column type="checkbox" width="50"></vxe-column>
                <vxe-column type="seq" title="头像" width="150" align="center">
                    <template #default="{ row }">
                        <a target="_blank" :href="`https://www.tiktok.com/@${row?.unique_id}`">
                            <el-image style="width: 40px; height: 40px; border-radius: 50%"
                                :src="row.avatar_url"></el-image>
                        </a>
                    </template>
                </vxe-column>
                <vxe-column type="seq" title="昵称" width="150" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="row?.nickname" placement="top" popper-class="atooltip">
                            <span>{{ row?.nickname ? row.nickname : '暂无昵称' }}</span>
                        </el-tooltip>
                    </template>
                </vxe-column>
                <vxe-column type="seq" title="签名" width="150" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="row?.signature" placement="top" popper-class="atooltip">
                            <span>{{ row?.signature ? row.signature : '暂无签名' }}</span>
                        </el-tooltip>
                    </template>
                </vxe-column>
                <vxe-column field="name" title="unique_id" align="center">
                    <template #default="{ row }">
                        <el-tooltip :content="row?.unique_id" placement="top" popper-class="atooltip">
                            <span>{{ row?.unique_id ? row.unique_id : '暂无' }}</span>
                        </el-tooltip>
                    </template>
                </vxe-column>
                <vxe-column field="name" title="国家" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.region ? row.region : '暂无国家' }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="role" title="粉丝" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.follower_count ? parseNum(row.follower_count) : 0 }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="sex" title="关注" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.following_count ? parseNum(row.following_count) : 0 }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="sex" title="作品数量" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.aweme_count ? parseNum(row.aweme_count) : 0 }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="sex" title="获赞数量" align="center">
                    <template #default="{ row }">
                        <span>{{ row?.total_favorited ? parseNum(row.total_favorited) : 0 }}</span>
                    </template>
                </vxe-column>
            </vxe-table>

        </el-dialog>
        <Fission :category-list="props.categoryList" :isShow="showFission" @handleClose="showFission = false"
            @closeBlog="handleCloseBlog" :uidList="selectedUidList" @updateCategory="updateCategory" />
        <Token :isShow="showToken" @handleClose="showToken = false" />
    </div>
</template>

<script setup>
import Token from './Token.vue'
import Fission from './Fission.vue'
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits, computed } from 'vue'
import { parseNum } from '@/utils';
const props = defineProps({
    isShow: Boolean,
    tableData: Array,
    categoryList: Array,
})

const emits = defineEmits(['handleClose', 'closeAfterCreateTaskSuccess', 'updateCategory'])

const showFission = ref(false)

const showToken = ref(false)

const tableRef = ref(null)

const selectArr = ref([])   //选中的博主

const selectedUidList = computed(() => {
    return selectArr.value.reduce((acc, curr) => {
        acc.push(curr.uid)
        return acc
    }, [])
})

const updateCategory = () => {
    emits('updateCategory')
}

const handleFission = () => {
    if (selectArr.value.length === 0) {
        return ElMessage.warning('请选选择博主')
    }
    showFission.value = true
}

const selectAllChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        console.log(checked ? '所有勾选事件' : '所有取消事件', records)
    }
}

const selectChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectArr.value = records
        console.log(checked ? '勾选事件' : '取消事件', records)
    }
}

const handleCloseBlog = () => {
    showFission.value = false
    // handleClose()
    emits('closeAfterCreateTaskSuccess')
}

const handleClose = () => {
    emits('handleClose')
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