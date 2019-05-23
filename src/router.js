import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import Recommend from './views/recommend';
import PlayListView from './views/playListView';
import Rank from './views/rank';
import Artists from './views/artists';
import PlayListInfo from './views/playListInfo';
import RankInfo from './views/rankInfo';
import ArtistsInfo from './views/artistsInfo';
import Search from './views/search';
import UserCenter from './views/userCenter';
import UserHistoryList from './views/userHistoryList';
import UserLoveList from './views/userLoveList';
import UserPlayList from './views/userPlayList';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/recommend',
          name: 'recommend',
          component: Recommend
        },
        {
          path: '/playListView',
          name: 'playListView',
          component: PlayListView,
          children: [
            {
              path: ':id',
              name: 'playListInfo',
              component: PlayListInfo
            }
          ]
        },
        {
          path: '/rank',
          name: 'rank',
          component: Rank,
          children: [
            {
              path: ':id',
              name: 'rankInfo',
              component: RankInfo
            }
          ]
        },
        {
          path: '/artists',
          name: 'artists',
          component: Artists,
          children: [
            {
              path: ':id',
              name: 'artistsInfo',
              component: ArtistsInfo
            }
          ]
        },
        {
          path: '/search',
          name: 'search',
          component: Search
        },
        {
          path: '/userCenter',
          name: 'userCenter',
          component: UserCenter,
          children: [
            {
              path: '/userHistoryList',
              name: 'userHistoryList',
              component: UserHistoryList
            },
            {
              path: '/userLoveList',
              name: 'userLoveList',
              component: UserLoveList
            },
            {
              path: '/userPlayList',
              name: 'userPlayList',
              component: UserPlayList
            }
          ]
        }
      ]
    }
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
});
