<template>
  <div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <div style="margin-top: 45px">
          <!-- <p style="font-size: 35px">โปรไฟล์</p> -->
          <q-card
            class="my-card"
            bordered
            style="padding-bottom: 25px; padding-top: 15px"
          >
            <div style="text-align: center; font-size: 35px">ยินดีต้อนรับ</div>
            <div style="text-align: center; font-size: 25px">ADMIN</div>
          </q-card>
        </div>

        <div style="margin-top: 20px">
          <q-card class="my-card" bordered>
            <div class="row">
              <div class="col-md-4">
                <div style="font-size: 25px; padding: 15px">ข้อมูลส่วนตัว</div>
              </div>
              <div class="col-md-4" style="padding: 15px; text-align: justify">
                <div style="font-size: 16px" class="infotext">คุณ SOMEONE</div>
                <div style="font-size: 16px" class="infotext">
                  ชื่อ สมหมี อยากกินไข่เจียว
                </div>
                <div style="font-size: 16px" class="infotext">
                  อีเมล awrgdrg@gmail.com
                </div>

                <div style="font-size: 16px" class="infotext">
                  เบอร์โทรศัพท์ 090-ปปป-ปปปป
                </div>
                <div
                  style="display: flex; justify-self: center; margin-top: 15px"
                  class="infotext"
                >
                  <router-link to="/admineditprofile">
                    <q-btn @click="linkedit" color="red"
                      >แก้ไขข้อมูล<q-icon name="edit" /></q-btn
                  ></router-link>
                </div>
              </div>
              <div class="col-md-4" style="padding: 15px">
                <div
                  style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                  "
                >
                  <q-img
                    src="/src/assets/IMG_5819.jpg"
                    style="
                      height: 250px;
                      width: 250px;
                      margin-bottom: 10px;
                      border-radius: 50%;
                    "
                  />
                </div>
              </div>
            </div>
          </q-card>
        </div>

        <div
          class="d-flex justify-center mt-4"
          style="margin: 15px; display: flex"
        >
          <q-btn @click="edituser" color="red" label="แก้ไขสมาชิก" />
        </div>

        <div
          class="d-flex justify-center mt-4"
          style="margin: 15px; display: flex"
        >
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
        </div>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const val = ref(true);
    const file = ref(null);

    const link = () => {
      router.push("/adminmain");
    };

    const edituser = () => {
      router.push("/adminedituser");
    };

    const linkedit = () => {
      router.push("/userprofile");
    };

    return {
      link,
      val,
      file,
      linkedit,
      edituser,
    };
  },
};
</script>

<style>
.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.col-10 {
  min-height: 100vh;
  background-color: #fce7d1;
}

.infotext {
  padding-bottom: 20px;
}

/* Other CSS styles... */
</style>
