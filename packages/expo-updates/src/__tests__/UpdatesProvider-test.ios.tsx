import { act, fireEvent, render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import React from 'react';

import * as Updates from '..';
import type { Manifest, UpdateEvent } from '..';
import ExpoUpdates from '../ExpoUpdates';
import { availableUpdateFromManifest, updatesInfoFromEvent } from '../UpdatesProvider.utils';
import { UpdatesProviderTestApp } from './UpdatesProviderTestApp';

const { UpdatesLogEntryCode, UpdatesLogEntryLevel, UpdateEventType } = Updates;
const { extraPropertiesFromManifest, UpdatesProvider } = Updates.Provider;

jest.mock('../ExpoUpdates', () => {
  return {
    channel: 'main',
    updateId: '0000-1111',
    commitTime: '2023-03-26T04:58:02.560Z',
  };
});

describe('Updates provider and hook tests', () => {
  describe('Test hook and provider', () => {
    beforeAll(() => {
      ExpoUpdates.nativeDebug = true;
    });

    it('App with provider shows currently running info', async () => {
      render(
        <UpdatesProvider>
          <UpdatesProviderTestApp />
        </UpdatesProvider>
      );
      const updateIdView = await screen.findByTestId('currentlyRunning_updateId');
      expect(updateIdView).toHaveTextContent('0000-1111');
      const createdAtView = await screen.findByTestId('currentlyRunning_createdAt');
      expect(createdAtView).toHaveTextContent('2023-03-26T04:58:02.560Z');
      const channelView = await screen.findByTestId('currentlyRunning_channel');
      expect(channelView).toHaveTextContent('main');
    });

    it('App with provider shows available update after running checkForUpdate()', async () => {
      render(
        <UpdatesProvider>
          <UpdatesProviderTestApp />
        </UpdatesProvider>
      );
      const mockDate = new Date();
      const mockManifest = {
        id: '0000-2222',
        createdAt: mockDate.toISOString(),
        runtimeVersion: '1.0.0',
        launchAsset: {
          url: 'testUrl',
        },
        assets: [],
        metadata: {},
      };
      ExpoUpdates.checkForUpdateAsync = jest.fn().mockReturnValueOnce({
        isAvailable: true,
        manifest: mockManifest,
      });
      const buttonView = await screen.findByTestId('checkForUpdate');
      act(() => {
        fireEvent(buttonView, 'press');
      });
      const updateIdView = await screen.findByTestId('availableUpdate_updateId');
      expect(updateIdView).toHaveTextContent('0000-2222');
    });

    it('App with provider shows log entries after running readLogEntries()', async () => {
      ExpoUpdates.readLogEntriesAsync = jest.fn().mockReturnValueOnce([
        {
          timestamp: 100,
          message: 'Message 1',
          code: UpdatesLogEntryCode.NONE,
          level: UpdatesLogEntryLevel.INFO,
        },
      ]);
      render(
        <UpdatesProvider>
          <UpdatesProviderTestApp />
        </UpdatesProvider>
      );
      const buttonView = await screen.findByTestId('readLogEntries');
      act(() => {
        fireEvent(buttonView, 'press');
      });
      const logEntryView = await screen.findByTestId('logEntry');
      expect(logEntryView).toHaveTextContent('Message 1');
    });
  });

  describe('Test individual methods', () => {
    const mockDate = new Date();
    const manifest: Manifest = {
      id: '0000-2222',
      createdAt: mockDate.toISOString(),
      runtimeVersion: '1.0.0',
      launchAsset: {
        url: 'testUrl',
      },
      assets: [],
      metadata: {},
    };

    it('availableUpdateFromManifest() with a manifest', () => {
      const result = availableUpdateFromManifest(manifest);
      expect(result?.updateId).toEqual('0000-2222');
      expect(result?.createdAt).toEqual(mockDate);
      expect(result?.manifest).toEqual(manifest);
    });

    it('availableUpdateFromManifest() with undefined manifest', () => {
      const result = availableUpdateFromManifest(undefined);
      expect(result).toBeUndefined();
    });

    it('updatesInfoFromEvent() when update is available', () => {
      const event: UpdateEvent = {
        type: UpdateEventType.UPDATE_AVAILABLE,
        manifest,
      };
      const updatesInfo = updatesInfoFromEvent(event);
      expect(updatesInfo.currentlyRunning.updateId).toEqual('0000-1111');
      expect(updatesInfo.availableUpdate?.updateId).toEqual('0000-2222');
    });

    it('updatesInfoFromEvent() when update is not available', () => {
      const event: UpdateEvent = {
        type: UpdateEventType.NO_UPDATE_AVAILABLE,
      };
      const updatesInfo = updatesInfoFromEvent(event);
      expect(updatesInfo.currentlyRunning.updateId).toEqual('0000-1111');
      expect(updatesInfo.availableUpdate).toBeUndefined();
      expect(updatesInfo.error).toBeUndefined();
    });

    it('updatesInfoFromEvent() when an error occurs', () => {
      const event: UpdateEvent = {
        type: UpdateEventType.ERROR,
        message: 'It broke',
      };
      const updatesInfo = updatesInfoFromEvent(event);
      expect(updatesInfo.currentlyRunning.updateId).toEqual('0000-1111');
      expect(updatesInfo.availableUpdate).toBeUndefined();
      expect(updatesInfo.error?.message).toEqual('It broke');
    });

    it('extraPropertiesFromManifest() when properties exist', () => {
      const manifestWithExtra: Partial<Manifest> = {
        ...manifest,
        extra: {
          expoClient: {
            extra: {
              eas: {
                projectId: '0000-xxxx',
              },
              stringProp: 'message',
              booleanProp: true,
              nullProp: null,
              numberProp: 1000,
            },
          },
        },
      };
      const result = extraPropertiesFromManifest(manifestWithExtra);
      expect(result['stringProp']).toEqual('message');
      expect(result['booleanProp']).toBe(true);
      expect(result['nullProp']).toBeNull();
      expect(result['numberProp']).toEqual(1000);
      expect(result['bogusProp']).toBeUndefined();
      // 'eas' property should be excluded
      expect(result['eas']).toBeUndefined();
    });

    it('extraPropertiesFromManifest() with no extras in manifest', () => {
      const result = extraPropertiesFromManifest(manifest);
      expect(Object.keys(result)).toHaveLength(0);
    });
  });
});
