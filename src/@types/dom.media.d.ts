
interface MediaDevices {
    getDisplayMedia(constraints?: GetDisplayMediaConstraints): Promise<MediaStream>;
}

interface GetDisplayMediaConstraints extends MediaStreamConstraints {
    video?: VideoDisplayMediaTrackConstraints;
}

interface VideoDisplayMediaTrackConstraints extends MediaTrackConstraints {
    cursor?: string;
}
