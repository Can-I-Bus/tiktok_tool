<template>
    <div>
        <div class="config_wrap">
            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <span style="margin-right: 120px;">粉丝范围: </span>
                <div style="display: flex;align-items: center;">
                    <el-input placeholder="最小范围" v-model="from.min_fans" style="width: 120px;"></el-input>
                    <span style="margin: 0 10px">-</span>
                    <el-input placeholder="最大范围" v-model="from.max_fans" style="width: 120px;"></el-input>
                </div>
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

            <div style="display: flex;align-items: center;margin-bottom: 20px">
                <span style="margin-right: 26px;">粉丝超范围是否停止监控</span>
                <el-switch v-model="from.is_open_watch" />
            </div>

            <div style="display: flex;justify-content: flex-end;">
                <el-button :disabled="props.categoryId === '' || props.categoryId === undefined"
                    @click="setExplosiveConfig" :loading="loading">保存</el-button>
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

const from = reactive({
    min_fans: '',
    max_fans: '',
    max_like_num: '',
    max_comment_num: '',
    is_open_watch: false,
    check_comment: false,
    check_like: false
})

const loading = ref(false)

const clearFrom = () => {
    from.min_fans = ''
    from.max_fans = ''
    from.max_like_num = ''
    from.max_comment_num = ''
    from.is_open_watch = false
    from.check_comment = false
    from.check_like = false
}

const fetchExplosiveConfig = async (data = { class_id: props.categoryId }) => {
    try {
        loading.value = true
        const res = await $api({ type: 'fetchExplosiveConfig', data })
        if (res.code === 0) {
            res?.data?.is_auto_stop === 1 ? from.is_open_watch = true : from.is_open_watch = false
            from.max_fans = res?.data?.max_follower_count ?? 0
            from.min_fans = res?.data?.min_follower_count ?? 0
            from.max_like_num = res?.data?.min_video_likes ?? 0
            from.max_comment_num = res?.data?.min_video_comment ?? 0
            res?.data?.min_video_comment === 0 ? from.check_comment = false : from.check_comment = true
            res?.data?.min_video_likes === 0 ? from.check_like = false : from.check_like = true
        }
        loading.value = false
    } catch (error) {
        loading.value = false
        console.error(error);
    }
}

const setExplosiveConfig = async () => {
    try {
        loading.value = true
        const data = {
            "class_id": props.categoryId,
            "min_follower_count": Number(from.min_fans),
            "max_follower_count": Number(from.max_fans),
            "min_video_likes": from.check_like ? Number(from.max_like_num) : '',
            "min_video_comment": from.check_comment ? Number(from.max_comment_num) : '',
            "is_auto_stop": from.is_open_watch === true ? 1 : 0
        }
        const postData = removeEmptyValues(data)
        const res = await $api({ type: 'setExplosiveConfig', data: postData })
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
    fetchExplosiveConfig,
    clearFrom
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