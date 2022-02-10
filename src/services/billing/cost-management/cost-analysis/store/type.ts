import { GRANULARITY, GROUP_BY } from '@/services/billing/cost-management/lib/config';
import { QUERY_VISIBILITY_TYPE } from '@/services/billing/cost-management/cost-analysis/lib/config';
import { CHART_TYPE } from '@/services/billing/cost-management/widgets/lib/config';
import { CostQueryFilters, Period } from '@/services/billing/cost-management/type';


export interface GroupByItem {
    name: string;
    label: string;
}

export interface CostQuerySetOption {
    chart_type: CHART_TYPE;
    group_by: GROUP_BY[]; // string[]
    primary_group_by: string|undefined;
    granularity: GRANULARITY;
    stack: boolean;
    period: Period;
    filters: CostQueryFilters;
}

export interface CostQuerySetModel {
    cost_query_set_id: string;
    name: string;
    scope: QUERY_VISIBILITY_TYPE;
    options?: CostQuerySetOption;
}

export interface CostAnalysisStoreState {
    granularity: GRANULARITY;
    stack: boolean;
    groupBy: GROUP_BY[];
    primaryGroupBy: GROUP_BY|undefined;
    period: Period;
    filters: CostQueryFilters;
    selectedQueryId: string|undefined;
    costQueryList: CostQuerySetModel[];
}
