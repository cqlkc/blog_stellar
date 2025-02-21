hexo.extend.generator.register('npmpush', function(locals){
    // Object
    return {
      path: '/.github/workflows/autopublish.yml',
      data: `name: Node.js Package
  # 监测分支，2020年10月后github新建仓库默认分支改为main，记得更改
on:
  push:
    branches:
        - master
jobs:
  publish-npm:
    runs-on: ubuntu-latest
    steps:
        - uses: actions/checkout@v2
        - uses: actions/setup-node@v1
          with:
            node-version: "12.x"
            registry-url: https://registry.npmjs.org/
        - run: npm publish
          env:
            NODE_AUTH_TOKEN: `+ '${{secrets.npm_token}}'
};
});