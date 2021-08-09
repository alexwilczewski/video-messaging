interface Document {
    exitPictureInPicture: () => Promise<void>;
    pictureInPictureElement?: HTMLVideoElement;
}
