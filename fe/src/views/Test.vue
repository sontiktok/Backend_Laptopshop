<script setup>
import ContentCover from '@/components/ContentCover.vue';
import ProPlace from '@/components/ProPlace.vue';
import SpecialEvent from '@/components/SpecialEvent.vue';
import Recommendation from '@/components/Recommendation.vue';
import DiscoveryRecommendation from '@/components/DiscoveryRecommendation.vue';
import Guide from '@/components/Guide.vue';
import { ref } from 'vue';
</script>

<template>
  <section>
    <div class="slider__container mt-2">
      <a href="" class="slider__link flex justify-center">
          <img src="/img/banner.jpg" alt="" class="slider__img slider__img--animation">
      </a>
    </div>
  </section>
  <section>
      <ContentCover
          header="Sản phẩm"
      >
          <div class="flex justify-between">
            <p>Những sản phẩm tốt nhất</p>
          </div>
          <Recommendation/>
      </ContentCover>
  </section>
  <section>
      <ContentCover
          header="Ưu đãi độc quyền"
      >
          <div class="flex justify-between">
            <p>Chỉ có tại Laptop, hấp dẫn và hữu hạn, đặt hàng ngay!</p>
            <a href="" class="text-[12px] sm:text-[18px] text-[#F65E39]">Xem thêm</a>
          </div>
          <SpecialEvent/>
      </ContentCover>
  </section>
  <section>
      <ContentCover
          header="Hướng dẫn sử dụng"
      >
          <div class="flex justify-between">
            <p>Đặt hàng dễ dàng, thanh toán đơn giản, giao hàng nhanh chóng</p>
          </div>
          <Guide/>
      </ContentCover>
  </section>
</template>
