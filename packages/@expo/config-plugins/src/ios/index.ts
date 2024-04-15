import * as Bitcode from './Bitcode';
import * as BuildProperties from './BuildProperties';
import * as BuildScheme from './BuildScheme';
import * as BundleIdentifier from './BundleIdentifier';
import * as DeviceFamily from './DeviceFamily';
import * as Entitlements from './Entitlements';
import * as Google from './Google';
import { ExpoPlist, InfoPlist } from './IosConfig.types';
import * as Locales from './Locales';
import * as Maps from './Maps';
import * as Name from './Name';
import * as Orientation from './Orientation';
import * as Paths from './Paths';
import * as Permissions from './Permissions';
import * as ProvisioningProfile from './ProvisioningProfile';
import * as RequiresFullScreen from './RequiresFullScreen';
import * as Scheme from './Scheme';
import * as Swift from './Swift';
import * as Target from './Target';
import * as Updates from './Updates';
import * as UsesNonExemptEncryption from './UsesNonExemptEncryption';
import * as Version from './Version';
import * as XcodeProjectFile from './XcodeProjectFile';
import * as PrivacyInfo from './PrivacyInfo';
import * as XcodeUtils from './utils/Xcodeproj';

// We can change this to export * as X with TypeScript 3.8+
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#export-star-as-namespace-syntax
// .. but we should wait for this to be the default VSCode version.
export { InfoPlist, ExpoPlist, Entitlements, Paths, Permissions, XcodeUtils };

export {
  Bitcode,
  BundleIdentifier,
  BuildProperties,
  BuildScheme,
  DeviceFamily,
  Google,
  Maps,
  Locales,
  Name,
  Orientation,
  ProvisioningProfile,
  RequiresFullScreen,
  Scheme,
  Swift,
  Target,
  Updates,
  UsesNonExemptEncryption,
  Version,
  XcodeProjectFile,
  PrivacyInfo,
};
