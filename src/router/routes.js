const routes = [
  {
    path: "/",
    component: () => import("pages/IndexPage.vue"),
    // children: [{ path: "", component: () => import("pages/IndexPage.vue") }],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
  {
    path: "/login",
    component: () => import("pages/LoginPage.vue"),
  },
  {
    path: "/test",
    component: () => import("pages/TestPage.vue"),
    // children: [{ path: "", component: () => import("pages/TestPage.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/test1",
    component: () => import("pages/TestPage1.vue"),
    // children: [{ path: "", component: () => import("pages/TestPage.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/test2",
    component: () => import("pages/TestPage2.vue"),
    // children: [{ path: "", component: () => import("pages/TestPage.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/register",
    component: () => import("pages/RegisterPage.vue"),
  },
  // {
  //   path: "/main",
  //   component: () => import("pages/MainPage.vue"),
  // },
  {
    path: "/main",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [{ path: "", component: () => import("pages/MainPage.vue") }],
    meta: { requiresAuth: true },
  },
  {
    path: "/shop",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [{ path: "", component: () => import("pages/ShopPage.vue") }],
    meta: { requiresAuth: true },
  },
  {
    path: "/product/:id",
    component: () => import("layouts/MainPageLayout.vue"),
    props: true,
    children: [
      { path: "", component: () => import("pages/ProductDetail.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [{ path: "", component: () => import("pages/UserProfile.vue") }],
    meta: { requiresAuth: true },
  },
  {
    path: "/userprofile",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [
      { path: "", component: () => import("pages/UserProfileEdit.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/userforgetpassword",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [
      { path: "", component: () => import("pages/UserForgetPassword.vue") },
    ],
    meta: { requiresAuth: true },
  },
  {
    path: "/cart",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [{ path: "", component: () => import("pages/CartPage.vue") }],
    meta: { requiresAuth: true },
  },
  {
    path: "/history",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [{ path: "", component: () => import("pages/UserHistory.vue") }],
    meta: { requiresAuth: true },
  },
  {
    path: "/orderdetails",
    component: () => import("layouts/MainPageLayout.vue"),
    children: [
      { path: "", component: () => import("pages/UserOrderDetails.vue") },
    ],
    meta: { requiresAuth: true },
  },
  //guest
  {
    path: "/gmain",
    component: () => import("layouts/GuestMainLayout.vue"),
    children: [{ path: "", component: () => import("pages/MainGuest.vue") }],
  },
  {
    path: "/gshop",
    component: () => import("layouts/GuestMainLayout.vue"),
    children: [{ path: "", component: () => import("pages/GuestShop.vue") }],
  },
  {
    path: "/gproduct/:id",
    component: () => import("layouts/GuestMainLayout.vue"),
    props: true,
    children: [
      { path: "", component: () => import("pages/GuestProductDetails.vue") },
    ],
    // meta: { requiresAuth: true },
  },

  {
    path: "/admin",
    component: () => import("pages/AdminLoginPage.vue"),
  },
  {
    path: "/adminmain",
    component: () => import("layouts/AdminLayout.vue"),
    children: [{ path: "", component: () => import("pages/AdminMain.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/adminshop",
    component: () => import("layouts/AdminLayout.vue"),
    children: [{ path: "", component: () => import("pages/AdminShop.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/aproduct/:id",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminProductdetails.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/adminprofile",
    component: () => import("layouts/AdminLayout.vue"),
    children: [{ path: "", component: () => import("pages/AdminProfile.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admineditprofile",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminEditProfile.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admincart",
    component: () => import("layouts/AdminLayout.vue"),
    children: [{ path: "", component: () => import("pages/AdminCart.vue") }],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/addproduct",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminAddProduct.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/editproduct/:id",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminEditProduct.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admindash",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminDashboard.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/adminedituser",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminEditUser.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: "/admincheck",
    component: () => import("layouts/AdminLayout.vue"),
    children: [
      { path: "", component: () => import("pages/AdminCheckStatus.vue") },
    ],
    meta: { requiresAuth: true, requiresAdmin: true },
  },
];

export default routes;
