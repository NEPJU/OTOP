<template>
  <div class="bg window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <!-- <h5 class="text-h5 text-white q-my-md"><img src="../assets/logo/otop.png" alt=""></h5> -->
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <img class="logo" src="../assets/logo/otop.png" alt="" /><br />
            <q-form class="q-gutter-md">
              <q-input
                v-model="username"
                color="black"
                type="username"
                label="ชื่อผู้ใช้งาน"
              />
              <q-input
                v-model="password"
                color="black"
                type="password"
                label="รหัสผ่าน"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="green"
              size="15px"
              class="full-width"
              label="ลงชื่อเข้าใช้"
              @click="login"
            />
          </q-card-actions>

          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="blue-10"
              size="15px"
              class="full-width"
              label="สมัครสมาชิก"
              @click="link"
            />
          </q-card-actions>

          <q-card-section class="text-center q-pa-none">
            <div class="linkto">
              <!-- <a href="#" data-replace="ลืมรหัสผ่าน"
                ><span>ลืมรหัสผ่าน</span></a
              > -->
              <!-- <br /> -->
              <a href="/" data-replace="ย้อนกลับ"><span>ย้อนกลับ</span></a>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import Swal from "sweetalert2";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();

const username = ref();
const password = ref();

const doSomething = () => {
  Swal.fire({
    title: "เข้าสู่ระบบสำเร็จ",
    text: "ยินดีต้อนรับสู่ OTOP PHAYAO",
    icon: "success",
  });
};

const LoginError = () => {
  Swal.fire({
    title: "เข้าไม่สู่ระบบสำเร็จ",
    text: "กรุณาตรวจสอบชื่อผู้เข้าใช้งาน และรหัสผ่าน",
    icon: "error",
  });
};

const login = () => {
  let data = {
    username: username.value,
    password: password.value,
  };
  console.log(data);
  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: "http://localhost:3000/login",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  axios
    .request(config)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      doSomething();

      // ตรวจสอบ role เพื่อพาผู้ใช้ไปยังหน้าที่เหมาะสม
      if (response.data.role === "admin") {
        router.push("/adminshop");
      } else {
        router.push("/shop");
      }

      // เก็บข้อมูล session
      sessionStorage.setItem("userId", response.data.userId);
      sessionStorage.setItem("username", response.data.username);
      sessionStorage.setItem("role", response.data.role);
      sessionStorage.setItem("token", response.data.token);
    })
    .catch((error) => {
      console.log(error);
      LoginError();
    });
};

const link = () => {
  router.push("/register");
};
</script>

<style>
.q-card {
  width: 550px;
}

.logo {
  width: 260px;
  margin: auto auto;
  display: block;
  padding: 10px;
}

.bg {
  background-image: url("../assets/logo/bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.linkto {
  color: #000;
  text-align: center;
  /* margin-top: 23px; */
  font: 14px/32px Inter, sans-serif;
}

.linkto a {
  overflow: hidden;
  position: relative;
  display: inline-block;
  text-decoration: none;
  color: #18272f;
  font-weight: 700;
  vertical-align: top;
}

.linkto a::before,
a::after {
  content: "";
  position: absolute;
  width: 100%;
  left: 0;
}

.linkto a::before {
  background-color: #f44336;
  height: 2px;
  bottom: 0;
  transform-origin: 100% 50%;
  transform: scaleX(0);
  transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
}

.linkto a::after {
  content: attr(data-replace);
  height: 100%;
  top: 0;
  transform-origin: 100% 50%;
  transform: translate3d(200%, 0, 0);
  transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
  color: #f44336;
}

.linkto a:hover::before {
  transform-origin: 0% 50%;
  transform: scaleX(1);
}

.linkto a:hover::after {
  transform: translate3d(0, 0, 0);
}

.linkto a span {
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.76, 0, 0.24, 1);
}

.linkto a:hover span {
  transform: translate3d(-200%, 0, 0);
}
</style>
