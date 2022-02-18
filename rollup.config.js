import fs from "fs";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import sourcemaps from "rollup-plugin-sourcemaps";
import postcss from "rollup-plugin-postcss";
import url from "postcss-url";
import replace from "@rollup/plugin-replace";
import childProcess from "child_process";
import { string } from "rollup-plugin-string";
import { terser } from "rollup-plugin-terser";

import inlineSvg from "rollup-plugin-inline-svg";

import pluginConfig from "./plugin.config.json";

const { BUILD, MINIFY, ROLLUP_WATCH } = process.env;
//const minified = MINIFY === 'true';
const production = BUILD === "production";

function getCommitShort() {
  try {
    const commit = childProcess
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
    return commit;
  } catch {
    return null;
  }
}

function getBuildDate() {
  return new Date()
    .toISOString()
    .replace(/[^0-9]/g, "")
    .slice(0, 14);
}

const build = production ? "prod" : BUILD === "testing" ? "testing" : "dev";
const meta = { ...pluginConfig.headers.common, ...pluginConfig.headers[build] };

const version =
  meta.version.replace("BUILDDATE", getBuildDate) +
  (production ? "" : "-" + getCommitShort());

const userscriptHeader = `// ==UserScript==
// @id            ${meta.id}
// @name          ${meta.name}
// @namespace     ${meta.namespace}
// @version       ${version}
// @updateURL     ${meta.updateURL}
// @downloadURL   ${meta.downloadURL}
// @description   ${meta.description}
// @author        ${meta.author}
// @match         https://intel.ingress.com/*
// @category      ${meta.category}
// @grant         none
// ==/UserScript==`;

const outputFile = !production
  ? "releases/dev/wasabee.user.js"
  : "releases/prod/wasabee.user.js";

const config = [
  {
    input: ["src/code/init.ts", "src/code/worker/worker.ts"],
    output: {
      dir: "rollup/build/lib",
      sourcemap: "inline",
      indent: false,
      format: "amd",
			chunkFileNames: 'shared.js'
    },
    treeshake: production,
    plugins: [
      json(),
      inlineSvg(),
      postcss({
        extract: false,
        inject: false,
        plugins: [
          url({
            url: "inline",
          }),
        ],
      }),
      resolve({
        browser: true,
        preferBuiltins: false,
      }),
      commonjs(),
      typescript({ inlineSources: true }),
      production && terser(),
    ],
  },
  {
    input: "rollup/wasabee.js",
    output: {
      name: "wasabee",
      file: "rollup/bundle.js",
      format: production ? "amd" : "iife",
      sourcemap: production ? true : "inline",
      indent: false,
      intro: fs.readFileSync("./rollup/bundle_prelude.js", "utf8"),
    },
    treeshake: false,
    plugins: [
      sourcemaps(),
      replace({
        preventAssignment: true,
        values: {
          __buildVersion__: JSON.stringify(version),
        },
      }),
    ],
  },
  {
    input: production ? "rollup/wasabee.user.js" : "rollup/wasabee-dev.user.js",
    output: {
      name: "wasabee",
      file: outputFile,
      format: "iife",
      indent: false,
      banner: userscriptHeader,
      intro: production && fs.readFileSync("./rollup/user_prelude.js", "utf8"),
    },
    treeshake: false,
    plugins: [
      !production &&
        string({
          include: "rollup/bundle.js",
        }),
    ],
  },
];

export default config;
