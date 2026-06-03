function getImages(req, res) {
  const mainImages = _getImagePaths('public/assets/images');
  const iconImages = _getImagePaths('public/assets/images/icons');

  res.json([...mainImages, ...iconImages]);
}

function _getImagePaths(dir) {
  const fs = require('fs');
  const path = require('path');

  return fs.readdirSync(dir)
    .filter(file => /\.(jpg|jpeg|png|gif|svg)$/.test(file))
    .map(file => path.join(dir.replace('public/', ''), file));
}

module.exports = {
  getImages
};
