

export interface TraktMeta {
  accessToken: string;
  avatarURL: string;
  avatarUrl: string;
  email: string;
  expiry: string;
  id: string;
  isNew: boolean;
  name: string;
  rawUser: RawUser;
  refreshToken: string;
  username: string;
}

export interface RawUser {
  account: Account;
  connections: Connections;
  limits: Limits;
  permissions: Permissions;
  sharing_text: SharingText;
  user: User;
}

export interface Account {
  cover_image: any;
  date_format: string;
  display_ads: boolean;
  time_24hr: boolean;
  timezone: string;
  token: any;
}

export interface Connections {
  apple: boolean;
  dropbox: boolean;
  facebook: boolean;
  google: boolean;
  mastodon: boolean;
  medium: boolean;
  microsoft: boolean;
  slack: boolean;
  tumblr: boolean;
  twitter: boolean;
}

export interface Limits {
  collection: Collection;
  favorites: Favorites;
  list: List;
  notes: Notes;
  recommendations: Recommendations;
  search: Search;
  watchlist: Watchlist;
}

export interface Collection {
  item_count: number;
}

export interface Favorites {
  item_count: number;
}

export interface List {
  count: number;
  item_count: number;
}

export interface Notes {
  item_count: number;
}

export interface Recommendations {
  item_count: number;
}

export interface Search {
  recent_count: number;
}

export interface Watchlist {
  item_count: number;
}

export interface Permissions {
  commenting: boolean;
  following: boolean;
  liking: boolean;
}

export interface SharingText {
  rated: any;
  watched: string;
  watching: string;
}

export interface User {
  about: any;
  age: any;
  deleted: boolean;
  director: boolean;
  gender: string;
  ids: Ids;
  images: Images;
  joined_at: string;
  location: string;
  name: string;
  private: boolean;
  username: string;
  vip: boolean;
  vip_cover_image: any;
  vip_ep: boolean;
  vip_og: boolean;
  vip_years: number;
}

export interface Ids {
  slug: string;
  uuid: string;
}

export interface Images {
  avatar: Avatar;
}

export interface Avatar {
  full: string;
}

