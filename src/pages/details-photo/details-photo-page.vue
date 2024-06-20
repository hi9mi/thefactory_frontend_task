<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'
import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import { routes } from '@tf-app/routing'
import type { Photo } from '@tf-app/shared/api'
import * as api from '@tf-app/shared/api'
import { computeRelativeBrightness, hexToRgb } from '@tf-app/shared/libs'
import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'
import TfBlurhashImage from '@tf-app/shared/ui/data-display/tf-blurhash-image/tf-blurhash-image.vue'
import TfLoader from '@tf-app/shared/ui/feedback/tf-loader/tf-loader.vue'
import { notify } from '@tf-app/shared/ui/feedback/tf-notification/libs'

import FullScreenIcon from '~icons/tf-icons/full-screen'

const router = useRouter()
const route = useRoute()
const photo = ref<Photo | null>(null)
const isLoadingDetailsPhoto = ref(false)

const previewButtonStyles = computed(() => {
  if (photo.value) {
    const { r, g, b } = hexToRgb(photo.value.color)
    const brightness = computeRelativeBrightness(r, g, b)
    return brightness < 128 ? { '--full-screen-icon-color': '#ffffff' } : { '--full-screen-icon-color': '#000000' }
  }
  return { '--full-screen-icon-color': '#ffffff' }
})

function handleShowFullPhoto() {
  router.push({ name: routes.photoPage.children.fullPhoto.name })
}

async function getDetailsPhoto(id: string) {
  isLoadingDetailsPhoto.value = true
  try {
    photo.value = await api.getDetailsPhoto(id)
  }
  catch (error) {
    notify({ title: 'Ошибка при загрузке фотографии', message: 'Что-то пошло не так, попробуйте позже', type: 'error' })
  }
  isLoadingDetailsPhoto.value = false
}

getDetailsPhoto(route.params.id.toString())
</script>

<template>
  <div :class="classes.wrapper">
    <template v-if="!isLoadingDetailsPhoto && photo">
      <img
        :class="classes.photoBg"
        :src="`${photo.urls.raw}&w=320&h=320&dpr=1&q=80`"
        :srcset="`${photo.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${photo.urls.raw}&w=640&h=640&dpr=2&q=80 640w, ${photo.urls.raw}&w=1024&h=1024dpr=3&q=80 1024w`"
        sizes="(max-width: 400px) 320px, (max-width: 800px) 640px, 1024px"
        alt=""
        role="presentation"
        data-testid="photo-bg"
      >
      <div :class="classes.backdrop" />
      <div class="container" :class="classes.container">
        <div :class="classes.photoHeader">
          <div :class="classes.userDetails">
            <img
              :class="classes.userProfileImg"
              :src="photo.user.profile_image.medium"
              :alt="photo.user.name"
            >
            <div :class="classes.userBio">
              <p :class="classes.userName" data-testid="user-name">
                {{ photo.user.name }}
              </p>
              <p :class="classes.userNickname" data-testid="user-nickname">
                @{{ photo.user.username }}
              </p>
            </div>
          </div>
          <div :class="classes.photoActions">
            <ToggleFavoritePhoto :photo="photo" />
            <DownloadPhoto
              :src="photo.urls.full"
              :with-text="true"
              :name="photo.id"
            />
          </div>
        </div>
        <div :class="classes.photoWrapper">
          <TfBlurhashImage
            :id="photo.id"
            :blurhash-width="740"
            :blurhash-height="740"
            :blurhash="photo.blur_hash"
            :src="`${photo.urls.raw}&w=740&h=740&dpr=1&q=80`"
            :srcset="`${photo.urls.raw}&w=320&h=320&dpr=1&q=80 320w, ${photo.urls.raw}&w=740&h=740&dpr=1&q=80 740w, ${photo.urls.raw}&w=1440&h=1440&dpr=1&q=80 1440w`"
            sizes="(max-width: 560px) 320px, (max-width: 960px) 740px, 1440px"
            :class="classes.photo"
            :alt="photo.alt_description"
          />
          <TfActionButton
            type="button"
            :class="classes.previewBtn"
            data-testid="pr`eview-btn"
            :style="previewButtonStyles"
            @click="handleShowFullPhoto"
          >
            <FullScreenIcon
              aria-label="Открыть на весь экран фото"
              width="24"
              height="24"
              fill="currentColor"
            />
          </TfActionButton>
        </div>
      </div>
    </template>
    <TfLoader v-else-if="isLoadingDetailsPhoto" data-testid="loader" />
  </div>
  <RouterView v-slot="{ Component }" :name="routes.photoPage.children.fullPhoto.name">
    <component
      :is="Component"
      v-if="photo"
      :photo="photo"
      :description="photo.alt_description"
      data-testid="full-photo"
    />
  </RouterView>
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
  color: var(--color-white-smoke);
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
  border: 1px solid var(--color-white);
  border-radius: var(--border-radius-medium);
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
  border-radius: var(--border-radius-medium);
}

.previewBtn {
  position: absolute;
  bottom: 30px;
  right: 40px;
  color: var(--full-screen-icon-color);
}

.previewBtn:focus-visible {
  outline: 3px dashed var(--color-white);
}

@media screen and (width <=560px) {
  .photoBg {
    display: none;
  }

  .backdrop {
    display: none;
  }

  .userName {
    font-size: 18px;
    color: var(--text-color-default);
  }

  .userNickname {
    font-size: 14px;
    color: var(--color-silver);
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
