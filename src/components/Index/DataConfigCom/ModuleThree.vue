<template>
    <div>
        <div class="config_wrap">
            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <span style="margin-right: 61px;">7天内发布视频(条): </span>
                <el-input placeholder="输入视频条目" v-model="from.video_num" style="width: 120px;"></el-input>
            </div>

            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <el-checkbox @change="from.max_like_num = ''" style="margin-right: 53px" v-model="from.check_like"
                    label="点赞/条视频大于" />
                <el-input :disabled="!from.check_like" placeholder="请输入配置" v-model="from.max_like_num"
                    style="width: 120px;"></el-input>
            </div>

            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <el-checkbox @change="from.max_comment_num = ''" style="margin-right: 53px" v-model="from.check_comment"
                    label="评论/条视频大于" />
                <el-input :disabled="!from.check_comment" placeholder="请输入配置" v-model="from.max_comment_num"
                    style="width: 120px;"></el-input>
            </div>

            <div style="display: flex;justify-content: flex-end;">
                <el-button :disabled="props.categoryId === '' || props.categoryId === undefined"
                    @click="setSevenDayExplosiveConfig" :loading="loading">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, reactive, onMounted, defineExpose, getCurrentInstance, defineProps } from 'vue'
import { removeEmptyValues } from '@/utils'
const { $api } = getCurrentInstance().proxy

const props = defineProps({
    categoryId: {
        type: Number
    }
})

const loading = ref(false)

const from = reactive({
    video_num: '',
    max_like_num: '',
    watch_time: '',
    max_comment_num: '',
    check_comment: false,
    check_like: false
})

const clearFrom = () => {
    from.video_num = ''
    from.max_like_num = ''
    from.watch_time = ''
    from.max_comment_num = ''
    from.check_comment = false
    from.check_like = false
}

const fetchSevenDayExplosiveConfig = async (data = { class_id: props.categoryId }) => {
    try {
        loading.value = true
        const res = await $api({ type: 'fetchSevenDayExplosiveConfig', data })
        if (res.code === 0) {
            from.video_num = res?.data?.videos_in_last_7_days_count ?? ''
            from.max_like_num = res?.data?.min_video_likes ?? ''
            from.max_comment_num = res?.data?.min_video_comment ?? ''
            from.check_comment = from.max_comment_num === 0 ? false : true
            from.check_like = from.max_like_num === 0 ? false : true
        }
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
    }
}

const setSevenDayExplosiveConfig = async () => {
    try {
        loading.value = true
        const data = {
            "class_id": props.categoryId,
            "videos_in_last_7_days_count": Number(from.video_num),
            "min_video_likes": Number(from.max_like_num),
            "min_video_comment": Number(from.max_comment_num),
        }
        const postData = removeEmptyValues(data)
        const res = await $api({ type: 'setSevenDayExplosiveConfig', data: postData })
        if (res.code === 0) [
            ElMessage.success('配置成功')
        ]
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
    }
}

defineExpose({
    clearFrom,
    fetchSevenDayExplosiveConfig
})
</script>
<style scoped lang='scss'>
.config_wrap {
    padding: 10px;
    background-color: rgba(243, 245, 250, 1);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
}
</style>