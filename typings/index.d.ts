interface Photo {
  alt_description: string
  id: string
  links: {
    download: string
    download_location: string
    html: string
    self: string
  }
  urls: {
    full: string
    raw: string
    regular: string
    small: string
    small_s3: string
    thumb: string
  }
  user: {
    name: string
    username: string
    profile_image: {
      large: string
      medium: string
      small: string
    }
  }
}
