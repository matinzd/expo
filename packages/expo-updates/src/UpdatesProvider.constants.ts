import * as Updates from './Updates';
import type { CurrentlyRunningInfo } from './UpdatesProvider.types';
/////// Constants and enums  ////////

// The currently running info, constructed from Updates constants
export const currentlyRunning: CurrentlyRunningInfo = {
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
export enum UpdatesProviderDownloadEventType {
  /**
   * Type of event emitted when update download starts.
   */
  DOWNLOAD_START = 'start',
  /**
   * Type of event emitted when update download completes successfully.
   */
  DOWNLOAD_COMPLETE = 'complete',
  /**
   * Type of event emitted when update download completes with an error.
   */
  DOWNLOAD_ERROR = 'error',
}
