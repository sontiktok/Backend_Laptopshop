<template>
	<section style="margin: 0 1.25rem 0 1.25rem" class="sm:pr-5 sm:pl-5 lg:pr-28 lg:pl-28" id="item-list">
		<div class=" grid mt-28 lg:mt-44 grid-cols-1 lg:grid-cols-4 gap-x-6 gap-y-6 lg:gap-y-12">
			<div class="cursor-pointer shadow-md" v-for="(item, index) in listItem" :key="index" @click="navigate(item.id)">
				<img class=" rounded-lg" :src="'http://localhost:3000/images/' + item.image" />
				<div class="pro__place-title absolute mt-[-90px]">
					<p class="text-white font-semibold text-xs bg-red-500 w-max py-1 px-3 rounded-full">Thêm vào giỏ hàng</p>
				</div>
				<div class=" flex mt-2 px-2 space-x-1 items-center">
					<span class="text-md font-medium text-center">{{ item.name }}</span>
				</div>
				<div class=" flex px-2 items-center space-x-1">
					<svg width="18" height="18" fill="#ff0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25">
						<path
							d="M16.918 13.32a1.1 1.1 0 00-.319.97l.89 4.92a1.08 1.08 0 01-.45 1.08 1.1 1.1 0 01-1.17.08l-4.43-2.31a1.13 1.13 0 00-.5-.13h-.27a.812.812 0 00-.27.09l-4.43 2.32c-.22.11-.468.15-.71.11a1.112 1.112 0 01-.89-1.27l.89-4.92a1.119 1.119 0 00-.32-.98l-3.61-3.5a1.08 1.08 0 01-.27-1.13c.134-.396.476-.685.89-.75l4.97-.72c.377-.04.71-.27.88-.61l2.19-4.49c.051-.1.118-.192.2-.27l.09-.07a.671.671 0 01.16-.13l.11-.04.17-.07h.42c.376.04.707.264.88.6l2.22 4.47c.16.327.47.554.83.61l4.97.72c.42.06.77.35.91.75.13.401.017.841-.29 1.13l-3.74 3.54z"
							stroke="#b3b300" stroke-width="1.5"></path>
					</svg>
					<span class="text-sm">{{ Math.floor(Math.random() * 3) + 3 }}.0 ({{ Math.floor(Math.random() * 9) + 2 }} đánh giá)</span>
				</div>
				<div class="px-2">
					<span class="p-4 text-xs">{{ item.description }}</span>
				</div>
				<div class=" px-2">
					<span class=" font-bold tracking-wide text-green-500">{{ item.price }} đ</span>
				</div>
			</div>
		</div>
		<InfiniteLoading :class="{'hidden': endLoading}" class="flex justify-center mt-12 md:mt-28 lg:mt-10" @infinite="load" />
	</section>
  </template>
  
  <script>
  import Categories from "@/components/Categories.vue";
  import axios from 'axios';
  import InfiniteLoading from "v3-infinite-loading";
  import "v3-infinite-loading/lib/style.css";
  
  export default {
	name: 'itemList',
	components: {
		Categories,
		InfiniteLoading
	},
	data() {
		return {
			listItem: [],
			offset: 0,
			limit: 12,
			endLoading: false,
			encodedParams: ''
		}
	},
	methods: {
		// triggered when select category (triggered from a child component Categories)
		callBackListItem(value) {
			this.listItem = [];
			this.endLoading = false;
			this.offset = 0;
			try {
				for (const itm in value) {
					const encodedKey = encodeURIComponent(itm ?? '');
					const encodedValue = encodeURIComponent(value[itm] ?? '');
					if (encodedKey && encodedValue) {
						this.encodedParams = encodedKey + "=" + encodedValue;
					}
				}
			} catch (error) {
				alert(error);
			}
		},

		// get items using axios
		async getDataItems(encodedParams = '')
		{
			let urlQueryString = `http://localhost:3000/product/get-all?${encodedParams}`;
			await axios
				.get(urlQueryString)
				.then((result) => {
					if (!result.data.data) this.endLoading = true;
					this.listItem.push(...result.data.data);
				})
				.catch((err) => {
					console.log(err);
				});
		},
		navigate(id) {
			this.$router.push({ name: 'ItemDetail', params: { id: id } });
		},
  
		// used in InfiniteLoading, prepare offset and limit before calling getDataItems
		load() {
			this.offset += this.listItem.length;
			if (!this.endLoading) {
				let id = setInterval(() => {
					this.getDataItems(`${this.encodedParams ? this.encodedParams + '&' : ''}offset=${this.offset}&limit=${this.limit}`);
					clearInterval(id);
				}, 800)
			}
		}
	}
  }
  
  </script>