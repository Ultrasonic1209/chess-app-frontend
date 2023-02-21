const child_process = require("child_process");
const { readFileSync } = require("fs");

const IS_STATIC = process.env.STATIC && true;
const NO_SW = process.env.NOSW === "1";

const RELEASE = process.env.RELEASE && true;

const { version } = JSON.parse(readFileSync("package.json").toString());

const withPWA = require("next-pwa")({
  disable: NO_SW,
  dest: "public",
  dynamicStartUrl: true,
  cacheOnFrontEndNav: true,
  reloadOnOnline: false,

  fallbacks: {
    image: "/offline.png",
  },

  publicExcludes: ["!nea/**/*"],

  buildExcludes: ["**/*.map"],
});

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const GIT_BRANCH =
  (process.env.GIT_COMMIT_REF ||=
  process.env.VERCEL_GIT_COMMIT_REF ||=
  process.env.CF_PAGES_BRANCH ||=
    child_process
      .execSync("git rev-parse --abbrev-ref HEAD")
      .toString()
      .trim());

const GIT_COMMIT_SHA =
  (process.env.GIT_COMMIT_SHA ||=
  process.env.VERCEL_GIT_COMMIT_SHA ||=
  process.env.CF_PAGES_COMMIT_SHA ||=
    child_process.execSync("git rev-parse HEAD").toString().trim()); // https://stackoverflow.com/a/35778030

var APP_NAME;

if (RELEASE) {
  APP_NAME = "Checkmate";
} else if (process.env.__VERCEL_DEV_RUNNING) {
  APP_NAME = "Checkmate Pre";
} else {
  switch (GIT_BRANCH) {
    case "master":
      APP_NAME = "Checkmate";
      break;
    case "staging":
      APP_NAME = "Checkmate Dev";
      break;
    default:
      APP_NAME = "Checkmate Pre";
  }
}

const date = new Date();

const globalHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },

  {
    key: "last-modified",
    value: date.toUTCString(),
  },

  {
    key: "x-git-commit-sha",
    value: GIT_COMMIT_SHA,
  },

  {
    key: "Permissions-Policy", // https://www.permissionspolicy.com/
    value:
      "accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(), geolocation=(), gyroscope=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=(), clipboard-read=(), clipboard-write=(self), gamepad=(), speaker-selection=()",
  },

  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },

  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },

  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  experimental: {
    newNextLinkBehavior: true /* this is not documented properly AT ALL. */,
    optimizeCss: true,
    //esmExternals: false // for preact compat
  },
  /*webpack: (config) => {
        // this will override the experiments
        config.experiments = { ...config.experiments, ...{ topLevelAwait: true }};
        // this will just update topLevelAwait property of config.experiments
        // config.experiments.topLevelAwait = true 
        return config;
      },*/
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "http.cat",
        pathname: "/*",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/*",
      },
      {
        protocol: "https",
        hostname: "chessapp.ultras-playroom.xyz",
        pathname: "/*",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ["image/avif", "image/webp"],
    unoptimized: IS_STATIC,
  },
  async headers() {
    // for vercel
    return [
      {
        source: "/:path*",
        headers: globalHeaders,
      },
    ];
  },
  env: {
    appName: APP_NAME,
    appVersion: RELEASE && version,
    lastModified: date.toLocaleString(),
    friendlyCaptchaSitekey: "FCMM6JV285I5GS1J",
  },
};

const plugins = [withPWA, withBundleAnalyzer];

// eslint-disable-next-line no-unused-vars
module.exports = (_phase, { defaultConfig }) => {
  return plugins.reduce((acc, plugin) => plugin(acc), { ...nextConfig });
};
