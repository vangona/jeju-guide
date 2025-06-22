export type PlaceInfo = {
  id?: string;
  name: string;
  type: string;
  geocode: { '0': string; '1': string };
  url: string;
  attachmentUrlArray: string[];
  creatorId: string;
  description: string;
  address: string;
  extraAddress: string;
  addressDetail: string;
};

export type UserObj = {
  uid: string;
  displayName: string;
  photoURL: string;
};
