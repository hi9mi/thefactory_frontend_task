import type { Photo } from '../api/gallery'

export const mockPhoto = {
  id: '0NDeK_z7XT4',
  width: 2800,
  height: 3501,
  blur_hash: 'LKMZ?Z}l$1ngv#RO%gWrxCaKITs:',
  alt_description: 'a woman wearing a sweater and green sunglasses',
  urls: {
    raw: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3',
    full: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=85',
    regular: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=80&w=1080',
    small: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=80&w=400',
    thumb: 'https://images.unsplash.com/photo-1712876718842-5b7d59ad453b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8&ixlib=rb-4.0.3&q=80&w=200',
    small_s3: 'https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1712876718842-5b7d59ad453b',
  },
  links: {
    self: 'https://api.unsplash.com/photos/a-woman-wearing-a-sweater-and-green-sunglasses-0NDeK_z7XT4',
    html: 'https://unsplash.com/photos/a-woman-wearing-a-sweater-and-green-sunglasses-0NDeK_z7XT4',
    download: 'https://unsplash.com/photos/0NDeK_z7XT4/download?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8',
    download_location: 'https://api.unsplash.com/photos/0NDeK_z7XT4/download?ixid=M3w0MDgwODh8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTQ4OTYyNDJ8',
  },
  user: {
    username: 'spliff_dj_joe',
    name: 'Dwayne joe',
    profile_image: {
      small: 'https://images.unsplash.com/profile-1651706213170-8be43fd00ae7?ixlib=rb-4.0.3&crop=faces&fit=crop&w=32&h=32',
      medium: 'https://images.unsplash.com/profile-1651706213170-8be43fd00ae7?ixlib=rb-4.0.3&crop=faces&fit=crop&w=64&h=64',
      large: 'https://images.unsplash.com/profile-1651706213170-8be43fd00ae7?ixlib=rb-4.0.3&crop=faces&fit=crop&w=128&h=128',
    },
  },
} satisfies Photo

export const mockUnFavoritePhoto = {
  ...mockPhoto,
  id: 'unfavorite',
}
export const mockFavoritePhoto = {
  ...mockPhoto,
  id: 'favorite',
}

export const mockPhotos = Array.from({ length: 10 }, (_, index) => ({
  ...mockPhoto,
  id: `photo-${index}`,
}))
