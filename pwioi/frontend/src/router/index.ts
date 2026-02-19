import { createRouter, createWebHistory } from 'vue-router';
import Home from './views/Home.vue';
import Groups from './views/Groups.vue';
import GroupDetail from './views/GroupDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/groups',
    name: 'Groups',
    component: Groups
  },
  {
    path: '/groups/:id',
    name: 'GroupDetail',
    component: GroupDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
