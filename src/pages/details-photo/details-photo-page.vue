<script setup lang="ts">
import { ref } from 'vue'
import VueInlineSvg from 'vue-inline-svg'
import { storeToRefs } from 'pinia'

import { useDetailsPhotoStore } from '@tf-app/entities/details-photo'
import { DownloadPhoto } from '@tf-app/features/download-photo'
import { ShowFullPhoto } from '@tf-app/features/show-full-photo'
import { ToggleFavoritePhoto } from '@tf-app/features/toggle-favorite-photo'
import maximazeIcon from '@tf-app/shared/assets/icons/maximaze.svg'
import { TfActionButton, TfLoader } from '@tf-app/shared/ui'

const detailsPhotoStore = useDetailsPhotoStore()
const { detailsPhoto, isLoadingDetailsPhoto } = storeToRefs(detailsPhotoStore)

const isShowFullPhoto = ref(false)

function handleShowFullPhoto() {
  isShowFullPhoto.value = true
}

function handleHideFullPhoto() {
  isShowFullPhoto.value = false
}
</script>

<template>
  <div :class="classes.wrapper">
    <template v-if="!isLoadingDetailsPhoto && detailsPhoto">
      <img
        :class="classes.photoBg"
        :src="`${detailsPhoto.urls.raw}&w=640&h=640&dpr=2&q=80`"
        :srcset="`${detailsPhoto.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${detailsPhoto.urls.raw}&w=640&h=640&dpr=2&q=80 640w, ${detailsPhoto.urls.raw}&w=1024&h=1024dpr=3&q=80 1024w`"
        sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
        alt=""
        role="presentation"
      >
      <div :class="classes.backdrop" />
      <div class="container" :class="classes.container">
        <div :class="classes.photoHeader">
          <div :class="classes.userDetails">
            <img
              :class="classes.userProfileImg"
              :src="detailsPhoto.user.profile_image.medium"
              :alt="detailsPhoto.user.name"
            >
            <div :class="classes.userBio">
              <p :class="classes.userName">
                {{ detailsPhoto.user.name }}
              </p>
              <p :class="classes.userNickname">
                @{{ detailsPhoto.user.username }}
              </p>
            </div>
          </div>
          <div :class="classes.photoActions">
            <ToggleFavoritePhoto :photo="detailsPhoto" />
            <DownloadPhoto
              :src="detailsPhoto.urls.full"
              :with-text="true"
              :name="detailsPhoto.id"
            />
          </div>
        </div>
        <div :class="classes.photoWrapper">
          <img
            :src="`${detailsPhoto.urls.raw}&w=320&h=320&dpr=1&q=80`"
            :alt="detailsPhoto.alt_description"
            :srcset="`${detailsPhoto.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${detailsPhoto.urls.raw}&w=740&h=740&dpr=1&q=80 740w`"
            sizes="(max-width: 560px) 320px, 740px"
            :class="classes.photo"
          >
          <TfActionButton
            type="button"
            :class="classes.previewBtn"
            @click="handleShowFullPhoto"
          >
            <VueInlineSvg
              :src="maximazeIcon"
              aria-label="Открыть на весь экран фото"
              width="24"
              height="24"
            />
          </TfActionButton>
        </div>
      </div>
    </template>
    <TfLoader v-else-if="isLoadingDetailsPhoto" />
  </div>
  <ShowFullPhoto
    v-if="detailsPhoto"
    :is-show="isShowFullPhoto"
    :photo="detailsPhoto"
    :description="detailsPhoto.alt_description"
    @hide-full-photo="handleHideFullPhoto"
  />
</template>

<style module="classes">
.container {
  position: relative;
  z-index: 3;
}

.wrapper {
  position: relative;
  margin: 100px 0;
}

.photoBg {
  position: absolute;
  top: -15%;
  left: 0;
  z-index: 1;
  object-position: center center;
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.backdrop {
  background: rgb(0 0 0 / 50%);
  backdrop-filter: blur(4px);
  position: absolute;
  top: -15%;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.photoHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 50px 0;
  flex-wrap: wrap;
  gap: 20px;
}

.userDetails {
  display: flex;
  align-items: center;
  gap: 10px;
}

.userBio {
  color: var(--c-white-smoke);
}

.userName {
  font-size: 30px;
}

.userNickname {
  font-size: 18px;
}

.userProfileImg {
  width: 55px;
  height: 55px;
  object-fit: cover;
  object-position: center;
  border: 1px solid var(--c-white);
  border-radius: var(--border-radius-md);
}

.photoActions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.photoWrapper {
  position: relative;
  width: 100%;
  height: 740px;
}

.photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: var(--border-radius-md);
}

.previewBtn {
  position: absolute;
  bottom: 30px;
  right: 40px;
}

@media screen and (width <= 560px) {
  .photoBg {
    display: none;
  }

  .backdrop {
    display: none;
  }

  .userName {
    font-size: 18px;
    color: var(--font-color);
  }

  .userNickname {
    font-size: 14px;
    color: var(--c-silver);
  }

  .photoWrapper {
    height: 228px;
  }

  .previewBtn {
    bottom: 8px;
    right: 9px;
  }
}
</style>
