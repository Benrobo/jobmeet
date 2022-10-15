import React, { useEffect, useState } from "react";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import { AGORA_ID } from "../../config";


export const AgoraToken: string | null = null;
export const AgoraConfig : ClientConfig = { 
  codec: "h264",
  mode: "rtc"
};
export const useClient = createClient(AgoraConfig);
export const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
export const channelName = "main"