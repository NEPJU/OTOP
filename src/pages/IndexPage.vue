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
          </q-card-section>
          <q-card-actions class="q-px-md">
            <!-- <router-link to="/gmain"> -->
            <q-btn
              unelevated
              color="red-5"
              size="lg"
              class="full-width"
              label="เข้าสู่เว็บไซต์"
              padding="13px
                "
              @click="linkTogmain"
            />
            <!-- </router-link> -->
          </q-card-actions>

          <q-card-section class="text-center q-pa-none">
            <div class="linkto">
              <a href="#/login" data-replace="เข้าสู่ระบบ"
                ><span>เข้าสู่ระบบ</span></a
              >
              <br />
              <a href="" data-replace="ลืมรหัสผ่าน"><span>ลืมรหัสผ่าน</span></a>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const linkTogmain = () => {
      router.push("/gmain");
    };

    return {
      linkTogmain,
    };
  },
};
</script>

<style>
.q-card {
  width: 450px;
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
