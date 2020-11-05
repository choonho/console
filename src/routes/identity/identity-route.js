const AddServiceAccountPage = () => import('@/views/identity/service-account/pages/AddServiceAccountPage.vue');

const User = () => import('@/views/identity/user/User');
const ServiceAccount = () => import('@/views/identity/service-account/pages/ServiceAccountPage');
const ServiceAccountSearchPage = () => import('@/views/identity/service-account/pages/ServiceAccountSearchPage');
const TagsPage = () => import('@/views/common/tags/TagsPage.vue');
const NoResource = () => import('@/views/common/error/NoResource.vue');

export default {
    path: 'identity',
    name: 'identity',
    redirect: '/identity/service-account',
    meta: { label: 'Identity' },
    component: { template: '<router-view />' },
    children: [
        {
            path: 'service-account',
            meta: {
                label: 'Service Account',
            },
            component: { template: '<router-view />' },
            children: [
                {
                    path: '/',
                    name: 'serviceAccount',
                    props: true,
                    component: ServiceAccount,
                },
                {
                    path: 'search/:id',
                    name: 'serviceAccountSearch',
                    meta: {
                        label: 'search',
                    },
                    props: true,
                    component: ServiceAccountSearchPage,
                },
                {
                    path: 'add/:provider',
                    name: 'addServiceAccount',
                    meta: { label: 'Add Service Account' },
                    props: true,
                    component: AddServiceAccountPage,
                },
                {
                    path: 'no-resource',
                    name: 'noServiceAccount',
                    component: NoResource,
                },
            ],
        },
        {
            path: 'user',
            name: 'user',
            meta: {
                label: 'User',
            },
            redirect: '/identity/user',
            component: { template: '<router-view />' },
            children: [
                {
                    path: '/',
                    name: 'userMain',
                    component: User,
                },
                {
                    path: ':resourceId/tags',
                    name: 'userTags',
                    props: true,
                    component: TagsPage,
                },
            ],
        },
    ],
};
