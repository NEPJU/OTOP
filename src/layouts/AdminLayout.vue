<template>
  <q-layout view="hHh lpR fFf" class="bg">
    <div>
      <q-header elevated class="bg-brown-8">
        <q-toolbar>
          <q-space />

          <div class="YL__toolbar-input-container row no-wrap">
            <q-input
              dense
              outlined
              square
              v-model="search"
              placeholder="ค้นหาผลิตภัณฑ์ได้ที่นี่"
              class="bg-white col"
            />
            <q-btn
              class="YL__toolbar-input-btn"
              color="grey-3"
              text-color="grey-8"
              icon="search"
              unelevated
            />
            <q-btn text-color="white" icon="shopping_cart" unelevated />
          </div>

          <q-space />

          <div class="q-gutter-sm row items-center no-wrap">
            <q-btn color="white" flat>
              ADMIN

              <q-tooltip>Account</q-tooltip>
              <q-menu>
                <q-list style="min-width: 100px">
                  <router-link
                    to="/adminprofile"
                    style="text-decoration: none; color: black"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>โปรไฟล์</q-item-section>
                    </q-item>
                  </router-link>
                  <router-link
                    to="/admincart"
                    style="text-decoration: none; color: black"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>ผลิตภัณฑ์</q-item-section>
                    </q-item>
                  </router-link>
                  <router-link
                    to="/admincheck"
                    style="text-decoration: none; color: black"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>การชำระเงิน</q-item-section>
                    </q-item>
                  </router-link>
                  <router-link
                    to="/admindash"
                    style="text-decoration: none; color: black"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>แดชบอร์ด</q-item-section>
                    </q-item>
                  </router-link>
                  <q-item clickable v-close-popup @click="handleLogout">
                    <q-item-section style="color: red"
                      >ออกจากระบบ</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </q-toolbar>
      </q-header>
    </div>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";
import { fabYoutube } from "@quasar/extras/fontawesome-v6";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";

const user = ref("Login");
const isLoggedIn = ref(true); // ตั้งค่าเป็น true เพื่อให้มีการเช็คสถานะเข้าสู่ระบบ

export default {
  name: "MyLayout",

  setup() {
    const leftDrawerOpen = ref(false);
    const search = ref("");
    const router = useRouter();
    const route = useRoute();

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    const handleLogout = () => {
      Swal.fire({
        title: "คุณต้องการออกจากระบบใช่หรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "ยกเลิก",
        confirmButtonText: "ใช่, ออกจากระบบ!",
      }).then((result) => {
        if (result.isConfirmed) {
          sessionStorage.clear(); // ลบข้อมูล session
          isLoggedIn.value = false; // ตั้งค่าเป็น false เมื่อออกจากระบบ
          user.value = {}; // รีเซ็ตข้อมูลผู้ใช้
          Swal.fire("ออกจากระบบ", "คุณได้ออกจากระบบเสร็จสิ้น", "success");
          router.push("/"); // นำผู้ใช้กลับไปยังหน้าหลัก
        }
      });
    };

    return {
      fabYoutube,
      leftDrawerOpen,
      search,
      user,
      toggleLeftDrawer,
      handleLogout,
    };
  },
};
</script>

<style lang="sass">
.YL

  &__toolbar-input-container
    min-width: 100px
    width: 55%

  &__toolbar-input-btn
    border-radius: 0
    border-style: solid
    border-width: 1px 1px 1px 0
    border-color: rgba(0,0,0,.24)
    max-width: 60px
    width: 100%

  &__drawer-footer-link
    color: inherit
    text-decoration: none
    font-weight: 500
    font-size: .75rem

    &:hover
      color: #000
</style>
