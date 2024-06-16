<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'裂变数据'" width="1200" :before-close="handleClose"
            style="border-radius: 8px;">
            <div style="margin-bottom: 10px">
                <el-button @click="handleFission">选中博主并开始裂变</el-button>
                <span style="font-size: 14px;margin-left: 20px;"> {{ (isFilter ? '筛选数量' : '裂变数量') + ': ' + (isFilter ?
            filterData.length : props.tableData.length) }}</span>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px">
                <div style="display: flex;align-items: center;margin-right: 100px">
                    <span style="white-space: nowrap;margin-right: 10px;">筛选国家: </span>
                    <el-input v-model="queryData.region" placeholder="请输入筛选国家码，用空格隔开" style="width:248px"></el-input>
                </div>
                <div style="display: flex;align-items: center;margin-right:100px">
                    <span style="margin-right: 10px;">粉丝范围: </span>
                    <div style="display: flex;align-items: center;">
                        <el-input v-model="queryData.follower_count_min_num" style="width: 120px;"></el-input>
                        <span>-</span>
                        <el-input v-model="queryData.follower_count_max_num" style="width: 120px;"></el-input>
                    </div>
                </div>
                <div style="display: flex;align-items: center;">
                    <span style="margin-right: 10px;">视频范围: </span>
                    <div style="display: flex;align-items: center;">
                        <el-input v-model="queryData.aweme_count_min_num" style="width: 120px;"></el-input>
                        <span>-</span>
                        <el-input v-model="queryData.aweme_count_max_num" style="width: 120px;"></el-input>
                    </div>
                </div>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 10px;">
                <div style="display: flex;align-items: center;margin-right: 100px">
                    <span style="margin-right: 10px;">关注范围: </span>
                    <div style="display: flex;align-items: center;">
                        <el-input v-model="queryData.following_count_min_num" style="width: 120px"></el-input>
                        <span>-</span>
                        <el-input v-model="queryData.following_count_max_num" style="width: 120px"></el-input>
                    </div>
                </div>
                <div style="display: flex;align-items: center;margin-right: 286px;">
                    <span style="margin-right: 10px;">获赞范围: </span>
                    <div style="display: flex;align-items: center;">
                        <el-input v-model="queryData.total_favorited_min_num" style="width: 120px;"></el-input>
                        <span>-</span>
                        <el-input v-model="queryData.total_favorited_max_num" style="width: 120px;"></el-input>
                    </div>
                </div>
                <el-button @click="handleSearch">搜索</el-button>
                <el-button @click="handleReset">重置</el-button>

            </div>
            <vxe-table @header-cell-click="headerCellClickEvent" :sort-config="{ showIcon: false }" ref="tableRef"
                @checkbox-all="selectAllChange" @checkbox-change="selectChange" empty-text="暂无数据，将链接txt文件拖入即可获取数据"
                border show-overflow width="980" height="600" :row-config="{ isHover: true, useKey: true }"
                :data="isFilter ? filterData : props.tableData" :scroll-y="{ enabled: true, gt: 80 }">
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
                        <el-tooltip :content="row.nickname" placement="top" popper-class="atooltip">
                            <span> {{ row?.nickname ? row.nickname : '暂无昵称' }} </span>
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
                <vxe-column field="region" title="国家" sortable align="center">
                    <template #header="{ column }">
                        <span>{{ column.title }}</span>
                        <span class="custom-sort" :class="{ 'is-order': column.order }">
                            <i :class="[column.order ? `vxe-icon-sort-alpha-${column.order}` : 'vxe-icon-sort']"></i>
                        </span>
                    </template>
                    <template #default="{ row }">
                        <span>{{ row?.region ? row.region : '暂无国家' }}</span>
                    </template>
                </vxe-column>
                <vxe-column field="follower_count" sortable title="粉丝" align="center">
                    <template #header="{ column }">
                        <span>{{ column.title }}</span>
                        <span class="custom-sort" :class="{ 'is-order': column.order }">
                            <i :class="[column.order ? `vxe-icon-sort-numeric-${column.order}` : 'vxe-icon-sort']"></i>
                        </span>
                    </template>

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
        <Fission :isShow="showFission" @updateCategory="updateCategory" @handleClose="showFission = false"
            @closeBlog="handleCloseBlog" :uidList="selectedUidList" :categoryList="props.categoryList" />
        <Token :isShow="showToken" @handleClose="showToken = false" />
    </div>
</template>

<script setup>
import Token from './Token.vue'
import Fission from './Fission.vue'
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits, computed } from 'vue'
import { parseNum, removeEmptyValues } from '@/utils';
const props = defineProps({
    isShow: Boolean,
    tableData: Array,
    categoryList: Array
})

const emits = defineEmits(['handleClose', 'closeAfterCreateTaskSuccess'])

const showFission = ref(false)

const showToken = ref(false)

const isFilter = ref(false)

const tableRef = ref(null)

const categoryList = ref()

const selectArr = ref([])   //选中的博主

const filterData = ref([])

const queryData = reactive({
    region: '',
    follower_count_min_num: '',
    follower_count_max_num: '',
    aweme_count_min_num: '',
    aweme_count_max_num: '',
    following_count_min_num: '',
    following_count_max_num: '',
    total_favorited_min_num: '',
    total_favorited_max_num: ''
})

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

const handleSearch = () => {
    let filterQueryData = removeEmptyValues(queryData)

    const res = props.tableData.filter(item => {
        let isValid = true;

        // 国家筛选，支持多个
        const countries = filterQueryData?.region?.split(' ');
        if (countries?.length > 0) {
            isValid &= countries.includes(item.region);
        }

        // 遍历筛选对象的每一个字段
        Object.keys(filterQueryData).forEach(key => {

            const filterValue = Number(filterQueryData[key]);
            if (!isNaN(filterValue)) {
                if (key.endsWith('_min_num')) {
                    const attrKey = key.replace('_min_num', '');
                    isValid &= item[attrKey] >= filterValue;
                } else if (key.endsWith('_max_num')) {
                    const attrKey = key.replace('_max_num', '');
                    isValid &= item[attrKey] <= filterValue;
                }
            }
        });

        return isValid;
    });
    filterData.value = []
    filterData.value.push(...res)
    isFilter.value = true
}

//获取博主分类列表
const getBlogCategoryList = async () => {
    try {
        loading.value = true
        const res = await $api({ type: 'fetchBlogCategoryList', data: {} })
        if (res.code === 0) {
            categoryList.value = res?.class_list ?? []
        }
    } catch (error) {
        console.error(error);
    } finally {
        loading.value = false
    }
}

const handleReset = () => {
    queryData.region = ''
    queryData.follower_count_min_num = ''
    queryData.follower_count_max_num = ''
    queryData.aweme_count_min_num = ''
    queryData.aweme_count_max_num = ''
    queryData.following_count_min_num = ''
    queryData.following_count_max_num = ''
    queryData.total_favorited_min_num = ''
    queryData.total_favorited_max_num = ''
    filterData.value = []
    isFilter.value = false
}

const headerCellClickEvent = ({ column, triggerResizable, triggerSort, triggerFilter }) => {
    const $table = tableRef.value
    if ($table) {
        // 如果触发了列的其他功能按钮
        if (column.sortable && !(triggerResizable || triggerSort || triggerFilter)) {
            console.log(column.order, '=====')
            if (column.order === 'desc') {
                $table.clearSort()
            } else if (column.order === 'asc') {
                $table.sort(column.field, 'desc')
            } else {
                $table.sort(column.field, 'asc')
            }
        }
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

.my-sort .custom-sort {
    padding: 0 4px;
}

.my-sort .custom-sort.is-order {
    color: #409eff;
}
</style>