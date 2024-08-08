#!/usr/bin/env zx

const token = process.env.API_TOKEN_GITHUB;
const repo = `https://${token}:x-oauth-basic@github.com/BuilderIO/morpho-build.git`;
const srcRepoRef = 'https://github.com/BuilderIO/morpho/commit/';
const root = __dirname + '/..';
const packages_core = root + '/packages/core';
const morpho_build = packages_core + '/morpho-build';

(async () => {
  await $`rm -rf ${morpho_build}`;
  const SHA = String(await $`git rev-parse HEAD`).trim();
  cd(`${root}/packages/core`);
  await $`git clone ${repo}`;
  const branch = await $`git branch --show-current`;
  const msg = String(await $`git log --oneline -1 --no-decorate`).trim();
  const userName = String(await $`git log -1 --pretty=format:'%an'`).trim();
  const userEmail = String(await $`git log -1 --pretty=format:'%ae'`).trim();

  cd(`${morpho_build}`);
  await $`git checkout ${branch} || git checkout -b ${branch}`;
  cd(`${packages_core}`);
  await $`cp -r CHANGELOG.md package.json README.md dist ${morpho_build}`;
  cd(`${morpho_build}`);
  await $`git add --all`;
  await $`git -c user.name=${userName} -c user.email=${userEmail} commit --allow-empty -m ${msg +
    '\n\n' +
    srcRepoRef +
    SHA}`;
  const dstSHA = String(await $`git rev-parse HEAD`).trim();
  console.log('##############################################################');
  console.log('##############################################################');
  console.log(
    `### https://github.com/BuilderIO/morpho-build/commit/${dstSHA}`,
  );
  console.log('##############################################################');
  console.log('##############################################################');
  await $`git push ${repo} HEAD:${branch}`;
  await $`rm -rf ${morpho_build}`;
})();
