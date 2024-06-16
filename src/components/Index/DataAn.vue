<template>
    <div>
        <el-dialog :model-value="props.isShow" :title="'数据分析'" width="90%" :before-close="handleClose"
            style="border-radius: 8px;height: 78%;">
            <div v-loading="dialogLoading" :style="{ height: '70vh', overflowY: dialogLoading ? 'hidden' : 'auto' }">
                <div class="item">
                    <p class="title mb30 main_title">数据概述</p>
                    <div class="data_content">
                        <div>
                            <p>{{ dataView.total_follower_count }}</p>
                            <p>总粉丝量</p>
                        </div>
                        <div>
                            <p>{{ dataView.total_aweme_count }}</p>
                            <p>总视频量</p>
                        </div>
                        <div>
                            <p>{{ dataView.total_total_favorited }}</p>
                            <p>总点赞量</p>
                        </div>
                        <div>
                            <p>{{ dataView.total_following_count }}</p>
                            <p>总关注量</p>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="flex_title mb30">
                        <div>
                            <p class="main_title">视频概述</p>
                        </div>
                    </div>
                    <div class="data_content">
                        <div>
                            <p>{{ parseNum(videoView.total_videos) }}</p>
                            <p>发布视频</p>
                        </div>
                        <div>
                            <p>{{ parseNum(videoView.average_digg_count) }}</p>
                            <p>平均点赞数</p>
                            <div>最高点赞数: {{ parseNum(videoView.max_digg_count) }}</div>
                        </div>
                        <div>
                            <p>{{ convertMillisecondsToMMSS(videoView.average_duration) }}</p>
                            <p>视频平均时长</p>
                            <div>最大时长: {{ convertMillisecondsToMMSS(videoView.max_duration) }}</div>
                        </div>
                        <div>
                            <p>{{ parseNum(videoView.average_play_count) }}</p>
                            <p>平均播放量</p>
                            <div>最高播放量: {{ parseNum(videoView.max_play_count) }}</div>
                        </div>
                        <div>
                            <p>{{ parseNum(videoView.average_comment_count) }}</p>
                            <p>平均评论量</p>
                            <div>最高评论量: {{ parseNum(videoView.max_comment_count) }}</div>
                        </div>
                    </div>
                </div>

                <div class="item">
                    <div class="flex_title">
                        <div style="display: flex">
                            <p class="main_title">主要数据</p>
                            <div v-show="isCheckDetailDate" @click="() => {
            isCheckDetailDate = !isCheckDetailDate; charDateDate = { xData: [], yData: [] }
        }" style="z-index: 999;cursor: pointer;position:relative;top: 38px;left:-90px;display: flex;align-items: center">
                                <span>返回数据总览</span>
                                <el-icon :size="24">
                                    <Back />
                                </el-icon>
                            </div>
                            <div v-show="isAnVideo" @click="handleVideoBack"
                                style="z-index: 999;cursor: pointer;position:relative;top: 38px;left:-90px;display: flex;align-items: center">
                                <span>{{ isCheckVideoDetailDate ? '返回视频数据' : '返回账号数据' }}</span>
                                <el-icon :size="24">
                                    <Back />
                                </el-icon>
                            </div>
                        </div>
                        <div>
                            <div>
                                <el-button @click="handleChange(0)"
                                    :class="active === 0 ? 'active' : ''">近七天</el-button>
                                <el-button @click="handleChange(1)"
                                    :class="active === 1 ? 'active' : ''">近十五天</el-button>
                                <el-button @click="handleChange(2)"
                                    :class="active === 2 ? 'active' : ''">近三十天</el-button>
                            </div>
                        </div>
                    </div>

                    <div style="width: 100%">
                        <LineChart v-if="!isAnVideo" :data="isCheckDetailDate ? charDateDate : chartData"
                            style="width: 100%" @xAxisClick="handleXAxisClick" :chartKey="'mainChart'"
                            :selectedState="legendSelectedStates.mainChart"
                            @legendChange="handleLegendChange('mainChart', $event)" />
                        <LineChart v-else :data="isCheckVideoDetailDate ? videoDateDate : videoChartData"
                            style="width: 100%" @xAxisClick="handleVideoXAxisClick" :chartKey="'videoChart'"
                            :selectedState="legendSelectedStates.videoChart"
                            @legendChange="handleLegendChange('videoChart', $event)" />
                    </div>
                </div>

                <div v-show="props.selectedUids.length === 1" class="item" style="height: 400px;">
                    <div class="flex_title">
                        <p class="main_title">视频列表</p>
                        <el-button @click="handleAnVideo">分析选中视频</el-button>
                    </div>

                    <vxe-table @header-cell-click="headerCellClickEvent" style="margin-bottom: 10px" ref="tableRef"
                        @checkbox-all="selectAllChange" @checkbox-change="selectChange" empty-text="暂无数据" border
                        :scroll-x="{ enabled: true, gt: 20 }" :height="330"
                        :row-config="{ isHover: true, useKey: true }" :data="videoList" :scroll-y="{ enabled: true }">
                        <vxe-column :fixed="'left'" type="checkbox" width="50"></vxe-column>

                        <vxe-column type="seq" title="视频文案" width="250" align="center">
                            <template #default="{ row }">
                                <el-tooltip :content="row?.desc ?? '暂无文案'" placement="top">
                                    <a :href="`https://www.tiktok.com/@${props.selectedUuniqueIds[0]}/video/${row.aweme_id}`"
                                        target="_blank">
                                        <span style="color: #409eff;text-decoration: underline;cursor: pointer;">
                                            {{ row?.desc?.length > 20 ? row?.desc?.substring(0, 18) + '...' : '暂无文案' }}
                                        </span>
                                    </a>
                                </el-tooltip>
                            </template>
                        </vxe-column>

                        <vxe-column field="create_time" sortable title="发布时间" width="200" align="center">
                            <template #default="{ row }">
                                <span>{{ parseTime(row?.create_time) ?? 0 }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column field="play_count" sortable title="播放量" align="center">
                            <template #default="{ row }">
                                <span>{{ parseNum(row?.play_count) ?? 0 }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column sortable field="digg_count" title="点赞量" align="center">
                            <template #default="{ row }">
                                <span>{{ parseNum(row?.digg_count) ?? 0 }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column field="comment_count" sortable title="评论量" align="center">
                            <template #default="{ row }">
                                <span>{{ parseNum(row?.comment_count) ?? 0 }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column field="forward_count" sortable title="转发量" align="center">
                            <template #default="{ row }">
                                <span>{{ parseNum(row?.forward_count) ?? 0 }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column title="收藏量" align="center">
                            <template #default="{ row }">
                                <span>{{ parseNum(row?.collect_count) ?? 0 }}</span>
                            </template>
                        </vxe-column>

                        <vxe-column title="下载量" align="center">
                            <template #default="{ row }">
                                <span>{{ parseNum(row?.download_count) ?? 0 }}</span>
                            </template>
                        </vxe-column>
                    </vxe-table>
                </div>

                <div class="item">
                    <div class="flex_title">
                        <div>
                            <p class="main_title">账号粉丝结构</p>
                        </div>
                    </div>

                    <div>
                        <BarChart v-if="fansChartData.xData.length > 0 && fansChartData.yData.length > 0" :id="'fans'"
                            :data="fansChartData" />
                        <el-empty v-else description="暂无数据" />
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus';
import { ref, computed, defineProps, defineEmits, getCurrentInstance, watch } from 'vue'
import LineChart from '../Echarts/LineChart.vue';
import BarChart from '../Echarts/BarChart.vue';
import { convertMillisecondsToMMSS, formatTimestampToLocalTime, getCurrentAndPreviousTimestamps, getPastTimestamps, convertToUnixTimestamp, parseNum, parseTime } from '@/utils'
const { $api } = getCurrentInstance().proxy
const props = defineProps({
    isShow: Boolean,
    selectedUids: Array,
    selectedUuniqueIds: Array
})

const emits = defineEmits(['handleClose'])

const tableRef = ref(null)

//是否点击了具体的时间轴
const isCheckDetailDate = ref(false)

//是否点击了视频具体的时间轴
const isCheckVideoDetailDate = ref(false)

const isAnVideo = ref(false)

const videoList = ref([])

const active = ref(0)

//数据概述
const dataView = ref({
    total_aweme_count: 0,
    total_follower_count: 0,
    total_following_count: 0,
    total_total_favorited: 0,
})

//视频概述
const videoView = ref({
    "average_comment_count": 0,
    "average_digg_count": 0,
    "average_duration": 0,
    "average_play_count": 0,
    "max_comment_count": 0,
    "max_digg_count": 0,
    "max_duration": 0,
    "max_play_count": 0,
    "total_videos": 0
})

const nameMap = ref({
    'collect_count_diffs': { name: '收藏量', sort: 4 },
    'comment_count_diffs': { name: '评论量', sort: 3 },
    'digg_count_diffs': { name: '点赞量', sort: 2 },
    'download_count_diffs': { name: '下载量', sort: 7 },
    'follower_diffs': { name: '粉丝增量', sort: 9 },
    'forward_count_diffs': { name: '转发量', sort: 5 },
    'play_count_diffs': { name: '播放量', sort: 1 },
    'share_count_diffs': { name: '分享量', sort: 6 },
    'total_followers': { name: '粉丝总量', sort: 8 }
})

//折线图处理后的源数据，用于找当天的数据
const originChartData = ref({
    xData: [],
    yData: []
})

//折线图总数据
const chartData = ref({ xData: [], yData: [] });

//折线图天数据
const charDateDate = ref({ xData: [], yData: [] })

//粉丝数据
const fansChartData = ref({ xData: [], yData: [] })

//视频源数据
const videoOriginData = ref({ xData: [], yData: [] })

//视频分析总数据
const videoChartData = ref({ xData: [], yData: [] })

//视频分析天数据
const videoDateDate = ref({ xData: [], yData: [] })

const selectedVideos = ref([])

const selectedAwemeList = computed(() => {
    return selectedVideos.value.reduce((acc, curr) => {
        acc.push(curr.aweme_id)
        return acc
    }, [])
})

//图例选中状态管理
const legendSelectedStates = ref({
    mainChart: {},
    videoChart: {}
});

const handleChange = (value) => {
    active.value = value
    const data = { uids: props.selectedUids }
    const videoData = { aweme_ids: selectedAwemeList.value }
    //如果是在查看具体某一天数据的情况下
    if (isCheckDetailDate.value) {
        isCheckDetailDate.value = false
        charDateDate.value = { xData: [], yData: [] }
        chartData.value = { yData: [], xData: [] }
        originChartData.value = { yData: [], xData: [] }
        getChartData(data)
    } else if (!isCheckDetailDate.value && !isAnVideo.value) {
        //如果没有查看具体天数的数据也没有查看分析视频的数据的话
        chartData.value = { yData: [], xData: [] }
        originChartData.value = { yData: [], xData: [] }
        getChartData(data)
    } else if (isCheckVideoDetailDate.value) {    //如果是在查看视频具体某一天数据的情况下
        isCheckVideoDetailDate.value = false
        videoChartData.value = { xData: [], yData: [] }
        videoDateDate.value = { xData: [], yData: [] }
        videoOriginData.value = { xData: [], yData: [] }
        anVideo(videoData)
    } else if (isAnVideo.value) {    //如果是在查看视频数据的情况下
        videoChartData.value = { xData: [], yData: [] }
        videoOriginData.value = { xData: [], yData: [] }
        anVideo(videoData)
    }
}

const handleVideoBack = () => {
    //视频回退的时候如果存在具体天数的视频的话
    if (isCheckVideoDetailDate.value) {
        videoDateDate.value = { xData: [], yData: [] };
        isCheckVideoDetailDate.value = false
    } else {
        //如果没有天数数据的话那么就代表全是天数数据
        isAnVideo.value = false
        videoChartData.value = { xData: [], yData: [] }
        videoOriginData.value = { xData: [], yData: [] }
        clearSelectEvent()
    }
}

const anVideo = async (data) => {
    try {
        isAnVideo.value = true
        const { now, sevenDaysAgo, fifteenDaysAgo, thirtyDaysAgo } = getCurrentAndPreviousTimestamps();
        let timeData = { start_date: '', end_date: now }
        if (active.value === 0) {
            timeData.start_date = sevenDaysAgo
        } else if (active.value === 1) {
            timeData.start_date = fifteenDaysAgo
        } else {
            timeData.start_date = thirtyDaysAgo
        }
        console.log('开始时间: ', formatTimestampToLocalTime(timeData.start_date), '结束时间: ', formatTimestampToLocalTime(timeData.end_date))

        const postData = Object.assign(timeData, data)
        const res = await $api({ type: 'anVideo', data: postData })
        if (res.code === 0) {
            videoOriginData.value.xData = res?.data?.times.map(i => { return formatTimestampToLocalTime(i) })
            videoChartData.value.xData = videoOriginData.value.xData
            Object.keys(res.data).forEach(i => {
                if (nameMap.value[i] !== undefined) {
                    const item = { name: nameMap.value[i].name, sort_idx: nameMap.value[i].sort, value: res.data[i] }
                    videoOriginData.value.yData.push(item)
                }
            })

            // 按天分组
            const groupedData = videoOriginData.value.xData.reduce((acc, curr, index) => {
                const date = curr.split(" ")[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(index);
                return acc;
            }, {});

            // 计算每天各指标的累加值
            const aggregatedData = {
                xData: [],
                yData: videoOriginData.value.yData.map(dataSeries => ({
                    name: dataSeries.name,
                    value: [],
                    sort_idx: dataSeries.sort_idx,
                })).sort((a, b) => { return a.sort_idx - b.sort_idx })
            };

            Object.keys(groupedData).forEach(date => {
                aggregatedData.xData.push(date);
                const indices = groupedData[date];
                videoOriginData.value.yData.forEach((dataSeries, seriesIndex) => {
                    const sum = indices.reduce((acc, index) => acc + dataSeries.value[index], 0);
                    aggregatedData.yData[seriesIndex].value.push(sum);
                });
            });
            videoChartData.value = aggregatedData
            console.log('抽取每一天的数据，并计算每一天各指标的累加值:  ', videoChartData.value);
        }
    } catch (error) {
        console.error(error);
    }
}

//视频x轴点击事件
const handleVideoXAxisClick = async (value) => {
    if (!isCheckVideoDetailDate.value) {
        isCheckVideoDetailDate.value = true
        console.log('X轴被点击: ', '时间戳: ', value);

        // 找到目标日期对应的所有时间点的索引
        const indices = videoOriginData.value.xData.reduce((acc, curr, index) => {
            if (curr.startsWith(value)) {
                acc.push(index);
            }
            return acc;
        }, []);
        console.log('选中日期的所有时间线下标: ', indices)

        // 如果没有找到对应日期的数据，返回空结果
        if (indices.length === 0) {
            return { xData: [], yData: [] };
        }

        // 构建结果数据
        const result = {
            xData: indices.map(index => videoOriginData.value.xData[index]), // 返回该日期下的所有时间点

            yData: videoOriginData.value.yData.map(dataSeries => ({
                name: dataSeries.name,
                value: indices.map(index => dataSeries.value[index]) // 返回该日期下的所有时间点对应的yData值
            }))
        };
        console.log('选中日期下的所有时间点: ', result.xData)
        console.log('选中日期下的所有时间点对应的yData值: ', result.yData)

        videoDateDate.value = result
    }
};

//x轴点击事件
const handleXAxisClick = async (value) => {
    if (!isCheckDetailDate.value) {
        isCheckDetailDate.value = true

        //清空数据
        charDateDate.value = { xData: [], yData: [] }
        console.log('X轴被点击: ', '时间戳: ', value);

        // 找到目标日期对应的所有时间点的索引
        const indices = originChartData.value.xData.reduce((acc, curr, index) => {
            if (curr.startsWith(value)) {
                acc.push(index);
            }
            return acc;
        }, []);
        console.log('选中日期的所有时间线下标: ', indices)

        // 如果没有找到对应日期的数据，返回空结果
        if (indices.length === 0) {
            return { xData: [], yData: [] };
        }

        // 构建结果数据
        const result = {
            xData: indices.map(index => originChartData.value.xData[index]), // 返回该日期下的所有时间点

            yData: originChartData.value.yData.map(dataSeries => ({
                name: dataSeries.name,
                value: indices.map(index => dataSeries.value[index]), // 返回该日期下的所有时间点对应的yData值
                sort_idx: dataSeries.sort_idx
            })).sort((a, b) => { return a.sort_idx - b.sort_idx })
        };
        console.log('选中日期下的所有时间点: ', result.xData)
        console.log('选中日期下的所有时间点对应的yData值: ', result.yData)

        charDateDate.value = result
    }
};

const dialogLoading = ref(false)

const handleGetVideos = async () => {
    const data = { uids: props.selectedUids }
    await getBloggerVideos(data)
}

const getFansTree = async (data) => {
    try {
        const { now, sevenDaysAgo, fifteenDaysAgo, thirtyDaysAgo } = getCurrentAndPreviousTimestamps();
        let timeData = { start_date: '', end_date: now }
        if (active.value === 0) {
            timeData.start_date = sevenDaysAgo
        } else if (active.value === 1) {
            timeData.start_date = fifteenDaysAgo
        } else {
            timeData.start_date = thirtyDaysAgo
        }
        console.log('开始时间: ', formatTimestampToLocalTime(timeData.start_date), '结束时间: ', formatTimestampToLocalTime(timeData.end_date))
        const postData = Object.assign(timeData, data)

        const res = await $api({ type: 'fetchFansTree', data: postData })
        if (res.code === 0) {
            // fansTree.value = res.data
            const data = res?.data ?? []
            if (data.length > 0) {
                fansChartData.value.xData = data.reduce((acc, curr) => {
                    acc.push(curr.region)
                    return acc
                }, [])
                console.log('value', fansChartData.value.xData)
                fansChartData.value.yData = data.reduce((acc, curr) => {
                    acc.push(curr.count)
                    return acc
                }, [])
                console.log('处理后的粉丝结构数据: ', fansChartData.value)
            }
        }
    } catch (error) {
        console.error(error);
    }
}

const initDialog = async () => {
    dialogLoading.value = true
    const data = { uids: props.selectedUids }
    await Promise.all([getChartData(data), getDataView(data), fetchVideoStats(data), getFansTree(data)])
    if (props.selectedUids.length === 1) {
        await handleGetVideos()
    }
    dialogLoading.value = false
}

//获取主要数据
const getDataView = async (data) => {
    try {
        const res = await $api({ type: 'getDataview', data })
        if (res.code === 0) {
            dataView.value.total_aweme_count = parseNum(res?.data?.total_aweme_count ?? 0)
            dataView.value.total_follower_count = parseNum(res?.data?.total_follower_count ?? 0)
            dataView.value.total_following_count = parseNum(res?.data?.total_following_count ?? 0)
            dataView.value.total_total_favorited = parseNum(res?.data?.total_total_favorited ?? 0)
        }
    } catch (error) {
        console.error(error);
    }
}

//获取图表数据
const getChartData = async (data) => {
    try {
        const { now, sevenDaysAgo, fifteenDaysAgo, thirtyDaysAgo } = getCurrentAndPreviousTimestamps();
        let timeData = { start_date: '', end_date: now }
        if (active.value === 0) {
            timeData.start_date = sevenDaysAgo
        } else if (active.value === 1) {
            timeData.start_date = fifteenDaysAgo
        } else {
            timeData.start_date = thirtyDaysAgo
        }
        console.log('开始时间: ', formatTimestampToLocalTime(timeData.start_date), '结束时间: ', formatTimestampToLocalTime(timeData.end_date))

        const postData = Object.assign(timeData, data)
        const res = await $api({ type: 'getChartData', data: postData })
        if (res.code === 0) {
            originChartData.value.xData = res?.data?.times.map(i => { return formatTimestampToLocalTime(i) })
            Object.keys(res.data).forEach(i => {
                if (nameMap.value[i] !== undefined) {
                    const item = { name: nameMap.value[i].name, sort_idx: nameMap.value[i].sort, value: res.data[i] }
                    originChartData.value.yData.push(item)
                }
            })

            // 按天分组
            const groupedData = originChartData.value.xData.reduce((acc, curr, index) => {
                const date = curr.split(" ")[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(index);
                return acc;
            }, {});

            // 计算每天各指标的累加值
            const aggregatedData = {
                xData: [],
                yData: originChartData.value.yData.map(dataSeries => ({
                    name: dataSeries.name,
                    value: [],
                    sort_idx: dataSeries.sort_idx,
                })).sort((a, b) => { return a.sort_idx - b.sort_idx })
            };
            console.log(aggregatedData.yData)
            Object.keys(groupedData).forEach(date => {
                aggregatedData.xData.push(date);
                const indices = groupedData[date];
                originChartData.value.yData.forEach((dataSeries, seriesIndex) => {
                    const sum = indices.reduce((acc, index) => acc + dataSeries.value[index], 0);
                    aggregatedData.yData[seriesIndex].value.push(sum);
                });
            });
            chartData.value = aggregatedData
            console.log('抽取每一天的数据，并计算每一天各指标的累加值:  ', chartData.value);
        }
    } catch (error) {
        console.error(error);
    }
}

//获取视频概述数据
const fetchVideoStats = async (data) => {
    try {
        const res = await $api({ type: 'fetchVideoStats', data })
        if (res.code === 0) {
            videoView.value['average_comment_count'] = res?.stats?.average_comment_count
            videoView.value['average_digg_count'] = res?.stats?.average_digg_count
            videoView.value['average_duration'] = res?.stats?.average_duration
            videoView.value['average_play_count'] = res?.stats?.average_play_count
            videoView.value['max_comment_count'] = res?.stats?.max_comment_count
            videoView.value['max_digg_count'] = res?.stats?.max_digg_count
            videoView.value['max_duration'] = res?.stats?.max_duration
            videoView.value['max_play_count'] = res?.stats?.max_play_count
            videoView.value['total_videos'] = res?.stats?.total_videos
        }
    } catch (error) {
        console.error(error);
    }
}

//获取博主的视频
const getBloggerVideos = async (data) => {
    try {
        const res = await $api({ type: 'getBloggerVideos', data })
        videoList.value = (res?.videos ?? []).reverse()
    } catch (error) {
        console.error(error);
    }
}

const selectAllChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectedVideos.value = records
    }
}

const selectChange = ({ checked }) => {
    const $table = tableRef.value
    if ($table) {
        const records = $table.getCheckboxRecords()
        selectedVideos.value = records
    }
}

const handleClose = () => {
    emits('handleClose')
    chartData.value = {
        xData: [],
        yData: []
    }
    dataView.value = {
        follower_total: 0,
        video_total: 0,
        digg_total: 0,
        comment_total: 0,
        fans_digg_raio: 0
    }
    dialogLoading.value = false
}

const headerCellClickEvent = ({ column, triggerResizable, triggerSort, triggerFilter }) => {
    const $table = tableRef.value
    if ($table) {
        // 如果触发了列的其他功能按钮
        if (column.sortable && !(triggerResizable || triggerSort || triggerFilter)) {
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

const resetDialog = () => {
    //折线图处理后的源数据，用于找当天的数据
    originChartData.value = { xData: [], yData: [] }

    //折线图总数据
    chartData.value = { xData: [], yData: [] }

    //折线图天数据
    charDateDate.value = { xData: [], yData: [] }

    //粉丝数据
    fansChartData.value = { xData: [], yData: [] }

    //视频源数据
    videoOriginData.value = { xData: [], yData: [] }

    //视频分析总数据
    videoChartData.value = { xData: [], yData: [] }

    //视频分析天数据
    videoDateDate.value = { xData: [], yData: [] }

    //是否点击了具体的时间轴
    isCheckDetailDate.value = false

    //是否点击了视频具体的时间轴
    isCheckVideoDetailDate.value = false

    isAnVideo.value = false

    videoList.value = []

    active.value = 0

    //数据概述
    dataView.value = {
        total_aweme_count: 0,
        total_follower_count: 0,
        total_following_count: 0,
        total_total_favorited: 0,
    }

    //视频概述
    videoView.value = {
        "average_comment_count": 0,
        "average_digg_count": 0,
        "average_duration": 0,
        "average_play_count": 0,
        "max_comment_count": 0,
        "max_digg_count": 0,
        "max_duration": 0,
        "max_play_count": 0,
        "total_videos": 0
    }
}

const handleAnVideo = async () => {
    if (selectedVideos.value.length === 0) {
        return ElMessage.warning('请勾选需要分析的视频')
    }
    const data = { aweme_ids: selectedAwemeList.value }
    isCheckDetailDate.value = false
    videoOriginData.value = { xData: [], yData: [] }
    videoChartData.value = { xData: [], yData: [] }
    videoDateDate.value = { xData: [], yData: [] }
    await anVideo(data)
}

const clearSelectEvent = () => {
    const $table = tableRef.value
    if ($table) {
        $table.clearCheckboxRow()
    }
}

const handleLegendChange = (chartKey, selected) => {
    legendSelectedStates.value[chartKey] = selected;
}

watch(() => props.isShow, (val) => {
    if (val) {
        initDialog()
    } else {
        resetDialog()
    }
})
</script>

<style scoped lang='scss'>
::v-deep(.el-select__wrapper) {
    width: 100px !important;
}

.active {
    background-color: #409eff !important;
    color: #fff !important;
}

.mb30 {
    margin-bottom: 30px !important;
}

.main_title {
    font-size: 18px;
    color: #000;
}

.item {
    margin-bottom: 20px;
    padding: 10px;
    background-color: rgba(243, 245, 250, 1);
    box-shadow: 0px 2px 6px 0px rgba(0, 0, 0, 0.4);
    border-radius: 10px;

    .flex_title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        div {
            display: flex;
            align-items: flex-end;
            width: auto;
            font-size: 14px;
            font-weight: 500;

            p:nth-of-type(1) {
                margin-right: 10px;
            }
        }
    }

    .data_content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;

        div {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 200px;
            font-size: 14px;
            font-weight: 500;

            p:nth-of-type(1) {
                margin-bottom: 10px;
                font-size: 20px;
                font-weight: 500;
            }

            p:nth-of-type(2) {
                margin-bottom: 10px
            }
        }
    }
}
</style>
