import {Platform} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
const moment = require('moment');
const RNFS = require('react-native-fs');

const dirHome = Platform.select({
  ios: `${RNFS.DocumentDirectoryPath}`,
  android: `${RNFS.DocumentDirectoryPath}`,
});

const dirPicutures = `${dirHome}/Pictures`;
const dirAudio = `${dirHome}/Audio`;

async function moveAttachment(filePath, newFilepath) {
  return new Promise((resolve, reject) => {
    RNFS.mkdir(dirPicutures)
      .then(() => {
        RNFS.moveFile(filePath, newFilepath)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error.message);
        reject(error);
      });
  });
}

async function deleteCacheImage(filepath) {
  RNFS.exists(filepath)
    .then((result) => {
      if (result) {
        return RNFS.unlink(filepath).catch((error) => {
          console.log(error.message);
        });
      }
    })
    .catch((error) => {
      console.log(error.message);
    });
}

export async function saveImageToStorage(filePath) {
  try {
    // Set new image name and filepath
    const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
    const newFilepath = `${dirPicutures}/${newImageName}`;
    // Move and save image to new filepath
    await moveAttachment(filePath, newFilepath);
  } catch (error) {
    console.log(error);
  }
}

export async function saveToCameraRoll(filePath) {
  try {
    // Save image to Photo Library
    await CameraRoll.save(filePath, {album: 'TesteMobile'});
    // Delete cache Image
    await deleteCacheImage(filePath);
  } catch (error) {
    console.log(error);
  }
}
