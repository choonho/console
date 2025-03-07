<script setup lang="ts">
import {
    computed, reactive,
} from 'vue';
import type { TranslateResult } from 'vue-i18n';

import {
    PToggleButton, PRadio, PButton, PCheckbox, PSelectDropdown, PBadge, PTooltip,
} from '@spaceone/design-system';
import type { MenuItem } from '@spaceone/design-system/types/inputs/context-menu/type';

import type { EscalationPolicyModel } from '@/schema/monitoring/escalation-policy/model';
import type { EventRuleActions, EventRuleOptions } from '@/schema/monitoring/event-rule/type';
import { i18n, i18n as _i18n } from '@/translations';

import { useAllReferenceStore } from '@/store/reference/all-reference-store';
import type { EscalationPolicyReferenceMap } from '@/store/reference/escalation-policy-reference-store';
import type { UserReferenceMap } from '@/store/reference/user-reference-store';

import TagsInputGroup from '@/common/components/forms/tags-input-group/TagsInputGroup.vue';
import type { Tag } from '@/common/components/forms/tags-input-group/type';
import { useProxyValue } from '@/common/composables/proxy-state';
import ProjectSelectDropdown from '@/common/modules/project/ProjectSelectDropdown.vue';

import { alertResourceGroupBadgeStyleTypeFormatter } from '@/services/alert-manager/helpers/alert-badge-helper';

const URGENCY = Object.freeze({
    NO_SET: 'NO_SET',
    HIGH: 'HIGH',
    LOW: 'LOW',
});

interface Props {
    actions?: EventRuleActions;
    options?: EventRuleOptions;
}
const props = withDefaults(defineProps<Props>(), {
    actions: () => ({}),
    options: () => ({}),
});
const emit = defineEmits(['update:actions', 'update:options']);

const allReferenceStore = useAllReferenceStore();
const state = reactive({
    users: computed<UserReferenceMap>(() => allReferenceStore.getters.user),
    userItems: computed(() => Object.keys(state.users).map((k) => ({
        name: k,
        label: state.users[k]?.label || k,
    }))),
    urgencyList: computed(() => ([
        {
            name: URGENCY.NO_SET,
            label: _i18n.t('PROJECT.EVENT_RULE.NO_SET'),
        },
        {
            name: URGENCY.HIGH,
            label: _i18n.t('PROJECT.EVENT_RULE.HIGH'),
        },
        {
            name: URGENCY.LOW,
            label: _i18n.t('PROJECT.EVENT_RULE.LOW'),
        },
    ])),
    escalationPolicies: computed<EscalationPolicyReferenceMap>(() => allReferenceStore.getters.escalationPolicy),
    escalationPolicyList: computed(() => Object.keys(state.escalationPolicies).map((key) => ({
        name: state.escalationPolicies[key].key,
        label: state.escalationPolicies[key].name,
        scope: state.escalationPolicies[key].data.resource_group,
    }))),
    resourceGroups: computed<Record<EscalationPolicyModel['resource_group'], TranslateResult>>(() => ({
        WORKSPACE: i18n.t('MONITORING.ALERT.ESCALATION_POLICY.WORKSPACE'),
        PROJECT: i18n.t('MONITORING.ALERT.ESCALATION_POLICY.PROJECT'),
    })),
    proxyActions: useProxyValue<EventRuleActions>('actions', props, emit),
    proxyOptions: useProxyValue<EventRuleOptions>('options', props, emit),
    routingProjects: computed<string[]>({
        get() {
            return props.actions?.change_project ? [props.actions.change_project] : [];
        },
        set(projectIds) {
            state.proxyActions = {
                ...state.proxyActions,
                change_project: projectIds[0],
            };
        },
    }),
    selectedUrgency: computed({
        get() {
            if (props.actions?.change_urgency) {
                return props.actions.change_urgency;
            }
            return URGENCY.NO_SET;
        },
        set(changeUrgency) {
            state.proxyActions = {
                ...state.proxyActions,
                change_urgency: changeUrgency !== URGENCY.NO_SET ? changeUrgency : undefined,
            };
        },
    }),
    selectedAssignee: computed<MenuItem[]>({
        get() {
            const assignee = props.actions?.change_assignee;
            return assignee ? [{ name: assignee, label: assignee }] : [];
        },
        set(items) {
            state.proxyActions = {
                ...state.proxyActions,
                change_assignee: items[0]?.name,
            };
        },
    }),
    selectedEscalationPolicy: computed<MenuItem[]>({
        get() {
            const escalationPolicy = props.actions?.change_escalation_policy;
            return escalationPolicy ? [{ name: escalationPolicy, label: escalationPolicy }] : [];
        },
        set(items) {
            state.proxyActions = {
                ...state.proxyActions,
                change_escalation_policy: items[0]?.name,
            };
        },
    }),
    additionalInfoTags: computed({
        get() { return props.actions?.add_additional_info; },
        set(tags) {
            state.proxyActions = {
                ...state.proxyActions,
                add_additional_info: tags,
            };
        },
    }),
    stopProcessing: computed<boolean>({
        get() { return props.options?.stop_processing ?? false; },
        set(value) {
            state.proxyOptions = {
                ...state.proxyOptions,
                stop_processing: value,
            };
        },
    }),
});

/* event */
const onToggleChange = (value) => {
    state.proxyActions = {
        ...state.proxyActions,
        no_notification: value,
    };
};
const handleUpdateAdditionalInformation = (tags: Tag) => {
    state.additionalInfoTags = tags;
};
const handleStopProcessingChange = (value: boolean) => {
    state.stopProcessing = value;
};

</script>

<template>
    <section class="event-rule-action-form">
        <p class="title-wrapper">
            <i18n path="PROJECT.EVENT_RULE.DO">
                <template #actions>
                    <strong>{{ $t('PROJECT.EVENT_RULE.THESE_THINGS') }}</strong>
                </template>
            </i18n>
        </p>
        <div class="content-wrapper">
            <div class="form-box">
                <p class="label">
                    {{ $t('PROJECT.EVENT_RULE.SNOOZED_NOTIFICATIONS') }}
                </p>
                <p-toggle-button
                    :value="state.proxyActions.no_notification"
                    :show-state-text="state.proxyActions.no_notification"
                    position="left"
                    spacing="md"
                    @change-toggle="onToggleChange"
                />
            </div>
            <div class="form-box mobile-block">
                <p class="label">
                    {{ $t('PROJECT.EVENT_RULE.PROJECT_ROUTING') }}
                </p>
                <project-select-dropdown project-selectable
                                         :project-group-selectable="false"
                                         :selected-project-ids.sync="state.routingProjects"
                />
            </div>
            <div class="form-box urgency">
                <p class="label">
                    {{ $t('PROJECT.EVENT_RULE.URGENCY') }}
                </p>
                <div>
                    <p-radio v-for="(urgency, uIdx) in state.urgencyList"
                             :key="`urgency-${uIdx}`"
                             v-model="state.selectedUrgency"
                             :value="urgency.name"
                             class="mr-4"
                    >
                        {{ urgency.label }}
                    </p-radio>
                    <p-select-dropdown :selected.sync="state.selectedUrgency"
                                       :menu="state.urgencyList"
                    />
                </div>
            </div>
            <div class="form-box mobile-block">
                <p class="label">
                    {{ $t('PROJECT.EVENT_RULE.ASSIGNEE') }}
                </p>
                <p-select-dropdown class="user-search-dropdown"
                                   show-select-marker
                                   :menu="state.userItems"
                                   :selected.sync="state.selectedAssignee"
                                   is-filterable
                                   show-delete-all-button
                                   reset-selected-on-unmounted
                />
            </div>
            <div class="form-box mobile-block">
                <p class="label">
                    {{ $t('PROJECT.EVENT_RULE.ESCALATION_POLICY') }}
                </p>
                <p-select-dropdown class="escalation-dropdown"
                                   :menu="state.escalationPolicyList"
                                   :selected.sync="state.selectedEscalationPolicy"
                                   show-delete-all-button
                                   reset-selected-on-unmounted
                >
                    <template #dropdown-button="item">
                        <span v-if="state.escalationPolicyList.find((policy) => policy.name === item.name)"
                              class="escalation-policy-menu-item"
                        >
                            <span class="escalation-policy-label">
                                {{ state.escalationPolicyList.find((policy) => policy.name === item.name)?.label }}
                            </span>
                            <p-badge class="scope-badge"
                                     :style-type="alertResourceGroupBadgeStyleTypeFormatter(state.escalationPolicyList.find((policy) => policy.name === item.name)?.scope)"
                                     badge-type="subtle"
                            >
                                {{ state.resourceGroups[state.escalationPolicyList.find((policy) => policy.name === item.name)?.scope] }}
                            </p-badge>
                        </span>
                        <span v-else
                              class="escalation-policy-label placeholder"
                        >{{ $t('COMPONENT.SELECT_DROPDOWN.SELECT') }}</span>
                    </template>
                    <template #menu-item--format="{ item }">
                        <p-tooltip class="escalation-policy-menu-item"
                                   :contents="item.label"
                                   position="bottom"
                        >
                            <span class="escalation-policy-label">{{ item.label }}</span>
                            <p-badge class="scope-badge"
                                     :style-type="alertResourceGroupBadgeStyleTypeFormatter(item.scope)"
                                     badge-type="subtle"
                            >
                                {{ state.resourceGroups[item.scope] }}
                            </p-badge>
                        </p-tooltip>
                    </template>
                </p-select-dropdown>
            </div>
            <div class="form-box additional-information">
                <tags-input-group show-header
                                  :tags="state.additionalInfoTags"
                                  @update-tags="handleUpdateAdditionalInformation"
                >
                    <template #add-button="{handleAddPair}">
                        <div class="top-part">
                            <p>{{ $t('PROJECT.EVENT_RULE.ADDITIONAL_INFORMATION') }}</p>
                            <p-button style-type="tertiary"
                                      icon-left="ic_plus_bold"
                                      class="mb-2"
                                      @click="handleAddPair($event)"
                            >
                                {{ $t('PROJECT.EVENT_RULE.ADD') }}
                            </p-button>
                        </div>
                    </template>
                </tags-input-group>
            </div>
        </div>
        <p-checkbox :selected="state.stopProcessing"
                    :value="true"
                    class="stop-processing-input"
                    @change="handleStopProcessingChange"
        >
            {{ $t('PROJECT.EVENT_RULE.THEN_STOP_PROCESSING') }}
        </p-checkbox>
    </section>
</template>

<style lang="postcss" scoped>
.title-wrapper {
    font-size: 1rem;
    line-height: 2;
    margin-bottom: 0.75rem;
}
.content-wrapper {
    @apply border border-gray-100 rounded-md;
    border-width: 0.25rem;
    font-size: 0.875rem;

    .form-box {
        @apply border-b border-gray-100;
        display: flex;
        min-height: 3.5rem;
        line-height: 1.5;
        align-items: center;
        justify-content: space-between;
        border-bottom-width: 0.25rem;
        padding: 1rem;
        &:last-child {
            border: none;
        }
        &.urgency {
            .p-select-dropdown {
                display: none;
            }
        }

        .escalation-dropdown {

            .escalation-policy-menu-item {
                @apply flex justify-between items-center gap-2;

                .escalation-policy-label {
                    white-space: normal;
                    word-break: normal;
                }
                .placeholder {
                    @apply text-gray-600;
                }
                .scope-badge {
                    @apply flex-shrink-0;
                }
            }
        }

        /* customize tags-input-group */
        :deep(&.additional-information) {
            display: block;
            .top-part {
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .tag-header {
                display: none;
            }
        }

        .project-select-dropdown, .user-search-dropdown, .escalation-dropdown {
            width: 60%;
        }
    }
}
.stop-processing-input {
    display: block;
    text-align: right;
    padding-top: 0.75rem;
}

@screen tablet {
    .content-wrapper {
        .form-box {
            &.urgency {
                .p-radio {
                    display: none;
                }
                .user-search-dropdown, .escalation-dropdown {
                    display: block;
                }
            }
        }
    }
}

@screen mobile {
    .content-wrapper {
        .form-box {
            &.mobile-block {
                display: block;
                .label {
                    padding-bottom: 0.75rem;
                }
                .project-select-dropdown, .user-search-dropdown, .escalation-dropdown {
                    width: 100%;
                }
            }

            /* customize tags-input-group */
            :deep(&.additional-information) {
                .p-field-group {
                    width: 45%;
                }
            }
        }
    }
}
</style>
