<template lang="">
  <div style="margin-top: 45px">
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <div>
          <!-- <p style="font-size: 35px">โปรไฟล์</p> -->
          <q-card
            class="my-card"
            bordered
            style="padding-bottom: 25px; padding-top: 15px"
          >
            <div style="text-align: center; font-size: 35px">ยินดีต้อนรับ</div>
            <div style="text-align: center; font-size: 16px">คุณ SOMEONE</div>
            <div style="text-align: center; font-size: 16px">
              ชื่อ สมหมี อยากกินไข่เจียว
            </div>
            <div style="text-align: center; font-size: 16px">
              อีเมล awrgdrg@gmail.com
            </div>
          </q-card>
        </div>
        <div>
          <p style="padding-top: 45px; padding-left: 45px; font-size: 24px"></p>
        </div>
        <q-card bordered style="padding-bottom: 35px; padding-top: 25px">
          <div class="row">
            <div class="col-md-4"></div>
            <div class="col-md-4">
              <p style="font-size: 24px">เปลี่ยนรหัสผ่าน</p>
              รหัสผ่านใหม่
              <q-input
                standout
                class="inputpass"
                v-model="password"
                filled
                :type="isPwd ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              ยืนยันรหัสผ่านใหม่
              <q-input
                class="inputpass"
                v-model="password"
                filled
                :type="isPwd1 ? 'password' : 'text'"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd1 ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd1 = !isPwd1"
                  />
                </template>
              </q-input>
            </div>

            <div class="col-md-4"></div>
          </div>
          <div style="display: flex; justify-content: center">
            <q-btn color="red" class="save">บันทึก</q-btn
            ><q-btn color="red" class="save">ยกเลิก</q-btn>
          </div>
        </q-card>

        <div
          class="d-flex justify-center mt-4"
          style="margin: 15px; display: flex"
        >
          <q-btn
            @click="link"
            color="red"
            label="กลับหน้าหลัก"
            style="margin-top: 150px"
          />
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
    const isPwd = ref(true);
    const isPwd1 = ref(true);
    const router = useRouter();

    const link = () => {
      router.push("/user");
    };

    return {
      isPwd,
      isPwd1,
      link,
    };
  },
};
</script>
<style>
.col-1 {
  background-image: url("/src/assets/logo/bgside.png");
}

.col-10 {
  min-height: 100vh;
  background-color: bisque;
}

.save {
  margin-left: 5px;
  margin-right: 5px;
}

.inputpass {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
