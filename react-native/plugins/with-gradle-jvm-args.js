/**
 * Config plugin: persist Gradle JVM args across `expo prebuild --clean`.
 *
 * Lint analysis on RN 0.79's release build runs out of metaspace with the
 * default 512MB allocation. We bump heap and metaspace here so the bump
 * survives prebuild instead of having to be re-applied to gradle.properties
 * after every regeneration.
 */
const { withGradleProperties } = require('@expo/config-plugins');

const JVM_ARGS = '-Xmx4096m -XX:MaxMetaspaceSize=1536m';

module.exports = function withGradleJvmArgs(config) {
  return withGradleProperties(config, (cfg) => {
    const items = cfg.modResults;
    const idx = items.findIndex(
      (i) => i.type === 'property' && i.key === 'org.gradle.jvmargs'
    );
    if (idx >= 0) {
      items[idx].value = JVM_ARGS;
    } else {
      items.push({ type: 'property', key: 'org.gradle.jvmargs', value: JVM_ARGS });
    }
    return cfg;
  });
};
