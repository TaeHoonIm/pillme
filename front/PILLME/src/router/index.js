import { createRouter, createWebHistory } from 'vue-router';
import Cookies from 'js-cookie';
import { decodeToken } from "../utils/jwt";
import { refreshAccessTokenAPI } from '../api/auth';
// import { getAccessTokenFromDB } from './utils/indexedDBUtils'; // ✅ import

// ✅ 라우트 목록
import AccountSearchSelectionView from '../views/AccountSearchSelectionView.vue';
import AfterAccountView from '../views/AfterAccountView.vue';
import OAuthAdditionalInfo from '../views/OAuthAdditionalInfo.vue';

// ✅ 아이디 비밀번호 찾기 관련
import IdSearchView from '../views/IdSearchView.vue';
import IdFoundView from '../views/IdFoundView.vue';
import PwSearchView from '../views/PwSearchView.vue';
import StartView from '../views/StartView.vue';
import MemberRegisterView from '../views/MemberRegisterView.vue';
import RegisterView from '../views/RegisterView.vue';
import EmailRegistView from '../views/EmailRegistView.vue';
import OAuthCallback from '../views/OAuthCallback.vue';

// ✅ 로그인 관련
import LoginView from '../views/LoginView.vue';
import LoginSelectionView from '../views/LoginSelectionView.vue';
import SigninSelectionView from '../views/SigninSelectionView.vue';
import LoginSucess from '../views/LoginSucess.vue';

// ✅ 로그인 후 접근 가능 페이지
import HomeView from '../views/HomeView.vue';
import CalendarView from '../views/CalendarView.vue';
import MyPageView from '../views/MyPageView.vue';
import MyPage_PwChange from '../views/MyPwChange.vue';
import PersonalInfo from '../views/MyPersonalInfo.vue';
import LoginSecurity from '../views/MyLoginSecurity.vue';
import My_Alarm from '../views/My_Alarm.vue';
import ChatView from '../views/ChatView.vue';
import ChatIndividualView from '../views/ChatIndividualView.vue';
import ManageMemberListView from '../views/ManageMemberListView.vue';
import NotificationListView from '../views/NotificationListView.vue';

// ocr
import CameraCapture from '../components/CameraCapture.vue';
import ImageAnalysis from '../components/ImageAnalysis.vue';

import { deleteAccessToken } from '../utils/localForage'
import { useUserStore } from '../stores/user';  // useUserStore import 추가
import localforage from 'localforage';
import { getAccessToken } from '../utils/localForage';

console.log('[Router] getAccessToken 함수 확인:', typeof getAccessToken);

const routes = [
  // 👉 게스트 전용 페이지 (비로그인 사용자만 접근)
  { path: '/start', name: 'StartView', component: StartView },
  { path: '/login', name: 'LoginView', component: LoginView },
  { path: '/signinselection', name: 'SigninSelectionView', component: SigninSelectionView },
  { path: '/loginselection', name: 'LoginSelectionView', component: LoginSelectionView },
  {
    path: '/accountsearchselection',
    name: 'AccountSearchSelectionView',
    component: AccountSearchSelectionView,
  },
  { path: '/afteraccount', name: 'AfterAccountView', component: AfterAccountView },
  { path: '/idsearch', name: 'IdSearch', component: IdSearchView },
  { path: '/idfound', name: 'IdFound', component: IdFoundView },
  { path: '/pwsearch', name: 'PwSearch', component: PwSearchView },
  { path: '/memberregister', name: 'memberregister', component: MemberRegisterView },
  { path: '/register', name: 'register', component: RegisterView },
  { path: '/emailregist', name: 'emailregist', component: EmailRegistView },
  { path : '/oauth/additional-info', name: 'OAuthAdditionalInfo', component: OAuthAdditionalInfo },
  { path: '/auth/callback/google', name: 'OAuthCallback', component: OAuthCallback },
  { path: '/login/success', name: 'LoginSucess', component: LoginSucess },

  // ✅ 로그인해야 접근 가능한 페이지 (requiresAuth: true)
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },
  {
    path: '/calendar',
    name: 'CalendarView',
    component: CalendarView,
    meta: { requiresAuth: true },
  },
  { path: '/mypage', name: 'mypage', component: MyPageView, meta: { requiresAuth: true } },
  { path: '/mypage/alarm', name: 'alarm', component: My_Alarm, meta: { requiresAuth: true } },
  { path: '/mypage/personal-info', name: 'personal-info', component: PersonalInfo, meta: { requiresAuth: true } },
  { path: '/mypage/login-security', name: 'login-security', component: LoginSecurity, meta: { requiresAuth: true } },
  { path: '/mypage/pw-change', name: 'pw-change', component: MyPage_PwChange, meta: { requiresAuth: true } },
  { path: '/notificationlist', name: 'NotificationList', component: NotificationListView, meta: { requiresAuth: true } },
  { path: '/managememberlist', name: 'ManageMemberList', component: ManageMemberListView, meta: { requiresAuth: true } },
  { path: '/chat', name: 'ChatView', component: ChatView, meta: { requiresAuth: true } },
  { path: '/camera', name: 'CameraCapture', component: CameraCapture, meta: { requiresAuth: true } },
  { path: '/imageanalysis', name: 'ImageAnalysis', component: ImageAnalysis, meta: { requiresAuth: true } },
  { path: '/chat/individual', name: 'ChatIndividualView', component: ChatIndividualView, props: (route) => ({ info: route.query.info }), meta: { requiresAuth: true } },
  // ✅ 404 페이지 처리
  // { path: '/:catchAll(.*)', name: 'NotFound', component: StartView }, // TODO: 404 페이지 구현 필요
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  console.log('[Route Guard] 시작:', to.path);

  const guestPages = [
    '/start', '/login', '/signinselection', '/loginselection',
    '/accountsearchselection', '/afteraccount', '/idsearch',
    '/idfound', '/pwsearch', '/memberregister', '/register',
    '/emailregist', '/login/success', '/auth/callback/google',
    '/oauth/additional-info',
  ];

  try {
    // 먼저 토큰 확인
    let accessToken = await getAccessToken();
    console.log('[Route Guard] localForage 토큰:', accessToken);

    // 토큰이 있는 경우 (로그인된 상태)
    if (accessToken) {
      // 게스트 페이지 접근 시도하면
      if (guestPages.includes(to.path)) {
        console.log('[Route Guard] 로그인 상태에서 게스트 페이지 접근 시도 → 홈으로 이동');
        return next('/');  // 홈으로 리다이렉트
      }
      
      // 토큰 유효성 검사
      const decodedToken = await decodeToken(accessToken);
      const isAccessTokenValid = decodedToken?.exp * 1000 > Date.now();
      
      if (isAccessTokenValid) {
        localStorage.setItem('accessToken', accessToken);
        return next();
      }
    }

    // 토큰이 없는 경우 (비로그인 상태)
    if (guestPages.includes(to.path)) {
      return next();  // 게스트 페이지 접근 허용
    }

    // 보호된 페이지는 로그인 페이지로
    console.warn('[Route Guard] 토큰 없음 → /start로 이동');
    return next('/start');

  } catch (error) {
    console.error('[Route Guard] 오류 발생:', error);
    return next('/start');
  }
});

export default router;
