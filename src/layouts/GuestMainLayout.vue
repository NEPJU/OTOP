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
            <q-btn flat>
              <q-avatar size="26px">
                <img src="https://cdn.quasar.dev/img/boy-avatar.png" />
              </q-avatar>
              Login

              <q-tooltip>Account</q-tooltip>
              <q-menu>
                <q-list style="min-width: 100px">
                  <router-link
                    to="/login"
                    style="text-decoration: none; color: black"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>Login</q-item-section>
                    </q-item>
                  </router-link>
                  <router-link
                    to="/register"
                    style="text-decoration: none; color: black"
                  >
                    <q-item clickable v-close-popup>
                      <q-item-section>Register</q-item-section>
                    </q-item>
                  </router-link>
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

const user = ref("Login");

export default {
  name: "MyLayout",

  setup() {
    const leftDrawerOpen = ref(false);
    const search = ref("");

    function toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    }

    return {
      fabYoutube,
      leftDrawerOpen,
      search,
      user,
      toggleLeftDrawer,
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
