<template>
    <div class="chart" ref="chartRef" style="width: 90%; height: 400px;"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, shallowRef } from 'vue';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, GridComponent, LegendComponent, ToolboxComponent, DataZoomComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

// 注册必须的组件
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    CanvasRenderer,
    LineChart,
    LegendComponent,
    ToolboxComponent,
    DataZoomComponent
]);

const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    data: {
        type: Object,
        default: () => ({
            xData: [],
            yData: [],
        }),
    },
    chartKey: {
        type: String,
        required: true,
    },
    selectedState: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['xAxisClick', 'legendChange']);

const chartRef = shallowRef(null);
let chartInstance = null;

const getDefaultSelectedState = (yData) => {
    const selectedState = {};
    yData.forEach(series => {
        selectedState[series.name] = series.name !== '粉丝增量'; // 默认不选中“粉丝增量”系列
    });
    return selectedState;
};

const getChartOption = (data, selectedState) => {
    const defaultSelectedState = getDefaultSelectedState(data.yData);
    const mergedSelectedState = { ...defaultSelectedState, ...selectedState };

    return {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: data.yData.map(series => series.name),
            selected: mergedSelectedState // 使用合并的选中状态
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.xData,
            triggerEvent: true
        },
        yAxis: {
            type: 'value'
        },
        series: data.yData.map(series => ({
            name: series.name,
            type: 'line',
            data: series.value,
        })),
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
};

const initChart = () => {
    const dom = chartRef.value;

    chartInstance = echarts.init(dom);
    chartInstance.setOption(getChartOption(props.data, props.selectedState));
    window.addEventListener('resize', resizeChart);

    // 添加点击事件监听器
    chartInstance.on('click', (params) => {
        if (params.componentType === 'xAxis') {
            emit('xAxisClick', params.value);
        }
    });

    // 添加图例选择状态变更监听器
    chartInstance.on('legendselectchanged', (params) => {
        emit('legendChange', params.selected);
    });
};

const resizeChart = () => {
    if (chartInstance) {
        chartInstance.resize();
    }
};

onMounted(() => {
    setTimeout(() => {
        initChart();
    }, 200);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeChart);
    if (chartInstance) {
        chartInstance.off('click');
        chartInstance.off('legendselectchanged');
    }
});

watch(
    () => props.data,
    (newData) => {
        if (chartInstance) {
            chartInstance.clear(); // 清空图表的配置和数据
            const option = getChartOption(newData, props.selectedState);
            chartInstance.setOption(option, { notMerge: true }); // 重新设置完整的option，并且不合并配置
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
