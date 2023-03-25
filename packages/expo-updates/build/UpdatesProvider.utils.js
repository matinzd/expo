import * as Updates from './Updates';
import { currentlyRunning } from './UpdatesProvider.constants';
/////// Internal functions ////////
// Promise wrapper for setTimeout()
export const delay = (timeout) => {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
};
// Constructs the availableUpdate from the update manifest
export const availableUpdateFromManifest = (manifest) => {
    return manifest
        ? {
            updateId: manifest?.id ? manifest?.id : null,
            createdAt: manifest?.createdAt ? new Date(manifest?.createdAt) : null,
            manifest,
        }
        : undefined;
};
// Constructs the UpdatesInfo from an event
export const updatesInfoFromEvent = (event) => {
    const lastCheckForUpdateTime = new Date();
    if (event.type === Updates.UpdateEventType.NO_UPDATE_AVAILABLE) {
        return {
            currentlyRunning,
            lastCheckForUpdateTime,
        };
    }
    else if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        return {
            currentlyRunning,
            availableUpdate: availableUpdateFromManifest(event.manifest),
            lastCheckForUpdateTime,
        };
    }
    else {
        // event type === ERROR
        return {
            currentlyRunning,
            error: new Error(event.message),
            lastCheckForUpdateTime,
        };
    }
};
// Implementation of checkForUpdate
export const checkAndReturnNewUpdatesInfo = async (updatesInfo) => {
    const logEntries = updatesInfo.logEntries;
    let result;
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
        }
        else {
            result = {
                currentlyRunning,
                lastCheckForUpdateTime,
                logEntries,
            };
        }
    }
    catch (error) {
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
//# sourceMappingURL=UpdatesProvider.utils.js.map