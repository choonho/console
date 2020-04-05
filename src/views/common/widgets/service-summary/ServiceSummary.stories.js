import {
    toRefs, reactive, ref, computed,
} from '@vue/composition-api';
import { action } from '@storybook/addon-actions';
import {
    text, number, select, object, boolean, color,
} from '@storybook/addon-knobs/vue';
import ServiceSummary from '@/views/common/widgets/service-summary/ServiceSummary.vue';
import { getKnobProps } from '@sb/storybook-util';
import { serviceSummaryProps } from '@/views/common/widgets/service-summary/ServiceSummary.toolset';
import casual, { arrayOf } from '@/lib/casual';
import { ChartData } from '@/components/organisms/charts/abstract-chart/AbstractChart.toolset';
import { primary, secondary, secondary1 } from '@/styles/colors';

export default {
    title: 'views/widgets/ServiceSummary',
    component: ServiceSummary,
    parameters: {
        info: {
            summary: '',
            components: { ServiceSummary },
        },
        knobs: { escapeHTML: false },
    },
};


export const defaultCase = () => ({
    components: { ServiceSummary },
    props: getKnobProps(serviceSummaryProps, {
        title: 'projects',
        data: [0, 0, 200, 300, 500, 800, 1300],
    }, {
        loading: true,
    }, {
        color,
    }),
    template: `
    <div style="width: 80vw;">
        <ServiceSummary v-bind="$props" :loading="loading"></ServiceSummary>
        <button class="w-full my-3 border border-gray" @click="draw">REDRAW</button>
    </div>`,
    setup(props, context) {
        const state = reactive({
            loading: true,
        });

        const draw = () => {
            state.loading = true;
            setTimeout(() => {
                state.loading = false;
            }, 100);
        };

        draw();

        return {
            ...toRefs(state),
            draw,
        };
    },
});


export const zeroCase = () => ({
    components: { ServiceSummary },
    props: getKnobProps(serviceSummaryProps, {
        title: 'projects',
        count: 434,
        data: [0, 0, 0, 0, 0, 0, 0],
    }, {
        loading: true,
    }, {
        color,
    }),
    template: `
    <div style="width: 80vw;">
        <ServiceSummary v-bind="$props" :loading="loading"></ServiceSummary>
        <button class="w-full my-3 border border-gray" @click="draw">REDRAW</button>
    </div>`,
    setup(props, context) {
        const state = reactive({
            loading: true,
        });

        const draw = () => {
            state.loading = true;
            setTimeout(() => {
                state.loading = false;
            }, 100);
        };

        draw();

        return {
            ...toRefs(state),
            draw,
        };
    },
});
