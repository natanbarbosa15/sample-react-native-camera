import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {saveToCameraRoll} from '../utils/storage';

export default function Camera() {
  const [camera, setCamera] = useState(undefined);
  const [cameraId, setCameraId] = useState(RNCamera.Constants.Type.back);
  const [cameraFlash, setCameraFlash] = useState(
    RNCamera.Constants.FlashMode.off,
  );
  const [statusFlash, setStatusFlash] = useState('Desligado');
  const [statusVideo, setStatusVideo] = useState('Gravar Vídeo');
  const [isRecording, setIsRecording] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  async function recordVideo() {
    if (camera) {
      setStatusVideo('Parar Gravação');
      setIsRecording(true);
      const options = {quality: RNCamera.Constants.VideoQuality['1080p']};
      const data = await camera.recordAsync(options);
      await saveToCameraRoll(data.uri);
    }
  }

  async function stopRecordVideo() {
    if (camera) {
      setStatusVideo('Gravar Vídeo');
      setIsRecording(false);
      camera.stopRecording();
    }
  }

  async function takePhoto() {
    if (camera) {
      const options = {quality: 0.5};
      const data = await camera.takePictureAsync(options);
      await saveToCameraRoll(data.uri);
    }
  }

  function switchCamera() {
    if (cameraId === RNCamera.Constants.Type.back) {
      setCameraId(RNCamera.Constants.Type.front);
      setIsFrontCamera(true);
    } else {
      setCameraId(RNCamera.Constants.Type.back);
      setIsFrontCamera(false);
    }
  }

  function switchFlash() {
    if (cameraFlash === RNCamera.Constants.FlashMode.off) {
      setCameraFlash(RNCamera.Constants.FlashMode.on);
      setStatusFlash('Ligado');
    } else {
      setCameraFlash(RNCamera.Constants.FlashMode.off);
      setStatusFlash('Desligado');
    }
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={(cam) => {
          setCamera(cam);
        }}
        style={styles.preview}
        type={cameraId}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        flashMode={cameraFlash}
        androidCameraPermissionOptions={{
          title: 'Permissão para usar a Câmera',
          message: 'É necessário permitir o uso da Câmera.',
          buttonPositive: 'Permitir',
          buttonNegative: 'Negar',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permissão para usar o Microfone',
          message: 'É necessário permitir o uso do Microfone.',
          buttonPositive: 'Permitir',
          buttonNegative: 'Negar',
        }}
      />
      <View style={styles.groupButtons}>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            disabled={isRecording}
            onPress={takePhoto}
            style={[styles.capture, {opacity: isRecording ? 0 : 1}]}>
            <Text style={styles.button}>Tirar Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              isRecording ? stopRecordVideo() : recordVideo();
            }}
            style={styles.capture}>
            <Text style={styles.button}>{statusVideo}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            disabled={isRecording}
            onPress={switchCamera}
            style={[styles.capture, {opacity: isRecording ? 0 : 1}]}>
            <Text style={styles.button}>Mudar Câmera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isRecording ? true : isFrontCamera ? true : false}
            onPress={switchFlash}
            style={[
              styles.capture,
              {opacity: isRecording ? 0 : isFrontCamera ? 0 : 1},
            ]}>
            <Text style={styles.button}>Flash {statusFlash}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  groupButtons: {
    flex: 0,
    justifyContent: 'center',
    marginTop: 15,
    marginHorizontal: 15,
  },
  buttonsRow: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    fontSize: 14,
    padding: 2,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#C0C0C0',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 8,
    alignSelf: 'center',
    margin: 10,
  },
});
