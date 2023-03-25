import type { Manifest, UpdateEvent } from './Updates.types';
import type { UpdatesInfo } from './UpdatesProvider.types';
export declare const delay: (timeout: number) => Promise<unknown>;
export declare const availableUpdateFromManifest: (manifest: Partial<Manifest> | undefined) => {
    updateId: string | null;
    createdAt: Date | null;
    manifest: Partial<import("expo-constants/build/Constants.types").AppManifest> | Partial<import("expo-constants/build/Constants.types").Manifest>;
} | undefined;
export declare const updatesInfoFromEvent: (event: UpdateEvent) => UpdatesInfo;
export declare const checkAndReturnNewUpdatesInfo: (updatesInfo: UpdatesInfo) => Promise<UpdatesInfo>;
//# sourceMappingURL=UpdatesProvider.utils.d.ts.map