const util = require('util');
const Busboy = require('busboy');
const axios = require('axios');
const path = require('path');
const os = require('os');
const fs = require('fs');
const config = require('../config');

const express = require('express');
const watson = require('../watson-services.js');
var router = express.Router();

// classify an image
router.post('/classify', (req, res, next) => {

  const busboy = new Busboy({ headers: req.headers });
  let filePath;
  let model;
  let threshold;

  busboy.on('file', (fieldName, file, fileName, encoding, mimetype) => {

    if (filePath)
      file.resume();

    filePath = path.join(os.tmpdir(), fieldName);
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('field', (fieldname, value, fieldnameTruncated, valueTruncated, encoding, mimetype) => {

    if (fieldname === 'threshold')
      threshold = value;
    else if (fieldname === 'model')
      model = value;
  });

  busboy.on('finish', () => {

    const image = fs.createReadStream(filePath);

    // log time to make image prediction
    console.time('predictionCall');

    return axios.get(config.model.api_base_url)
      .then(results => {
        console.time('predictionCall');
        return res.status(200).send(results.data);
      })
      .catch(err => next(err));
  });

  busboy.end(req.rawBody);
})


// get models
router.get('/classifiers', (req, res, next) => {

  watson.getClassifiers(true, (err, results) => {
    if (err)
      return next(err);

    return res.status(200).send(results);
  });
})

// update model
router.put('/classifiers', (req, res, next) => {

  watson.updateModel(posClassNames, posFiles, negFiles, classifierId, (err, results) => {
    if (err)
      return next(err);

    return res.status(200).send(results);
  });
})

// download CoreMlModel
router.get('/coreMlModels/:classifierId', (req, res, next) => {

  watson.downloadCoreMlModel(classifierId, (err, results) => {
    if (err)
      return next(err);

    return res.status(200).send(results);
  });

})

module.exports = router;
