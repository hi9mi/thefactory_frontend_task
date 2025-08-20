<script setup lang="ts">
import { createPhotoDetailsEntity, createPhotoDetailsGateway, PHOTO_DETAILS_CACHE } from '@tf-app/entities/details-photo'

import DownloadPhoto from '@tf-app/features/download-photo/download-photo.vue'
import ToggleFavoritePhoto from '@tf-app/features/toggle-favorite-photo/toggle-favorite-photo.vue'
import { routes } from '@tf-app/routing'
import { TOKENS, useDependency } from '@tf-app/shared/di'
import { computeRelativeBrightness, hexToRgb } from '@tf-app/shared/libs'
import TfActionButton from '@tf-app/shared/ui/buttons/tf-action-button/tf-action-button.vue'
import TfBlurhashImage from '@tf-app/shared/ui/data-display/tf-blurhash-image/tf-blurhash-image.vue'
import TfLoader from '@tf-app/shared/ui/feedback/tf-loader/tf-loader.vue'

import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FullScreenIcon from '~icons/tf-icons/full-screen'

const api = useDependency(TOKENS.UnsplashAPI)
const notify = useDependency(TOKENS.Notifier)
const cache = useDependency(PHOTO_DETAILS_CACHE)
const details = createPhotoDetailsEntity({ gateway: createPhotoDetailsGateway(api), cache })

const router = useRouter()
const route = useRoute()
const id = computed(() => String(route.params.id ?? ''))

const entry = computed(() => details.getState(id.value))

watch(id, (n) => {
  if (n)
    details.ensure(n)
}, { immediate: true })

const previewButtonStyles = computed(() => {
  const def = { '--full-screen-icon-color': '#ffffff', '--full-screen-icon-filter': 'url("#blackShadow")' }
  if (!entry.value.item?.color)
    return def
  const { r, g, b } = hexToRgb(entry.value.item.color)
  const brightness = computeRelativeBrightness(r, g, b)
  return brightness < 128
    ? { '--full-screen-icon-color': '#ffffff', '--full-screen-icon-filter': 'url("#blackShadow")' }
    : { '--full-screen-icon-color': '#000000', '--full-screen-icon-filter': 'url("#whiteShadow")' }
})

function handleShowFullPhoto() {
  router.push({ name: routes.photoPage.children.fullPhoto.name })
}
watch(() => entry.value.error, (e) => {
  if (e)
    notify.error('Error while loading photo from API', 'Error')
})
</script>

<template>
  <div :class="classes.wrapper">
    <template v-if="!entry.loading && entry.item">
      <img
        :class="classes.photoBg"
        :src="`${entry.item.urlRaw}&w=320&h=320&dpr=1&q=80`"
        :srcset="`${entry.item.urlRaw}&w=320&h=320&dpr=1&q=80 320w, ${entry.item.urlRaw}&w=640&h=640&dpr=2&q=80 640w, ${entry.item.urlRaw}&w=1024&h=1024dpr=3&q=80 1024w`"
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
              :src="entry.item.authorAvatar"
              :alt="entry.item.author"
            >
            <div :class="classes.userBio">
              <p :class="classes.userName" data-testid="user-name">
                {{ entry.item.author }}
              </p>
              <p :class="classes.userNickname" data-testid="user-nickname">
                @{{ entry.item.authorUsername }}
              </p>
            </div>
          </div>
          <div :class="classes.photoActions">
            <ToggleFavoritePhoto :photo="entry.item" />
            <DownloadPhoto
              :src="entry.item.urlRaw"
              :with-text="true"
              :name="entry.item.id"
            />
          </div>
        </div>
        <div :class="classes.photoWrapper">
          <TfBlurhashImage
            :id="entry.item.id"
            :blurhash-width="740"
            :blurhash-height="740"
            :blurhash="entry.item.blurHash"
            :src="`${entry.item.urlRaw}&w=740&h=740&dpr=1&q=80`"
            :srcset="`${entry.item.urlRaw}&w=320&h=320&dpr=1&q=80 320w, ${entry.item.urlRaw}&w=740&h=740&dpr=1&q=80 740w, ${entry.item.urlRaw}&w=1440&h=1440&dpr=1&q=80 1440w`"
            sizes="(max-width: 560px) 320px, (max-width: 960px) 740px, 1440px"
            :class="classes.photo"
            :alt="entry.item.alt"
          />
          <TfActionButton
            type="button"
            :class="classes.previewBtn"
            data-testid="preview-btn"
            :style="previewButtonStyles"
            @click="handleShowFullPhoto"
          >
            <FullScreenIcon
              aria-label="Открыть на весь экран фото"
              width="24"
              height="24"
              fill="currentColor"
              :class="classes.fullScreenIcon"
            />
          </TfActionButton>
        </div>
      </div>
    </template>
    <TfLoader v-else-if="entry.loading" data-testid="loader" />
  </div>
  <RouterView v-slot="{ Component }" :name="routes.photoPage.children.fullPhoto.name">
    <component
      :is="Component"
      v-if="entry.item"
      :src="entry.item.urlRaw"
      :description="entry.item.alt"
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
  height: 100%;
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
  margin-bottom: 50px;
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
  margin: 0;
}

.userNickname {
  font-size: 18px;
  margin: 0;
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

.fullScreenIcon {
  filter: var(--full-screen-icon-filter, url('#blackShadow'));
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
