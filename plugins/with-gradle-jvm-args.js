/**
 * Config plugin: persist gradle.properties overrides across `expo prebuild --clean`.
 *
 *   org.gradle.jvmargs                            — bumped so lintVitalAnalyzeRelease
 *                                                    doesn't OOM on metaspace.
 *   reactNativeArchitectures                      — drops x86 + x86_64 (emulator-only)
 *                                                    to roughly halve the AAB size.
 *   android.enableProguardInReleaseBuilds         — code minification on release.
 *   android.enableShrinkResourcesInReleaseBuilds  — drops unreferenced resources.
 *   expo.gif.enabled / expo.webp.enabled          — the app doesn't display GIFs or
 *                                                    WebP, so drop their native Fresco
 *                                                    decoder libs.
 */
const { withGradleProperties } = require('@expo/config-plugins');

const OVERRIDES = {
  'org.gradle.jvmargs': '-Xmx4096m -XX:MaxMetaspaceSize=1536m',
  reactNativeArchitectures: 'armeabi-v7a,arm64-v8a',
  'android.enableProguardInReleaseBuilds': 'true',
  'android.enableShrinkResourcesInReleaseBuilds': 'true',
  'expo.gif.enabled': 'false',
  'expo.webp.enabled': 'false',
};

module.exports = function withGradleJvmArgs(config) {
  return withGradleProperties(config, (cfg) => {
    const items = cfg.modResults;
    for (const [key, value] of Object.entries(OVERRIDES)) {
      const idx = items.findIndex((i) => i.type === 'property' && i.key === key);
      if (idx >= 0) {
        items[idx].value = value;
      } else {
        items.push({ type: 'property', key, value });
      }
    }
    return cfg;
  });
};
