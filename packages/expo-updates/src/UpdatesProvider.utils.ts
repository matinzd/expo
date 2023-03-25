import * as Updates from './Updates';
import type { Manifest, UpdateEvent } from './Updates.types';
import { currentlyRunning } from './UpdatesProvider.constants';
import type { UpdatesInfo } from './UpdatesProvider.types';

/////// Internal functions ////////

// Promise wrapper for setTimeout()
export const delay = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

// Constructs the availableUpdate from the update manifest
export const availableUpdateFromManifest = (manifest: Partial<Manifest> | undefined) => {
  return manifest
    ? {
        updateId: manifest?.id ? manifest?.id : null,
        createdAt: manifest?.createdAt ? new Date(manifest?.createdAt) : null,
        manifest,
      }
    : undefined;
};

// Constructs the UpdatesInfo from an event
export const updatesInfoFromEvent = (event: UpdateEvent): UpdatesInfo => {
  const lastCheckForUpdateTime = new Date();
  if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
    return {
      currentlyRunning,
      lastCheckForUpdateTime,
    };
  } else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
    return {
      currentlyRunning,
      availableUpdate: availableUpdateFromManifest(event.manifest),
      lastCheckForUpdateTime,
    };
  } else {
    // event type === ERROR
    return {
      currentlyRunning,
      error: new Error(event.message),
      lastCheckForUpdateTime,
    };
  }
};

// Implementation of checkForUpdate
export const checkAndReturnNewUpdatesInfo: (
  updatesInfo: UpdatesInfo
) => Promise<UpdatesInfo> = async (updatesInfo) => {
  const logEntries = updatesInfo.logEntries;
  let result: UpdatesInfo;
  try {
    const checkResult = await Updates.checkForUpdateAsync();
    const lastCheckForUpdateTime = new Date();
    if (checkResult.isAvailable) {
      result = {
        currentlyRunning,
        availableUpdate: availableUpdateFromManifest(checkResult.manifest),
        lastCheckForUpdateTime,
        logEntries,
      };
    } else {
      result = {
        currentlyRunning,
        lastCheckForUpdateTime,
        logEntries,
      };
    }
  } catch (error: any) {
    const lastCheckForUpdateTime = new Date();
    result = {
      currentlyRunning,
      error: error?.message || 'Error occurred',
      lastCheckForUpdateTime,
      logEntries,
    };
  }
  return result;
};
