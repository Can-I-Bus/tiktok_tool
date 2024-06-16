<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'爆文视频'" width="1200" :before-close="handleClose"
            style="border-radius: 8px;">
            <p style="margin-bottom: 10px;">筛选爆文视频数量:
                <span style="color: #409eff;margin-left: 8px">{{ props.videoList.length }}</span>
            </p>
            <vxe-table :data="props.videoList" empty-text="暂无数据" border :scroll-x="{ enabled: true, gt: 20 }"
                :height="330" :row-config="{ isHover: true, useKey: true }" :scroll-y="{ enabled: true }">

                <vxe-column title="视频链接" align="center" width="500">
                    <template #default="{ row }">
                        <a :href="row.video_link" target="_blank">
                            <p style="color: #409eff;text-decoration: underline;cursor: pointer;">{{ row.video_link }}
                            </p>
                        </a>
                    </template>
                </vxe-column>

                <vxe-column title="播放量" sortable field="play_count" width="100" align="center">
                    <template #default="{ row }">
                        <span>{{ parseNum(row.play_count) }}</span>
                    </template>
                </vxe-column>

                <!-- <vxe-column title="点赞" align="center">
                    <template #default="{ row }">
                        <span>{{ parseNum(row.) }}</span>
                    </template>
                </vxe-column> -->

                <vxe-column title="评论" sortable field="comment_count" width="100" align="center">
                    <template #default="{ row }">
                        <span>{{ parseNum(row.comment_count) }}</span>
                    </template>
                </vxe-column>

                <vxe-column title="点赞" sortable field="digg_count" width="100" align="center">
                    <template #default="{ row }">
                        <span>{{ parseNum(row.digg_count) }}</span>
                    </template>
                </vxe-column>

                <vxe-column title="发布时间" sortable field="create_time" align="center">
                    <template #default="{ row }">
                        <span>{{ parseTime(row.create_time) }}</span>
                    </template>
                </vxe-column>

                <vxe-column title="刷新时间" sortable field="refresh_time" align="center">
                    <template #default="{ row }">
                        <span>{{ parseTime(row.refresh_time) }}</span>
                    </template>
                </vxe-column>
            </vxe-table>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, defineProps, defineEmits, getCurrentInstance, watch } from 'vue'
import { parseNum, parseTime } from '@/utils'
const { $api } = getCurrentInstance().proxy
const props = defineProps({
    isShow: Boolean,
    videoList: Array
})

const handleClose = () => {

    emits('handleClose')
}

const emits = defineEmits(['handleClose'])
</script>
<style scoped lang='scss'></style>