<script setup lang="ts">
import { ref } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { storeToRefs } from 'pinia'

import { useDetailsPhotoStore } from '@tf-app/entities/details-photo'
import ShowFullPhoto from '@tf-app/features/show-full-photo/show-full-photo.vue'
import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import downloadIcon from '@tf-app/shared/assets/icons/download.svg'
import maximazeIcon from '@tf-app/shared/assets/icons/maximaze.svg'
import TfLoader from '@tf-app/shared/ui/tf-loader.vue'

const detailsPhotoStore = useDetailsPhotoStore()
const { detailsPhoto, isLoadingDetailsPhoto } = storeToRefs(detailsPhotoStore)

const isShowFullPhoto = ref(false)

function handleShowFullPhoto() {
  isShowFullPhoto.value = true
}

function handleHideFullPhoto() {
  isShowFullPhoto.value = false
}

function downloadPhoto() {
  if (detailsPhoto.value)
    globalThis.open(detailsPhoto.value.links.download, '_blank')
}
</script>

<template>
  <div class="wrapper">
    <template v-if="!isLoadingDetailsPhoto && detailsPhoto">
      <img
        class="photo-bg"
        :src="detailsPhoto?.urls.full"
        :srcset="`${detailsPhoto?.urls.small} 560w, ${detailsPhoto?.urls.regular} 1100w, ${detailsPhoto?.urls.full} 1920w`"
        sizes="(max-width: 600px) 560px, 1100px"
        alt=""
        role="presentation"
      >
      <div class="container">
        <div class="photo-header">
          <div class="user-details">
            <img
              class="user-profile-img"
              :src="detailsPhoto?.user.profile_image.medium"
              :alt="detailsPhoto?.user.name"
            >
            <div class="user-bio">
              <p class="user-name">
                {{ detailsPhoto?.user.name }}
              </p>
              <p class="user-nickname">
                @{{ detailsPhoto?.user.username }}
              </p>
            </div>
          </div>
          <div class="photo-actions">
            <ToggleFavoritePhoto :photo="detailsPhoto" />
            <button
              class="action download"
              @click="downloadPhoto"
            >
              <VueInlineSvg
                :src="downloadIcon"
                width="23"
                height="23"
                aria-label="Скачать фото"
              />
              <span class="action-text">Скачать</span>
            </button>
          </div>
        </div>
        <div class="photo-wrapper">
          <img
            :src="detailsPhoto?.urls.full"
            :alt="detailsPhoto?.alt_description"
            :srcset="`${detailsPhoto?.urls.small} 560w, ${detailsPhoto?.urls.regular} 1100w, ${detailsPhoto?.urls.full} 1920w`"
            sizes="(max-width: 600px) 560px, 1100px"
            class="photo"
          >
          <button class="preview-btn" @click="handleShowFullPhoto">
            <VueInlineSvg
              :src="maximazeIcon"
              aria-label="Открыть на весь экран фото"
              width="24"
              height="24"
            />
          </button>
        </div>
      </div>
    </template>
    <TfLoader v-else-if="isLoadingDetailsPhoto" />
  </div>
  <ShowFullPhoto
    v-if="detailsPhoto"
    :is-show="isShowFullPhoto"
    :url="detailsPhoto.urls.full"
    :description="detailsPhoto.alt_description"
    @hide-full-photo="handleHideFullPhoto"
  />
</template>

<style scoped>
.wrapper {
  position: relative;
  margin: 100px 0;
}

.photo-bg {
  position: absolute;
  top: -15%;
  left: 0;
  z-index: -1;
  filter: grayscale(100%) blur(2px);;
  object-position: center center;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.photo-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 50px 0;
  flex-wrap: wrap;
  gap: 20px;
}

.user-details {
  display: flex;
  align-items: start;
  gap: 10px;
}

.user-bio {
  color: #F2F2F2;
}

.user-name {
  font-size: 30px;
}

.user-nickname {
  font-size: 18px;
}

.user-profile-img {
  width: 55px;
  height: 55px;
  object-fit: cover;
  object-position: center;
  border: 1px solid #fff;
  border-radius: 8px;
}

.photo-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action {
  background-color: transparent;
  border: none;
  border-radius: 8px;
  outline: none;
  color: #000;
  padding: 13px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 0 4px 0 rgb(0 0 0 / 25%);
}

.favorite {
  background-color: #fff;
}

.download {
  background-color: #FFF200;
  padding: 13px 20px;
}

.action-text {
  font-size: 20px;
}

.photo-wrapper {
  position: relative;
  width: 100%;
  height: 740px;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
}

.preview-btn {
  position: absolute;
  bottom: 30px;
  right: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

@media screen and (width <= 560px) {
  .photo-bg {
    display: none;
  }

  .user-name {
    font-size: 18px;
    color: #000;
  }

  .user-nickname {
    font-size: 14px;
    color: #BDBDBD;
  }

  .action-text {
    display: none;
  }

  .download {
    padding: 13px 11px;
  }

  .photo-wrapper {
    height: 228px;
  }

  .preview-btn {
    bottom: 8px;
    right: 9px;
  }
}
</style>
