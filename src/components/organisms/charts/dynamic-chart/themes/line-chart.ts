import Chart, { ChartDataSets } from 'chart.js';
import { gray } from '@/styles/colors';
import Color from 'color';
import {
    ChartOptionsType, ChartPluginsType,
    ChartSettingsType, ChartThemeGroupType, defaultPlugins, defaultThemeProps,
    DefaultThemePropsType, tooltips,
} from '@/components/organisms/charts/dynamic-chart/DynamicChart.toolset';


/** *************** default ****************** */
export interface LineDefaultThemePropsType extends DefaultThemePropsType {
    gradient: boolean;
    gradientHeight: number;
}

export const lineDefaultThemeProps = {
    ...defaultThemeProps,
    gradient: true,
    gradientHeight: 100,
} as LineDefaultThemePropsType;

const getGradientColor = (gradient, color: string) => {
    gradient.addColorStop(0, Color(color).alpha(0.25));
    gradient.addColorStop(0.5, Color(color).alpha(0.125));
    gradient.addColorStop(1, Color(color).alpha(0));
    return gradient;
};

const defaultSettings: ChartSettingsType<LineDefaultThemePropsType> = (themeProps, chartRef, dataset) => {
    const ctx: CanvasRenderingContext2D = chartRef.getContext('2d') as CanvasRenderingContext2D;
    const gradient = ctx.createLinearGradient(0, 0, 0, themeProps.gradientHeight);
    return i => ({
        borderWidth: 1,
        fill: 'start',
        pointRadius: 0,
        pointBorderWidth: 0,
        lineTension: 0.25,
        backgroundColor: themeProps.gradient
            ? getGradientColor(gradient, themeProps.colors[i])
            : themeProps.colors[i],
    });
};

const defaultOptions: ChartOptionsType<LineDefaultThemePropsType> = themeProps => ({
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    layout: {
        padding: {
            left: -10,
            bottom: -10,
        },
    },
    scales: {
        yAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                min: -20,
                suggestedMax: 80,
                display: false,
            },
        }],
        xAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                display: false,
            },
        }],
    },
    tooltips,
});

/** *************** multi ****************** */
export interface LineMultiThemePropsType extends DefaultThemePropsType {
    min?: number;
    max?: number;
}

export const lineMultiThemePropsType = {
    ...defaultThemeProps,
    min: 0,
    max: undefined,
} as LineMultiThemePropsType;

const multiSettings: ChartSettingsType<LineMultiThemePropsType> = themeProps => i => ({
    fill: false,
    borderWidth: 2,
    lineTension: 0,
    pointRadius: 0,
});

const multiOptions: ChartOptionsType<LineMultiThemePropsType> = themeProps => ({
    maintainAspectRatio: false,
    legend: {
        display: false,
    },
    scales: {
        yAxes: [{
            gridLines: {
                display: true,
                drawTicks: false,
                color: gray[100],
                zeroLineColor: gray[100],
            },
            ticks: {
                display: true,
                autoSkip: true,
                autoSkipPadding: 20,
                padding: 10,
                min: themeProps.min,
                max: themeProps.max,
            },
        }],
        xAxes: [{
            gridLines: {
                display: true,
                drawTicks: false,
                color: gray[100],
                zeroLineColor: gray[100],
            },
            ticks: {
                autoSkip: true,
                autoSkipPadding: 50,
                padding: 10,
            },
            afterTickToLabelConversion(scaleInstance) {
                scaleInstance.ticks[0] = null;
                scaleInstance.ticks[scaleInstance.ticks.length - 1] = null;
            },
        }],
    },
    tooltips: {
        ...tooltips,
        mode: 'point',
    },
});

const multiPlugins: ChartPluginsType<LineMultiThemePropsType> = themeProps => [{
    beforeInit(chart: Chart) {
        const labels: any = chart.data.labels;
        labels.forEach((e, i, a) => {
            if (/\n/.test(e)) {
                a[i] = e.split(/\n/);
            }
        });
    },
}];

export type LineTheme = ChartThemeGroupType<
    LineDefaultThemePropsType |
    LineMultiThemePropsType
    >

export default {
    default: {
        settings: defaultSettings,
        options: defaultOptions,
        plugins: defaultPlugins,
    },
    multi: {
        settings: multiSettings,
        options: multiOptions,
        plugins: multiPlugins,
    },
} as LineTheme;
