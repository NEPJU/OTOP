<template>
  <div class="order-details">
    <q-card v-if="orderItems.length" class="q-ma-md">
      <q-card-section>
        <h6>Order ID: {{ orderId }}</h6>
        <q-table
          :rows="orderItems"
          :columns="columns"
          row-key="item_id"
          class="q-mb-md"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name">
                {{ props.row[col.name] }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
    <q-spinner v-else color="primary" />
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["orderId"],
  data() {
    return {
      orderItems: [],
      columns: [
        {
          name: "item_id",
          label: "Item ID",
          align: "left",
          field: (row) => row.item_id,
        },
        {
          name: "item_name",
          label: "Item Name",
          align: "left",
          field: (row) => row.item_name,
        },
        {
          name: "quantity",
          label: "Quantity",
          align: "right",
          field: (row) => row.quantity,
        },
        {
          name: "price",
          label: "Price",
          align: "right",
          field: (row) => row.price,
        },
      ],
    };
  },
  async created() {
    if (!this.orderId) {
      console.error("Order ID is not defined");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3000/order-items/${this.orderId}`
      );
      this.orderItems = response.data;
    } catch (error) {
      console.error("Error fetching order items:", error);
    }
  },
};
</script>

<style scoped>
.order-details {
  padding: 20px;
}
</style>
