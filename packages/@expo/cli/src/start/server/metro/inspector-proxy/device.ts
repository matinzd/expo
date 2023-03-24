import type { DebuggerInfo, Device as MetroDevice } from 'metro-inspector-proxy';
import type WS from 'ws';

import { MetroBundlerDevServer } from '../MetroBundlerDevServer';
import { NetworkResponseHandler } from './handlers/NetworkResponse';
import { PageReloadHandler } from './handlers/PageReload';
import { VscodeCompatHandler } from './handlers/VscodeCompat';
import { DeviceRequest, InspectorHandler, DebuggerRequest } from './handlers/types';

export function createInspectorDeviceClass(
  metroBundler: MetroBundlerDevServer,
  MetroDeviceClass: typeof MetroDevice
) {
  return class ExpoInspectorDevice extends MetroDeviceClass implements InspectorHandler {
    /** All handlers that should be used to intercept or reply to CDP events */
    public handlers: InspectorHandler[] = [
      new NetworkResponseHandler(),
      new PageReloadHandler(metroBundler),
      new VscodeCompatHandler(),
    ];

    onDeviceMessage(message: any, info: DebuggerInfo): boolean {
      return this.handlers.some((handler) => handler.onDeviceMessage?.(message, info) ?? false);
    }

    onDebuggerMessage(message: any, info: DebuggerInfo): boolean {
      return this.handlers.some((handler) => handler.onDebuggerMessage?.(message, info) ?? false);
    }

    /** Hook into the message life cycle to answer more complex CDP messages */
    async _processMessageFromDevice(message: DeviceRequest<any>, info: DebuggerInfo) {
      if (!this.onDeviceMessage(message, info)) {
        await super._processMessageFromDevice(message, info);
      }
    }

    /** Hook into the message life cycle to answer more complex CDP messages */
    _interceptMessageFromDebugger(
      request: DebuggerRequest,
      info: DebuggerInfo,
      socket: WS
    ): boolean {
      // Note, `socket` is the exact same as `info.socket`
      if (this.onDebuggerMessage(request, info)) {
        return true;
      }

      return super._interceptMessageFromDebugger(request, info, socket);
    }
  };
}
