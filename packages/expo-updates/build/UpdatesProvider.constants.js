import * as Updates from './Updates';
/////// Constants and enums  ////////
// The currently running info, constructed from Updates constants
export const currentlyRunning = {
    updateId: Updates.updateId,
    channel: Updates.channel,
    createdAt: Updates.createdAt,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
    manifest: Updates.manifest,
    runtimeVersion: Updates.runtimeVersion,
};
/**
 * Enumeration of the different possible event types emitted by [`downloadUpdate`](#downloadupdate) during
 * the download of an available update.
 */
export var UpdatesProviderDownloadEventType;
(function (UpdatesProviderDownloadEventType) {
    /**
     * Type of event emitted when update download starts.
     */
    UpdatesProviderDownloadEventType["DOWNLOAD_START"] = "start";
    /**
     * Type of event emitted when update download completes successfully.
     */
    UpdatesProviderDownloadEventType["DOWNLOAD_COMPLETE"] = "complete";
    /**
     * Type of event emitted when update download completes with an error.
     */
    UpdatesProviderDownloadEventType["DOWNLOAD_ERROR"] = "error";
})(UpdatesProviderDownloadEventType || (UpdatesProviderDownloadEventType = {}));
//# sourceMappingURL=UpdatesProvider.constants.js.map