<script setup>
import DatetimePicker from "@/components/DatetimePicker.vue"
import axios from "axios"
import { onMounted, ref } from "vue"
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toast-notification'

const route = useRoute()

const data = ref({})
const baseBeUrl = 'http://localhost:3000/images'
const amount = ref(1)
const comment = ref('')
const comments = ref([])

// get data for rendering
onMounted(() => {
	let itemId = route.params.id
	getComments(itemId)
	axios.get(`http://localhost:3000/product/get-by-id/${itemId}`)
		.then((response) => {
			data.value = response.data.data
		})
		.catch((error) => {
			alert(error)
		})
})

const addCart = (async (id) => {
	const token = localStorage.getItem('token');

	// Tạo header Authorization
	const headers = {
		Authorization: `Bearer ${token}`
	};

	const data = {
	product_id:  id,
	quantity: amount.value,
	}

	// Gửi GET request với Axios
	axios.post('http://localhost:3000/cart/create', data, { headers })
		.then(response => {
			if (response.status == 201) {
				console.log(response.data.message)
				showToast(response.data.message, 'success')
			}
		})
		.catch(error => {
			console.error('Error create data:', error);
		});
	amount.value = 1
})

const addComment = (async (id) => {
	const token = localStorage.getItem('token');

	// Tạo header Authorization
	const headers = {
		Authorization: `Bearer ${token}`
	};

	const data = {
		productId: id,
		content: comment.value
	}

	// Gửi GET request với Axios
	axios.post('http://localhost:3000/comment/create', data, { headers })
		.then(response => {
			if (response.status == 200) {
				comment.value = ''
				getComments(id)
				showToast(response.data.message, 'success')
			}
		})
		.catch(error => {
			console.error('Error create data:', error);
			showToast('Error create data', 'error')
		});
})

const getComments = (async (productId) => {
	const token = localStorage.getItem('token');
	// Tạo header Authorization
	const headers = {
		Authorization: `Bearer ${token}`
	};

	// Gửi GET request với Axios
	axios.get(`http://localhost:3000/comment/comment-product/${productId}`, { headers })
		.then(response => {
			if (response.status == 200) {
				comments.value = response.data.data
			}
		})
		.catch(error => {
			console.error('Error create data:', error);
			alert(error)
		});
})

const formatNumber = ((number) => {
  // Convert number to string and split it into groups of three digits from the end
  let parts = String(number).split('').reverse().join('').match(/\d{1,3}/g);

  // Join the groups with dots and reverse the string
  return parts.join('.').split('').reverse().join('');
})

const notification = ref(null)
const $toast = useToast();
const showToast = (message, type) => {
  notification.value = type === 'success' ? $toast.success(message, {
    position: 'top-right',
    duration: 3000
  }) : $toast.error(message, {
    position: 'top-right',
    duration: 3000
  });
}
</script>

<template>
  	<section class = "w-full lg:mt-14">
		<div class = "md:px-10 xl:px-44 py-3 lg:py-6 lg:ml-28">
			<div class="flex lg:hidden space-x-2 p-2">
				<div class = " overflow-hidden cursor-pointer">
					<img class="rounded-lg h-auto lg:h-full hover:scale-110 hover:opacity-90 cursor-pointer delay-150 ease-in-out transition-all duration-1000 object-cover" :src="`${baseBeUrl}/${data.image}`" alt="">
				</div>
				<div class = " overflow-hidden cursor-pointer">
					<img class="rounded-lg h-auto lg:h-full hover:scale-110 hover:opacity-90 cursor-pointer delay-150 ease-in-out transition-all duration-1000 object-cover" :src="`${baseBeUrl}/${data.image}`" alt="">
				</div>
			</div>
			<div class="hidden lg:flex space-x-2 mt-2 p-2">
				<div class = "grid grid-cols-4 gap-2">
					<div class = "overflow-hidden cursor-pointer">
						<img class="rounded-lg object-cover h-full hover:scale-110 hover:opacity-90 cursor-pointer delay-150 ease-in-out transition-all duration-1000" :src="`${baseBeUrl}/${data.image}`" alt="">
					</div>
					<div class = "overflow-hidden cursor-pointer">
						<img class="rounded-lg object-cover h-full hover:scale-110 hover:opacity-90 cursor-pointer delay-150 ease-in-out transition-all duration-1000" :src="`${baseBeUrl}/${data.image}`" alt="">
					</div>
					<div class = "overflow-hidden cursor-pointer">
						<img class="rounded-lg object-cover h-full hover:scale-110 hover:opacity-90 cursor-pointer delay-150 ease-in-out transition-all duration-1000" :src="`${baseBeUrl}/${data.image}`" alt="">
					</div>
					<div class = "overflow-hidden cursor-pointer">
						<img class="rounded-lg object-cover h-full hover:scale-110 hover:opacity-90 cursor-pointer delay-150 ease-in-out transition-all duration-1000" :src="`${baseBeUrl}/${data.image}`" alt="">
					</div>
				</div>
			</div>
			<div class = "lg:mt-4 p-2  lg:p-4">
				<div class = " grid lg:grid-cols-3 max-w-screen-xl sm:gap-2 lg:gap-12">
					<div class = "lg:col-span-2">
						<hr class=" mt-4 mb-4">
						<div class=" lg:px-5">
							<h2 class=" text-xl font-bold">{{ data.name }}</h2>
							<div class="p-4">
								<div class=" grid grid-cols-1 lg:grid-cols-2 gap-4">
									<div class=" space-y-1">
										<div class=" flex">
											<font-awesome-icon class="text-xl mr-3" icon="fa-regular fa-check-square" />
											<span>Mô tả:</span>
										</div>
										<div class=" ml-8 text-md">
											<span>{{ data.description }}</span>
										</div>
									</div>
									<div>
										<div class=" flex">
											<font-awesome-icon class="text-xl mr-3" icon="fa-regular fa-check-square" />
											<span>GIÁ</span>
										</div>
										<div class=" ml-8 text-sm">
											<span class="font-bold text-lg tracking-wide text-red-500">{{ formatNumber(data.price ?? 0) }}đ</span>
            								<p class="font-bold tracking-wide text-gray-500 line-through">25.000.000đ</p>
										</div>
									</div>
								</div>
							</div>
						</div>
						<hr class="mt-4 mb-4">
						<div class = "block sm:w-[50%] lg:hidden border-2 mt-4 space-y-5 h-fit shadow-md rounded-xl p-4 lg:p-6">
							<div class=" ml-2 flex flex-col">
								<div class=" grid grid-cols-2 lg:gap-4 gap-1">
									<div class=" flex flex-col">
										<span>Số lượng</span>
									</div>
									<div class=" border-2 flex p-2 justify-between">
										<font-awesome-icon @click="amount += 1" class="text-xl ml-3 cursor-pointer" icon="fa-solid fa-plus" />
										<span class="select-none">{{ amount }}</span>
										<font-awesome-icon @click="amount == 1 ? amount : amount -= 1" class="text-xl mr-3 cursor-pointer" icon="fa-solid fa-minus" />
									</div>
								</div>
							</div>
							<hr>
							<div click="addCart(data.id)" class="flex bg-green-400 justify-center">
								<button class="text-white py-2">Mua ngay</button>
							</div>
						</div>
						<hr class="mt-4 mb-4">
						<div class=" lg:px-5">
							<div>
								<h2 class=" text-xl font-medium">Đánh giá</h2>
							</div>
							<!-- <div class="flex space-x-2">
								<div class = "flex items-center">
									<svg v-for="i in 5" :key="i" class="block h-5 w-5" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
								</div>
								<div>
									<span class = "">
										4.8 (19 Đánh Giá)
									</span>
								</div>
							</div> -->
							<div class="grid grid-cols-1 max-w-full mt-4 gap-4">
								<div class = " bg-gray-200 p-6 rounded-xl text-white" v-for="item in comments" :key="item.id">
									<div class=" flex items-center space-x-5">
										<font-awesome-icon class = "" icon="fa-solid fa-user" />
										<span class = "text-black">{{ item.user.username }}</span>
										<div class="flex bg-white p-2 rounded-xl">
											<p class="text-black">{{ item.content }}</p>
											<!-- <svg v-for="i in 5" :key="i" class="block h-5 w-5" fill="gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg> -->
										</div>
									</div>
								</div>
							</div>

							<div class="mt-2">
								<label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Đánh giá của bạn</label>
								<textarea 
									id="message" 
									rows="4" 
									class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 
										focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
										dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
									placeholder="Nhận xét"
									v-model="comment"
								></textarea>
							</div>
							<button 
								@click="addComment(data.id)"
								type="button" 
								class="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
								Gửi
							</button>
						</div>
						<hr class="mb-4 mt-4">
					</div>
					<div class = "hidden lg:block border-2 mt-4 space-y-5 h-fit shadow-md rounded-xl p-4 lg:p-6">
						<div class=" ml-2 flex flex-col">
							<div class=" grid grid-cols-2 lg:gap-4 gap-1">
								<div class=" flex flex-col">
									<span>Số lượng</span>
								</div>
								<div class=" border-2 flex p-2 justify-between">
									<font-awesome-icon @click="amount += 1" class="text-xl ml-3 cursor-pointer" icon="fa-solid fa-plus" />
									<span class="select-none">{{ amount }}</span>
									<font-awesome-icon @click="amount == 1 ? amount : amount -= 1" class="text-xl mr-3 cursor-pointer" icon="fa-solid fa-minus" />
								</div>
							</div>
						</div>
						<hr>
						<div @click="addCart(data.id)" class="flex bg-green-400 justify-center">
							<button class="text-white py-2">Mua ngay</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>