<template>
  <q-layout view="hHh lpR fFf" class="bg">
    <q-header elevated class="bg-brown-8">
      <q-toolbar>
        <!-- Other toolbar content -->
        <q-space />
        <div class="YL__toolbar-input-container row no-wrap">
          <q-input
            dark
            dense
            standout
            placeholder="Search"
            color="black"
            :stack-label="false"
            v-model="text"
            style="width: 450px"
            @input="handleInputChange"
          />
          <q-btn
            class="YL__toolbar-input-btn"
            color="grey-3"
            text-color="grey-8"
            icon="clear"
            unelevated
            @click="clearSearch"
          />
          <router-link to="/cart">
            <q-btn
              text-color="white"
              icon="shopping_cart"
              unelevated
              @click="openCart"
            >
              <q-badge color="red" transparent floating>{{ count }}</q-badge>
            </q-btn>
          </router-link>
        </div>

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn>
            <q-avatar size="26px">
              <img :src="users.profileimg" />
            </q-avatar>
            &nbsp;&nbsp;&nbsp;{{ username }}
            <q-tooltip>จัดการโปรไฟล์</q-tooltip>
            <q-menu>
              <q-list style="min-width: 100px">
                <router-link
                  to="/user"
                  style="text-decoration: none; color: black"
                >
                  <q-item clickable v-close-popup>
                    <q-item-section>แก้ไขโปรไฟล์</q-item-section>
                  </q-item>
                </router-link>
                <router-link
                  to="/main"
                  style="text-decoration: none; color: black"
                >
                  <q-item clickable v-close-popup>
                    <q-item-section>กลับสู่หน้าหลัก</q-item-section>
                  </q-item>
                </router-link>
                <q-separator />
                <router-link
                  to="/cart"
                  style="text-decoration: none; color: black"
                >
                  <q-item clickable v-close-popup>
                    <q-item-section>ตระกร้าของฉัน</q-item-section>
                  </q-item>
                </router-link>
                <router-link
                  to="/history"
                  style="text-decoration: none; color: black"
                >
                  <q-item clickable v-close-popup>
                    <q-item-section>ประวัติการซื้อ</q-item-section>
                  </q-item>
                </router-link>
                <router-link
                  to="orderdetails"
                  style="text-decoration: none; color: black"
                >
                  <q-item clickable v-close-popup>
                    <q-item-section>คำสั่งซื้อ</q-item-section>
                  </q-item>
                </router-link>
                <q-separator />
                <router-link
                  to="/userforgetpassword"
                  style="text-decoration: none; color: black"
                >
                  <q-item clickable v-close-popup>
                    <q-item-section>เปลี่ยนรหัสผ่าน</q-item-section>
                  </q-item>
                </router-link>
                <q-item clickable v-close-popup @click="handleLogout">
                  <q-item-section style="color: red">ออกจากระบบ</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <router-view />
  </q-layout>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

export default {
  name: "MyLayout",
  setup() {
    const router = useRouter();
    const text = ref("");
    const user = ref({});
    const users = ref({});
    const userLoaded = ref(false);
    const isLoggedIn = ref(false);
    const token = ref(sessionStorage.getItem("token"));
    const username = ref("");
    const cartItems = ref([]);

    const count = computed(() => cartItems.value.length);

    const handleLogin = () => {
      router.push("/login");
    };

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
          sessionStorage.clear();
          isLoggedIn.value = false;
          user.value = {};
          users.value = {};
          userLoaded.value = false;
          Swal.fire("ออกจากระบบ", "คุณได้ออกจากระบบเสร็จสิ้น", "success");
          router.push("/");
        }
      });
    };

    const fetchUserData = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/user/${userId}`
          );
          users.value = response.data;
          userLoaded.value = true;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.error("No user ID found in session storage");
        router.push("/login");
      }
    };

    const fetchCartItems = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3000/cart/${userId}`
          );
          cartItems.value = response.data;
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      } else {
        console.error("No user ID found in session storage");
      }
    };

    const handleCartUpdate = async () => {
      await fetchCartItems();
    };

    onMounted(() => {
      const userId = sessionStorage.getItem("userId");
      username.value = sessionStorage.getItem("username");
      if (userId) {
        isLoggedIn.value = true;
        fetchUserData();
        fetchCartItems();
      } else {
        isLoggedIn.value = false;
      }
      // Listen for custom events to update the cart
      window.addEventListener("cart-updated", handleCartUpdate);
    });

    const handleInputChange = () => {
      // Implement your search logic here
    };

    const clearSearch = () => {
      text.value = "";
    };

    return {
      text,
      user,
      users,
      userLoaded,
      isLoggedIn,
      handleLogin,
      handleLogout,
      handleInputChange,
      clearSearch,
      username,
      count,
    };
  },
  beforeUnmount() {
    window.removeEventListener("cart-updated", handleCartUpdate);
  },
};
</script>

<style scoped>
.YL__toolbar-input-container {
  display: flex;
  align-items: center;
}

.YL__toolbar-input-btn {
  margin-left: 8px;
}
</style>
