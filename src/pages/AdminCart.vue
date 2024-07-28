<template>
  <div>
    <div class="row">
      <div class="col-1 bgside"></div>
      <div class="col-10 bgcenter">
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
        <div>
          <p style="padding-top: 45px; padding-left: 45px; font-size: 24px"></p>
        </div>

        <div class="row">
          <div class="col-1"></div>
          <div class="col-10">
            <div class="row justify-center" style="margin-bottom: 15px">
              <input
                v-model="searchTerm"
                placeholder="ค้นหาผลิตภัณฑ์"
                dense
                class="search-input"
                style="border: 1px solid; padding: 8px 16px; font-size: 14px"
              />
            </div>

            <q-card>
              <div class="row" style="padding: 15px">
                <div class="col-4">จำนวน</div>
                <div class="col-6">ผลิตภัณฑ์</div>
                <div class="col-1">ราคา</div>
              </div>
            </q-card>

            <br />

            <q-card>
              <div
                style="
                  padding: 50px 50px 50px 15px;
                  text-align: center;
                  font-size: 25px;
                "
              >
                เพิ่มผลิตภัณฑ์
                <router-link to="/addproduct">
                  <q-btn
                    ><q-icon name="add" color="primary" @click="addProduct"
                  /></q-btn>
                </router-link>
              </div>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>

        <div class="row" style="margin-top: 20px">
          <div class="col-1"></div>
          <div class="col-10">
            <q-card
              v-for="product in filteredProducts"
              :key="product.ProductID"
              style="margin-top: 10px"
            >
              <div class="row" style="padding: 15px">
                <div class="col-4">
                  <p style="color: black">
                    {{ product.ProductID }}.
                    {{ product.ProductName }}
                    <br />
                    #{{ product.ProductCategory }}
                  </p>
                </div>
                <div class="col-6">
                  <div class="row">
                    <div class="col-md-4">
                      <img
                        :src="product.ProductImage"
                        alt="Product Image"
                        class="productimage"
                      />
                    </div>
                    <div class="col-md">
                      ผลิตภัณฑ์คงเหลือ {{ product.ProductQuantity }} <br />
                      ราคา {{ product.ProductPrice }} บาท
                      <p class="ellipsis">
                        รายละเอียดสินค้า {{ product.ProductDescription }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-2">
                  <div>
                    <q-btn color="green" @click="openEditDialog(product)">
                      <q-icon name="edit"></q-icon>
                    </q-btn>
                    <q-btn
                      color="red"
                      @click="deleteProduct(product.ProductID)"
                    >
                      <q-icon name="delete"></q-icon>
                    </q-btn>
                  </div>
                </div>
              </div>
            </q-card>
          </div>
          <div class="col-1"></div>
        </div>
        <div
          class="justify-center"
          style="display: flex; padding-bottom: 15px; margin-top: 15px"
        >
          <q-btn @click="link" color="red" label="กลับหน้าหลัก" />
        </div>
      </div>

      <div class="col-1 bgside"></div>
    </div>

    <q-dialog v-model="isEditDialogOpen">
      <q-card style="width: 500px">
        <q-card-section>
          <div class="text-h6">แก้ไขผลิตภัณฑ์</div>
        </q-card-section>
        <q-card-section>
          <div style="justify-content: center; display: flex">
            <img
              :src="editProductForm.ProductImage"
              alt="Product Image"
              class="productimage q-mb-md"
            />
          </div>
          <q-input v-model="editProductForm.ProductName" label="Product Name" />
          <q-input
            v-model="editProductForm.ProductDescription"
            label="Description"
          />
          <q-input v-model="editProductForm.ProductPrice" label="Price" />
          <q-input v-model="editProductForm.ProductQuantity" label="Quantity" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="editProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import Swal from "sweetalert2";

export default {
  setup() {
    const router = useRouter();
    const products = ref([]);
    const searchTerm = ref("");

    const isEditDialogOpen = ref(false);
    const editProductForm = ref({
      ProductID: "",
      ProductName: "",
      ProductDescription: "",
      ProductPrice: "",
      ProductQuantity: "",
      ProductCategory: "",
    });

    const link = () => {
      router.push("/adminmain");
    };

    const addProduct = () => {
      router.push("/addproduct");
    };

    const filterProducts = (event) => {
      searchTerm.value = event.target.value.trim();
    };

    const fetchData = () => {
      axios
        .get("http://localhost:3000/products")
        .then((response) => {
          products.value = response.data;
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    };

    onMounted(fetchData);

    const filteredProducts = computed(() => {
      if (!searchTerm.value) {
        return products.value;
      } else {
        const searchTermLowerCase = searchTerm.value.toLowerCase();
        return products.value.filter((product) => {
          const productNameLowerCase = product.ProductName.toLowerCase();
          const productId = product.ProductID.toString();
          return (
            productNameLowerCase.includes(searchTermLowerCase) ||
            productId.includes(searchTermLowerCase)
          );
        });
      }
    });

    const openEditDialog = (product) => {
      editProductForm.value = { ...product };
      isEditDialogOpen.value = true;
    };

    const editProduct = async () => {
      try {
        await axios.put(
          `http://localhost:3000/products/${editProductForm.value.ProductID}`,
          editProductForm.value
        );
        fetchData();
        isEditDialogOpen.value = false;
        Swal.fire("Success", "Product updated successfully", "success");
      } catch (error) {
        console.error("Error updating product:", error);
        Swal.fire(
          "Error",
          "An error occurred while updating the product",
          "error"
        );
      }
    };

    const deleteProduct = async (ProductID) => {
      try {
        const result = await Swal.fire({
          title: "ต้องการที่จะลบผลิตภัณฑ์ใช่หรือไม่?",
          text: "เมื่อลบแล้วข้อมูลจะหายไป",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "ลบข้อมูล",
          cancelButtonText: "ยกเลิก",
        });

        if (result.isConfirmed) {
          await axios.delete(`http://localhost:3000/products/${ProductID}`);
          products.value = products.value.filter(
            (product) => product.ProductID !== ProductID
          );
          Swal.fire(
            "ทำการลบข้อมูลเสร็จสิ้น!",
            "ข้อมูลผลิตภัณฑ์ถูกลบ",
            "success"
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire(
          "Error!",
          "An error occurred while deleting the product.",
          "error"
        );
      }
    };

    return {
      link,
      searchTerm,
      filterProducts,
      filteredProducts,
      addProduct,
      isEditDialogOpen,
      editProductForm,
      openEditDialog,
      editProduct,
      deleteProduct,
    };
  },
};
</script>

<style>
.bgside {
  background-image: url("/src/assets/logo/bgside.png");
}

.bgcenter {
  min-height: 100vh;
  background-color: bisque;
}

.productimage {
  max-width: 100px;
}

.q-dialog {
  max-width: 6000px;
}

.q-card-section {
  text-align: center;
}

.q-dialog-button-group {
  display: flex;
  justify-content: center;
}

.q-btn {
  margin: 0 10px;
}

.q-dialog-content {
  padding: 20px;
}

.q-input {
  margin-bottom: 10px;
}

.q-field label {
  font-weight: bold;
}
</style>
