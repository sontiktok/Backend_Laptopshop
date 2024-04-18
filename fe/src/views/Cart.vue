<template>
    <div class="h-full bg-gray-100 pt-20">
        <h1 class="mb-10 text-center text-2xl font-bold">Giỏ hàng của bạn</h1>
        <div class="mx-auto justify-center px-6 md:flex md:space-x-6 xl:px-0">
            <div class="rounded-lg md:w-2/3">
                <div v-if="listProduct.length != 0">
                    <div class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start"
                        v-for="item in listProduct" :key="item">
                        <img :src="`http://localhost:3000/images/${item.image}`" alt="product-image" class="rounded-lg sm:w-[150px] h-auto" />
                        <div class="sm:ml-4 sm:flex sm:w-full sm:justify-between gap-10">
                            <div class="mt-5 sm:mt-0">
                                <h2 class="text-lg font-bold text-gray-900">{{ item.name }}</h2>
                                <p class="mt-1 text-xs text-gray-700">{{ item.description }}</p>
                            </div>
                            <div class="mt-4 flex justify-between sm:space-y-6 sm:mt-0 sm:block sm:space-x-6">
                                <div class="flex items-center border-gray-100">
                                    <span
                                        class="cursor-pointer rounded-l bg-gray-100 py-1 px-3.5 duration-100 hover:bg-blue-500 hover:text-blue-50"
                                        @click="subItem(item.productId)">
                                        - </span>
                                    <input class="h-8 w-10 border bg-white text-center text-sm outline-none p-0" type="number"
                                        :placeholder="item.quantity" :value="item.quantity" />
                                    <span
                                        class="cursor-pointer rounded-r bg-gray-100 py-1 px-3 duration-100 hover:bg-blue-500 hover:text-blue-50"
                                        @click="addItem(item.productId)">
                                        + </span>
                                </div>
                                <div class="flex items-center space-x-4">
                                    <p class="text-sm">{{formatNumber(item.price) }}đ</p>
                                    <svg @click="deleteItem(item.id)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor"
                                        class="h-5 w-5 cursor-pointer duration-150 hover:text-red-500">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">Không có sản phẩm</div>
            </div>
            <!-- Sub total -->
            <div class="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                <div class="mb-2 flex justify-between">
                    <p class="text-gray-700">Tạm tính</p>
                    <p class="text-gray-700">{{ formatNumber(total) }}đ</p>
                </div>
                <div class="flex justify-between">
                    <p class="text-gray-700">Vận chuyển</p>
                    <p class="text-gray-700">{{ formatNumber(60000) }}đ</p>
                </div>
                <hr class="my-4" />
                <div class="flex justify-between">
                    <p class="text-lg font-bold">Tổng</p>
                    <div class="">
                        <p class="mb-1 text-lg font-bold">{{ formatNumber(total + 60000) }}đ</p>
                        <p class="text-sm text-right text-gray-700">VAT</p>
                    </div>
                </div>
                <button class="mt-6 w-full rounded-md bg-blue-500 py-1.5 font-medium text-blue-50 hover:bg-blue-600"
                    @click="checkOut">
                    Đặt hàng
                </button>
            </div>
        </div>
    </div>

</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            listProduct: [],
            total: 0,
        };
    },
    mounted() {
        this.getCart();
    },
    methods: {
        async getCart() {
            // Lấy token từ localStorage
            const token = localStorage.getItem('token');

            // Tạo header Authorization
            const headers = {
                Authorization: `Bearer ${token}`
            };

            // Gửi GET request với Axios
            axios.get('http://localhost:3000/order/cart', { headers })
                .then(response => {
                    this.listProduct = response.data.data;
                    this.listProduct.forEach((i) => {
                        this.total += i.price * i.quantity;
                    })
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        },
        async retotal() {
            this.total = 0;
            await this.listProduct.forEach((i) => {
                this.total += i.price * i.quantity;
            })
        },
        async addItem(id) {
            await this.listProduct.forEach((product) => {
                if (product.productId === id) {
                    if (product.quantity >= 100) {
                        alert('reach limit product')

                        return;
                    }
                    product.quantity += 1;
                    this.updateQuantity(id, product.quantity)
                }
            })
            await this.retotal();
        },
        async subItem(id) {
            await this.listProduct.forEach((product) => {
                if (product.productId === id) {
                    if (product.quantity == 1) {
                        alert('Can not decrease anymore')

                        return;
                    }
                    product.quantity -= 1;
                    this.updateQuantity(id, product.quantity)
                }
            })
            await this.retotal();

            
        },
        async updateQuantity(id, quantity) {
            const token = localStorage.getItem('token');
            // Tạo header Authorization
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const data = {
                product_id:  id,
                quantity: quantity,
            }
            // Gửi GET request với Axios
            axios.post('http://localhost:3000/cart/update-quantity', data, { headers })
                .then(response => {
                    if (response.status == 200) {
                        console.log(response.data.message)
                        this.showToast('success', response.data.message)
                    }
                })
                .catch(error => {
                    console.error('Error update data:', error);
                    this.showToast('error', 'Error update data')
                });
        },

        async deleteItem(id) {
            const token = localStorage.getItem('token');
            // Tạo header Authorization
            const headers = {
                Authorization: `Bearer ${token}`
            };
            const data = {
                id: id
            };
            // Gửi GET request với Axios
            axios.post('http://localhost:3000/cart/delete', data, { headers })
                .then(response => {
                    if (response.status == 200) {
                        console.log(response.data.message)
                        this.showToast('success', response.data.message)
                    }
                })
                .catch(error => {
                    console.error('Error delete data:', error);
                    this.showToast('error', 'Error delete data')
                });
            location.reload()
        },

        async checkOut() {
            try {
                const data = {
                    listProduct: this.listProduct,
                    total: this.total
                };
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:3000/order/cart', data, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Response:', response.data);
                window.location.reload();
                return response.data;
            } catch (error) {
                console.error('Order failed:', error);
                this.showToast('error', 'Error update')
                return null;
            }
        },

        formatNumber(number) {
			// Convert number to string and split it into groups of three digits from the end
			let parts = String(number).split('').reverse().join('').match(/\d{1,3}/g);

			// Join the groups with dots and reverse the string
			return parts.join('.').split('').reverse().join('');
		},

        showToast(type, message) {
        this.toastInstance = this.$toast.open({
            message: message,
            type: type,
            position: 'top',
            duration: 2500
        });
        },

        clearToast() {
        this.$toast.clear()
        },
    }
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>