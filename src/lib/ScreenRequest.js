class ScreenRequest {
    static Request(options) {
        


        return {
            error: {
                notAllowed: false,
                unknown: false,
            },
            isFullscreen: false,
            stream: null,
        };
    }
}
