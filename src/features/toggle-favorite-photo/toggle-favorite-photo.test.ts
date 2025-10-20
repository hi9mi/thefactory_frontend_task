import type { FavoritesRepo } from '@tf-app/entities/favorite-photos'
import type { Notifier } from '@tf-app/shared/ui/feedback/tf-notification'
import { useDependency } from '@tf-app/shared/libs'
import { NOTIFIER_TOKEN } from '@tf-app/shared/ui/feedback/tf-notification'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import ToggleFavoritePhoto from './toggle-favorite-photo.vue'

const injections: { repo: FavoritesRepo | null, notifier: Notifier | null } = {
  repo: null,
  notifier: null,
}

const TfTooltipStub = {
  name: 'TfTooltip',
  props: ['label', 'position'],
  template: `
    <div data-stub="tooltip" :data-label="label">
      <slot name="anchor"
        :labelledby="'lbl-1'"
        :onMouseEnter="() => {}"
        :onMouseLeave="() => {}"
        :onFocus="() => {}"
        :onBlur="() => {}"
        :onKeydown="() => {}"
      />
    </div>
  `,
}

const TfButtonStub = {
  name: 'TfButton',
  template: `<button type="button" v-bind="$attrs">
                <slot/>
            </button>`,
}

const HeartIconStub = { name: 'HeartIcon', template: `<svg data-stub="heart" />` }

function makeRepo(initialIds: string[] = []): FavoritesRepo {
  const items = ref<any[]>(initialIds.map(id => ({ id })))
  const has = (id: string) => items.value.some(x => x.id === id)
  const add = vi.fn((item: any) => {
    if (!has(item.id))
      items.value = [...items.value, item]
  })
  const remove = vi.fn((id: string) => {
    items.value = items.value.filter(x => x.id !== id)
  })
  const clear = vi.fn(() => {
    items.value = []
  })
  return { items, has: vi.fn(has), add, remove, clear }
}

function makeNotifier(): Notifier {
  return {
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
    clear: vi.fn(),
  }
}

vi.mock('@tf-app/shared/libs', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tf-app/shared/libs')>()
  return {
    ...actual,
    useDependency: vi.fn(),
  }
})

function mountCmp(photoId = 'p1', initialFavs: string[] = []) {
  injections.repo = makeRepo(initialFavs)
  injections.notifier = makeNotifier()

  const wrapper = mount(ToggleFavoritePhoto, {
    props: { photo: { id: photoId } as any },
    global: {
      stubs: {
        TfTooltip: TfTooltipStub,
        TfButton: TfButtonStub,
        HeartIcon: HeartIconStub,
      },
    },
  })
  return { wrapper, repo: injections.repo, notify: injections.notifier }
}

describe('toggle-favorite-photo feature', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    vi.mocked(useDependency).mockImplementation((token) => {
      if (token === NOTIFIER_TOKEN)
        return injections.notifier
      return injections.repo
    })
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders button and receives aria-labelledby from tooltip anchor', () => {
    const { wrapper } = mountCmp('p1')
    const btn = wrapper.find('[data-testid="toggle-favorite-photo-btn"]')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('aria-labelledby')).toBe('lbl-1')
  })

  it('adds photo to favorites on click: calls repo.add + notify.success and updates label', async () => {
    const { wrapper, repo, notify } = mountCmp('p1', [])

    const tooltip = wrapper.get('[data-stub="tooltip"]')
    expect(tooltip.attributes('data-label')).toBe('Add to favorites')

    await wrapper.get('[data-testid="toggle-favorite-photo-btn"]').trigger('click')
    await nextTick()

    expect(repo.add).toHaveBeenCalledWith({ id: 'p1' })
    expect(repo.remove).not.toHaveBeenCalled()
    expect(notify.success).toHaveBeenCalledWith('Photo added to favorites', 'Success')
    expect(tooltip.attributes('data-label')).toBe('Remove from favorites')
  })

  it('removes photo from favorites on click if already favorite: calls repo.remove + notify.info and updates label', async () => {
    const { wrapper, repo, notify } = mountCmp('p2', ['p2'])

    const tooltip = wrapper.get('[data-stub="tooltip"]')
    expect(tooltip.attributes('data-label')).toBe('Remove from favorites')

    await wrapper.get('[data-testid="toggle-favorite-photo-btn"]').trigger('click')
    await nextTick()

    expect(repo.remove).toHaveBeenCalledWith('p2')
    expect(repo.add).not.toHaveBeenCalled()
    expect(notify.info).toHaveBeenCalledWith('Photo removed from favorites', 'Info')
    expect(tooltip.attributes('data-label')).toBe('Add to favorites')
  })
})
