import { createRouter, createWebHistory ,type RouteLocationNormalized ,createWebHashHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path:"/login",
      name:"login",
      component:() => import("../views/login.vue")
    },
    {
      path: '/home',
      name: 'home',
      redirect: "/home/shouye",
      component: HomeView,
      children: [
        {
          path: 'shouye',
          name:'shouye',
          component:() => import('../views/shouye.vue')
        },
        {
          path: 'house',
          name:'house',
          redirect: "/house/unit",
          children:[
            {
              path: 'unit',
              name:'unit',
              component:() => import('@/views/house/danyuan.vue')
            },
            {
              path: 'unitDetail',
              name:'unitDetail',
              component:() => import('@/views/house/danyuanDeatail.vue')
            },
            {
              path: 'unitAdd',
              name: 'unitAdd',
              component:() => import('@/views/house/danyuanAdd.vue')
            },
            {
              path:'unitEdit',
              name:'unitEdit',
              component:() => import('@/views/house/danyuanEdit.vue')
            },
            {
              path: 'houseNum',
              name:'houseNum',
              component:() => import('@/views/house/houseNum.vue')
            },
            {
              path: 'houseNumEdit',
              name: 'houseNumEdit',
              component:() => import('@/views/house/houseNumEdit.vue')
            },
            {
              path: 'houseEquipment',
              name: 'houseEquipment',
              component:() => import('@/views/house/houseEquipment.vue')
            }
          ]
        },
        {
          path: 'parking',
          name:'parking',
          redirect: "/parking/message",
          children:[
            {
              path: 'message',
              name:'message',
              component:() => import('@/views/parking/message.vue')
            },
            {
              path: 'order',
              name:'order',
              component:() => import('@/views/parking/order.vue')
            },
          ]
        },
        {
          path: 'pay',
          name:'pay',
          redirect:"/pay/type",
          children:[
            {
              path: 'type',
              name:'type',
              component:() => import('@/views/pay/type.vue')
            },
            {
              path: 'typeDeatil',
              name:'typeDetail',
              component:() => import('@/views/pay/typeDetail.vue')
            },
            {
              path: 'typeAdd',
              name: 'typeAdd',
              component:() => import('@/views/pay/typeAdd.vue')
            },
            {
              path: 'paymsg',
              name: 'paymsg',
              component:() => import('@/views/pay/paymsg.vue')
            },
            {
              path: 'payDetail',
              name: 'payDetail',
              component:() => import('@/views/pay/payDetail.vue')
            },
          ]
        },
        {
          path: 'serve',
          name:'serve',
          redirect: '/serve/notice',
          children: [
            {
              path: 'notice',
              name: 'notice',
              component:() => import('@/views/serve/notice.vue')
            },
            {
              path: 'weixiu',
              name: 'weixiu',
              component:() => import('@/views/serve/weixiu.vue')
            },
            {
              path: 'smartRepair',
              name: 'smartRepair',
              component:() => import('@/views/serve/smartRepair.vue')
            },
            {
              path: 'houseRepair',
              name: 'houseRepair',
              component:() => import('@/views/serve/houseRepair.vue')
            },
            {
              path: 'feedBack',
              name: 'feedBack',
              component:() => import('@/views/serve/feedBack.vue')
            },
          ]
        },
        {
          path: 'menu',
          name: 'menu',
          redirect:'/menu/list',
          children: [
            {
              path: 'list',
              name: 'list',
              component:() => import('@/views/menu/list.vue')
            },
            {
              path: 'listSecond',
              name: 'listSecond',
              component:() => import('@/views/menu/listSecond.vue')
            }
          ]
        },
        {
          path: 'user',
          name: 'user',
          redirect: '/user/normal',
          children: [
            {
              path: 'normal',
              name: 'normal',
              component:() => import('@/views/user/normalUser.vue')
            },
            {
              path: 'manger',
              name: 'manger',
              component:() => import('@/views/user/mangerUser.vue')
            }
          ]
        },
        {
          path: 'owner',
          name: 'owner',
          redirect: '/owner/myMsg',
          children: [
            {
              path: 'myMsg',
              name:'myMsg',
              component:() => import('@/views/owner/myMsg.vue')
            },
            {
              path: 'password',
              name: 'password',
              component:() => import('@/views/owner/password.vue')
            }
          ]
        },
        {
          path: 'notFound',
          name: 'notFound',
          component:() => import('@/views/404.vue')
        }
      ]
    }

  ],
})

// 路由白名单（不需要登录即可访问的路径）
const whiteList = ['/login']

const getToken = () => {
  const token = localStorage.getItem('token')
  if (token) {
    return true
  } else {
    return false
  }
}

// 全局前置守卫
router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
  // 1. 确定用户是否已登录
  const hasToken = getToken() // 从localStorage/cookie获取token

  if (hasToken) {
    if (to.path === '/login') {
      // 2. 已登录时访问登录页 -> 重定向到首页
      next('/home')
    } else {
      // 3. 已登录访问其他页面 -> 直接放行
      next()
    }
  } else {
    // 4. 未登录状态
    if (whiteList.includes(to.path)) {
      // 5. 访问白名单页面 -> 直接放行
      next()
    } else {
      // 6. 重定向到登录页，携带原路径参数
      next(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})



export default router
