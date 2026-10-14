const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const fs = require("fs");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Custom Metro resolver for package subpath exports unsupported by default Expo 51 Metro resolver
const defaultResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === "@posthog/core/surveys") {
    try {
      const coreMain = require.resolve("@posthog/core", {
        paths: [projectRoot, workspaceRoot],
      });
      const surveysFilePath = path.join(path.dirname(coreMain), "surveys", "index.js");
      if (fs.existsSync(surveysFilePath)) {
        return {
          filePath: surveysFilePath,
          type: "sourceFile",
        };
      }
    } catch (err) {
      // Fall back to default resolver
    }
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;