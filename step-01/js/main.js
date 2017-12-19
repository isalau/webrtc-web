'use strict';

// Define navigator.mediaDevices.getUserMedia() for older devices.

// Old browsers might not implement mediaDevices, so we set an empty object.
if (navigator.mediaDevices === undefined) navigator.mediaDevices = {};

// Add mediaDevices.getUserMedia method if it's missing.
if (navigator.mediaDevices.getUserMedia === undefined) {

  /**
   * Gets a stream of media content containing tracks of video or audio.
   * Produces a Promise which resolves into a MediaStream object.
   * @param {!MediaStreamConstraints} constraints to apply to the media stream.
   * @return {!Promise} Promise which resolves to a MediaStream.
   */
  navigator.mediaDevices.getUserMedia = (constraints) => {
    // Leverage legacy getUserMedia, if it is defined.
    const getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    // If legacy method is also not defined, resolve Promise as an error.
    if (!getUserMedia) {
      return Promise.reject(
        new Error('getUserMedia is not implemented in this browser'));
    }

    // Otherwise, wrap the call to the navigator.getUserMedia with a Promise.
    return new Promise(function(resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  }
}

// Codelab starts here.

/**
 * Constraints to apply to MediaStream.
 * On this codelab, we will be streaming video, but not audio.
 * @type {!MediaStreamConstraints}
 */
const mediaStreamConstraints = {
  audio: false,
  video: true,
};

/** @type {!Element} Video element where stream will be placed. */
const localVideo = document.querySelector('video');

/**
 * Handles success by adding the MediaStream to the video element.
 * @param {!MediaStream} mediaStream generated by getUserMedia to add to video.
 */
const localMediaStreamSuccessCallback = (mediaStream) => {
  window.localStream = mediaStream;  // Makes stream available to the console.
  if (window.URL) {
    localVideo.src = window.URL.createObjectURL(mediaStream);
  } else {
    localVideo.src = mediaStream;
  }
};

/**
 * Handles error by logging a message to the console with the error message.
 * @param {!Error} error that was generated by getUserMedia.
 */
const localMediaStreamErrorCallback = (error) => {
  console.log('navigator.getUserMedia error: ', error);
};

// Initializes media stream.
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(localMediaStreamSuccessCallback, localMediaStreamErrorCallback);
