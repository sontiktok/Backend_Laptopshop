<script setup>
import Swiper from 'swiper/bundle';
// import styles bundle
import 'swiper/css/bundle';
import { onMounted, ref } from "vue"
import axios from "axios";

const recommendationRef = ref();

const recommendation = ref([1, 2, 3, 4, 5, 6])

const configs = ref({
  slidesPerView: 1,
  spaceBetween: 5,
  autoplay: true,
  loop: true,
  breakpoints: {
    340: {
      slidesPerView: 1.5,
      spaceBetween: 10,
    },
    620: {
      slidesPerView: 2,
      spaceBetween: 10,
    },
    1020: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1300: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
})

const getProduct = (async () => {
  try {
      const resp = await axios.get('http://localhost:3000/product/get-all');
      recommendation.value = resp.data.data
  } catch (error) {
      console.error(error);
  }
})

onMounted(() => {
  getProduct()

  const swiper = new Swiper(recommendationRef.value, {
    ...configs.value,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });

  const prev = () => {
    swiper.slidePrev()
  }

  const next = () => {
    swiper.slideNext()
  }
})

const addCart = (async (id) => {
  const token = localStorage.getItem('token');

  // Tạo header Authorization
  const headers = {
      Authorization: `Bearer ${token}`
  };

  const data = {
    product_id:  id,
    quantity: 1,
  }

  // Gửi GET request với Axios
  axios.post('http://localhost:3000/cart/create', data, { headers })
      .then(response => {
        if (response.status == 201) console.log(response.data.message)
      })
      .catch(error => {
          console.error('Error create data:', error);
      });
})
</script>
<template>
  <div class="swiper" ref="recommendationRef">
  <!-- Additional required wrapper -->
  <div class="swiper-wrapper">
    <!-- Slides -->
    <div v-for="item, index in recommendation" :key="index" class="swiper-slide">
      <div class="pro__place-title mt-2 absolute top-[0px] left-[20px]">
        <p @click="addCart(item.id)" class="cursor-pointer text-white font-semibold text-xs bg-red-500 w-max py-1 px-3 rounded-full">Thêm vào giỏ hàng</p>
      </div>
      <a :href="`product/${item.id}`" class="pro__place-link block">
        <img :src="`http://localhost:3000/images/${item.image}`" alt="Hà Nội" class="pro__place-img rounded-[5px]">
        <div class="pro__place-title mt-2">
          <p class="text-header font-medium text-center text-lg mb-2.5">{{ item.name }}</p>
          <div class="text-center px-2">
            <span class="font-bold tracking-wide text-green-500">{{ item.price }} đ</span>
          </div>
          <p class="text-justify pro__place-decs-place mr-2 text-content duration-300">{{ item.description }}</p>
        </div>
      </a>
    </div>
  </div>
  <div class="swiper-button-prev" @click="prev"></div>
  <div class="swiper-button-next" @click="next"></div>
</div>
</template>