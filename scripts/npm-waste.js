hexo.extend.generator.register('npm', function(locals){
    // Object
    return {
      path: './.npmignore',
      data: `fonts/
      .github/
      sw-old.js
      fontsdest/ZhuZiAWan.css
      fontsdest/ZhuZiAWan.eot
      fontsdest/ZhuZiAWan.svg`
};
});