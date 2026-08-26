import JsonFile from '@expo/json-file';
import resolveFrom from 'resolve-from';

type PackageJson = {
  repository?: string | { url?: string };
};

const EXPO_MANAGED_PACKAGE_EXCEPTIONS = new Set(['expo', 'jest-expo']);

function getRepositoryUrl(repository?: PackageJson['repository']): string | null {
  if (!repository) {
    return null;
  }
  if (typeof repository === 'string') {
    return repository;
  }
  return repository.url ?? null;
}

function isExpoRepositoryUrl(repositoryUrl: string | null): boolean {
  if (!repositoryUrl) {
    return false;
  }

  return /github\.com[:/]expo\//i.test(repositoryUrl);
}

export async function isExpoManagedDependencyAsync(
  projectRoot: string,
  packageName: string
): Promise<boolean> {
  if (packageName.startsWith('@expo/') || EXPO_MANAGED_PACKAGE_EXCEPTIONS.has(packageName)) {
    return true;
  }

  const packageJsonPath = resolveFrom.silent(projectRoot, `${packageName}/package.json`);
  if (!packageJsonPath) {
    return false;
  }

  const packageJson = await JsonFile.readAsync<PackageJson>(packageJsonPath).catch(() => null);
  if (!packageJson) {
    return false;
  }

  return isExpoRepositoryUrl(getRepositoryUrl(packageJson.repository));
}
