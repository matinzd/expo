import { vol } from 'memfs';

import { isExpoManagedDependencyAsync } from '../isExpoManagedDependency';

afterEach(() => {
  vol.reset();
});

const projectRoot = '/fake/project';

describe(isExpoManagedDependencyAsync, () => {
  it('treats @expo/* packages as Expo-managed', async () => {
    await expect(isExpoManagedDependencyAsync(projectRoot, '@expo/vector-icons')).resolves.toBe(
      true
    );
  });

  it('treats expo and jest-expo as Expo-managed', async () => {
    await expect(isExpoManagedDependencyAsync(projectRoot, 'expo')).resolves.toBe(true);
    await expect(isExpoManagedDependencyAsync(projectRoot, 'jest-expo')).resolves.toBe(true);
  });

  it('treats packages with Expo repositories as Expo-managed', async () => {
    vol.fromJSON(
      {
        'node_modules/expo-sms/package.json': JSON.stringify({
          name: 'expo-sms',
          repository: {
            type: 'git',
            url: 'git+https://github.com/expo/expo.git',
          },
        }),
      },
      projectRoot
    );

    await expect(isExpoManagedDependencyAsync(projectRoot, 'expo-sms')).resolves.toBe(true);
  });

  it('does not treat similarly-named community packages as Expo-managed', async () => {
    vol.fromJSON(
      {
        'node_modules/expo-speech-recognition/package.json': JSON.stringify({
          name: 'expo-speech-recognition',
          repository: {
            type: 'git',
            url: 'https://github.com/jamsch/expo-speech-recognition',
          },
        }),
      },
      projectRoot
    );

    await expect(isExpoManagedDependencyAsync(projectRoot, 'expo-speech-recognition')).resolves.toBe(
      false
    );
  });
});
