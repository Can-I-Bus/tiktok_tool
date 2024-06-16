<template>
    <div class="chart" ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    CanvasRenderer,
    BarChart,
    LegendComponent,
]);

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        default: () => {
            return {
                xData: [],
                yData: []
            }
        },
    },
    title: {
        type: String,
        default: 'ECharts 柱状图',
    },
});

const chartRef = ref(null);
let chartInstance = null;

const initChart = () => {
    const dom = chartRef.value;
    if (!dom) return;

    chartInstance = echarts.init(dom);
    const option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: {
            type: 'category',
            data: props.data.xData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: props.data.yData,
                type: 'bar',
                barWidth: '20%', // 设置柱子的宽度，可以是具体数值或者百分比
                label: {
                    show: true,
                    position: 'top', // 可以是 'top', 'inside', 'left', 'right', 'bottom', 'insideTop', 'insideBottom', 'insideLeft', 'insideRight', 等
                    formatter: '{c}', // '{c}' 表示对应的数据值
                    color: 'black' // 设置标签颜色
                },
                itemStyle: {
                    color: '#3398DB' // 设置柱子的颜色
                }
            }
        ],
        dataZoom: [
            {
                type: "slider",
                show: true,
                backgroundColor: "rgb(19, 63, 100)",
                fillerColor: "rgb(16, 171, 198)",
                borderColor: "rgb(19, 63, 100)",
                showDetail: false,
                startValue: 0,
                endValue: 15,
                filterMode: "empty",
                height: 8,
                left: "center",
                bottom: 3,
            },
        ]
    };

    chartInstance.setOption(option);

    // 监听窗口大小变化，调整图表大小
    window.addEventListener('resize', resizeChart);
};

const resizeChart = () => {
    if (chartInstance) {
        chartInstance.resize();
    }
};

onMounted(() => {
    setTimeout(() => {
        initChart();
    }, 200)
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
});

watch(
    () => props.data,
    (newData) => {
        if (chartInstance) {
            chartInstance.setOption({
                xAxis: {
                    type: 'category',
                    data: props.data.xData
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        data: props.data.yData,
                        type: 'bar',
                        barWidth: '20%', // 设置柱子的宽度
                        label: {
                            show: true,
                            position: 'top',
                            formatter: '{c}',
                            color: 'black'
                        },
                        itemStyle: {
                            color: '#3398DB'
                        }
                    }
                ]
            });
        }
    },
    { deep: true }
);
</script>

<style scoped>
.chart {
    width: 100%;
    height: 400px;
}
</style>