<script setup lang="ts">
import { storeToRefs } from 'pinia'
import VueInlineSvg from 'vue-inline-svg'

import { useDetailsPhotoStore } from '@tf-app/entities/details-photo'
import { useFavoritePhotosStore } from '@tf-app/entities/favorite-photos'
import downloadIcon from '@tf-app/shared/assets/icons/download.svg'
import heartIcon from '@tf-app/shared/assets/icons/heart.svg'
import TfLoader from '@tf-app/shared/ui/tf-loader.vue'

const detailsPhotoStore = useDetailsPhotoStore()
const favoritePhotosStore = useFavoritePhotosStore()
const { detailsPhoto, isLoadingDetailsPhoto } = storeToRefs(detailsPhotoStore)

function downloadPhoto() {
  if (detailsPhoto.value)
    globalThis.open(detailsPhoto.value.links.download, '_blank')
}
</script>

<template>
  <main class="wrapper">
    <template v-if="!isLoadingDetailsPhoto && detailsPhoto">
      <img
        class="photo-bg"
        :src="detailsPhoto?.urls.full"
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
            <button
              class="action favorite"
              @click="favoritePhotosStore.toggleFavoritePhoto(detailsPhoto)"
            >
              <VueInlineSvg
                :src="heartIcon"
                fill="none"
                width="23"
                height="21"
                aria-label="Избранное"
              />
            </button>
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
        <img
          :src="detailsPhoto?.urls.regular"
          :alt="detailsPhoto?.alt_description"
          class="photo"
        >
      </div>
    </template>
    <TfLoader v-else />
  </main>
</template>

<style scoped>
.wrapper {
  position: relative;
  margin: 100px 0;
}

.photo-bg{
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
  background-color: none;
  border: none;
  border-radius: 8px;
  outline: none;
  color: #000;
  padding: 13px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
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

.photo {
  width: 100%;
  height: 800px;
  object-fit: cover;
  object-position: center;
}

@media screen and (width <= 560px) {
  .user-name {
    font-size: 18px;
  }

  .user-nickname {
    font-size: 14px;
  }

  .action-text {
    display: none;
  }

  .download {
    padding: 13px 11px;
  }
}
</style>
