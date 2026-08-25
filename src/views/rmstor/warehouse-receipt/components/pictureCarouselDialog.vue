<template>
  <div class="picture-carousel-dialog-box">
    <el-dialog class="dialog picture-carousel-dialog" :model-value="visible" :width="width" top="5vh" draggable @close="dialogClose" @open="dialogOpen" :destroy-on-close="true">
      <template #header>
        <span><svg-icon :icon-class="iconTitle" v-if="iconTitle" /> {{ title }}</span>
      </template>
      <template #footer>
        <el-button @click="dialogClose">关闭</el-button>
      </template>
      <div class="app-container app-container-splitpanes">
        <el-row :gutter="20" class="app-container-row integrated-manage-pane-form integrated-manage-pane-form-a">
          <div class="simple-carousel" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
            <div class="carousel-window">
              <div
                class="carousel-track"
                :style="{
                  transform: `translateX(-${(currentIndex) * 100}%)`,
                  transition: isAnimate ? 'transform 0.6s ease' : 'none'
                }"
              >
                <div class="carousel-slide">
                  <img v-if="items[items.length - 1].img" :src="items[items.length - 1].img" alt="">
                  <div v-else class="slide-content">{{ items[items.length - 1].text }}</div>
                </div>
                <div class="carousel-slide" v-for="(item, index) in items" :key="index">
                  <img v-if="item.img" :src="item.img" alt="">
                  <div v-else class="slide-content">{{ item.text }}</div>
                </div>
                <div class="carousel-slide">
                  <img v-if="items[0].img" :src="items[0].img" alt="">
                  <div v-else class="slide-content">{{ items[0].text }}</div>
                </div>
              </div>
            </div>

            <div class="carousel-arrow arrow-left" @click="prev">
              <el-icon :size="54"><CaretLeft /></el-icon>
            </div>
            <div class="carousel-arrow arrow-right" @click="next">
              <el-icon :size="54"><CaretRight /></el-icon>
            </div>

            <div class="carousel-indicators">
              <el-button
                v-for="(item, index) in items"
                :key="index"
                class="indicator-dot"
                :class="{ 'active': realIndex === index }"
                @click="goTo(index)"
              ></el-button>
            </div>
          </div>
        </el-row>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { getAcceptanceFiles } from '@/api/materialAccept/purchaseOrder';
import { getFile } from '@/api/rmstor/inbound';
import { CaretLeft, CaretRight } from '@element-plus/icons-vue';

const { proxy } = getCurrentInstance();

// 接收参数并指定类型（可选）
const props = defineProps({
  iconTitle: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: '新增'
  },
  width: {
    type: String,
    default: '800px'
  },
  visible: {
    type: Boolean,
    default: false
  },
  commonDialogFormJson: {
    type: Array,
    default: () => []
  },
  commonDialogTableJson: {
    type: Array,
    default: () => [],
  },
  pdbId: {
    type: String,
    default: "",
  },
  interval: {
    type: Number,
    default: 3000,
  }
});

const loading = ref(false);
const tableRef = ref(null);
const isAnimate = ref(true);
const items = ref([
  { text: '图片1' },
  { text: '图片2' },
  { text: '图片3' },
]);

const currentIndex = ref(1);
const realIndex = ref(0);
let timer = null;
const len = computed(() => {
  return items.value.length;
});

const mapRealIndex = (val) => {
  if(val === 0) {
    realIndex.value = len.value - 1;
  } else if (val === len.value + 1) {
    realIndex.value = 0;
  } else {
    realIndex.value = val - 1;
  }
}

const getPicList = async () => {
  loading.value = true;

  try {

  } catch (error) {
    
  }

  loading.value = false;
}

const emit = defineEmits(['dialogClose'])

const dialogOpen = () => {
  getPicList();
}

const dialogClose = () => {
  emit('dialogClose');
}

const next = () => {
  if (!isAnimate.value) return;
  isAnimate.value = true;
  currentIndex.value++;
}

const prev = () => {
  if (!isAnimate.value) return;
  isAnimate.value = true;
  currentIndex.value--;
}

const goTo = (index) => {
  if (!isAnimate.value) return;

  currentIndex.value = index + 1;
}


const startAutoPlay = () => {
  if(timer) return;

  const delay = props.interval || 3000;
  timer = setInterval(next, delay);
}

const pauseAutoPlay = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

watch(currentIndex, (nval) => {
  mapRealIndex(nval);
  const delay = 600;

  if (nval === len.value + 1) {
    setTimeout(() => {
      isAnimate.value = false;
      currentIndex.value = 1;
      requestAnimationFrame(() => {
        isAnimate.value = true;
      })
    }, delay)
  }

  if (nval === 0) {
    setTimeout(() => {
      isAnimate.value = false;
      currentIndex.value = len.value;
      requestAnimationFrame(() => {
        isAnimate.value = true;
      })
    }, delay)
  }
})

onMounted(() => {
  startAutoPlay();
});

onUnmounted(() => {
  pauseAutoPlay();
})

</script>

<style lang="scss" scoped>
.picture-carousel-dialog-box {
   :deep(.picture-carousel-dialog) {
    height: 80vh;
    .ep-dialog__body {
      .app-container {
        padding: 0;
      }
      padding: 12px;
      overflow-y: auto;
      overflow-x: hidden;
      height: calc(100% - 93px);
      position: relative;
      .simple-carousel {
        position: relative;
        width: 100%;
        margin: 0 auto;
        overflow: hidden;
        display: flex;
        align-items: center;
      }
      .carousel-window {
        overflow: hidden;
        width: 100%;
        height: 100%;
      }
      .carousel-track {
        display: flex;
        will-change: transform;
        height: 100%;
      }
      .carousel-slide {
        flex: 0 0 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        img,div {
          width: 90%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      }
      .carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.3s;
        backdrop-filter: blur(4px);
      }
      .arrow-left {
        left: 16px;
      }
      .arrow-right {
        right: 16px;
      }
      .carousel-indicators {
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 100;
        display: flex;
        gap: 10px;
      }
      .indicator-dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid rgba(64, 62, 62, 0.8);
        background: transparent;
        cursor: pointer;
        padding: 0;
        transition: all 0.3s ease;
        &.active {
          background: #919191;
          border-color: #919191;
        }
      }
      .slide-content {
        // padding: 20px 40px;
        border-radius: 8px;
        border: 1px solid rgba(216, 213, 213, 0.8);
      }
    }
  }
}
</style>