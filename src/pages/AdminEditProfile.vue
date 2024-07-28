<template>
  <div>
    <div class="row">
      <div class="col-1"></div>
      <div class="col-10">
        <div style="margin-top: 45px">
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
                <div style="font-size: 25px; padding: 15px">
                  แก้ไขข้อมูลส่วนตัว
                </div>
              </div>
              <div class="col-md-4" style="padding: 15px; text-align: justify">
                <div style="justify-self: center; margin-top: 15px">
                  <p style="font-size: 25px; margin-top: 50px">ข้อมูลส่วนตัว</p>
                  <div>
                    <q-input
                      standout
                      label="ชื่อ"
                      stack-label
                      placeholder="สมหมี"
                      class="my-text custom-label-color"
                    />
                    <q-input
                      standout
                      v-model="ph"
                      label="สกุล"
                      stack-label
                      placeholder="อยากกินไข่เจียว"
                      class="my-text"
                    />
                    <q-input
                      standout
                      label="อีเมล"
                      stack-label
                      placeholder="awrgdrg@gmail.com"
                      class="my-text"
                    />

                    <q-input
                      standout
                      label="เบอร์โทรศัพท์"
                      class="my-text"
                      mask="### - ### - ####"
                    />
                  </div>
                  <div style="display: flex; justify-content: center">
                    <q-btn color="red" class="save">บันทึก</q-btn
                    ><q-btn color="red" class="save">ยกเลิก</q-btn>
                  </div>
                </div>
              </div>
              <div
                class="col-md-4"
                style="padding-top: 70px; margin-bottom: 45px"
              >
                <div style="justify-content: center; display: flex">
                  <canvas
                    ref="canvas"
                    style="
                      max-width: 100%;
                      border: 1px solid #ccc;
                      border-radius: 100%;
                    "
                  ></canvas>
                </div>
                <div style="justify-content: center; display: flex">
                  <small id="upload-hint" class="form-text text-muted"
                    >กรุณาอัปโหลดรูปภาพที่มีขนาด 300px x 300px
                    เพื่อให้แสดงผลได้อย่างถูกต้อง</small
                  >
                </div>
                <div
                  style="
                    justify-content: center;
                    display: flex;
                    margin-top: 15px;
                  "
                >
                  <input
                    type="file"
                    @change="handleFileUpload"
                    accept="image/*"
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
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
        </div>
      </div>
      <div class="col-1"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();
    const ph = ref("");
    const canvas = ref(null);

    const link = () => {
      router.push("/adminprofile");
    };

    const edituser = () => {
      router.push("/adminedituser");
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const ctx = canvas.value.getContext("2d");
          const imageSize = 300;
          ctx.clearRect(0, 0, imageSize, imageSize); // ลบรูปภาพเก่าทิ้ง
          ctx.drawImage(image, 0, 0, imageSize, imageSize); // วาดรูปภาพใหม่
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    };

    onMounted(() => {
      canvas.value.width = 300;
      canvas.value.height = 300;
    });

    return {
      link,
      ph,
      canvas,
      handleFileUpload,
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

.my-text {
  margin-top: 15px;
  margin-bottom: 15px;
}

.save {
  margin-left: 5px;
  margin-right: 5px;
}

.t1 {
  margin-left: 5px;
  margin-right: 5px;
}
</style>
