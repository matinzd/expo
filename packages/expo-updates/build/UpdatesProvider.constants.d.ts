import type { CurrentlyRunningInfo } from './UpdatesProvider.types';
export declare const currentlyRunning: CurrentlyRunningInfo;
/**
 * Enumeration of the different possible event types emitted by [`downloadUpdate`](#downloadupdate) during
 * the download of an available update.
 */
export declare enum UpdatesProviderDownloadEventType {
    /**
     * Type of event emitted when update download starts.
     */
    DOWNLOAD_START = "start",
    /**
     * Type of event emitted when update download completes successfully.
     */
    DOWNLOAD_COMPLETE = "complete",
    /**
     * Type of event emitted when update download completes with an error.
     */
    DOWNLOAD_ERROR = "error"
}
//# sourceMappingURL=UpdatesProvider.constants.d.ts.map