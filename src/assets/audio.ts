import { textToSpeech } from "./main";
let player: HTMLAudioElement | null = null;
const audioKey = "audioEnable";

document.addEventListener("DOMContentLoaded", async () => {
  player = document.getElementById("player") as HTMLAudioElement | null;
  if (!player) setAudioDisable();
  else if (getAudioStatus()) player.muted = false;
});

// Set audio disable
export const setAudioDisable = () => {
  if (player) player.muted = true;
  play("tap", true);
  sessionStorage.removeItem(audioKey);
};

// Set audio enable
export const setAudioEnable = () => {
  if (player) player.muted = false;
  play("tap", true);
  sessionStorage.setItem(audioKey, "true");
};

// Set audio status
export const setAudioStatus = (status: boolean) => {
  if (status) setAudioEnable();
  else setAudioDisable();
};

// Get audio status
export const getAudioStatus = () => !!sessionStorage.getItem(audioKey);

// Play sound function
export const play = async (src: Sound, force = false) => {
  if (!player) return console.error("Player not found");
  const enable = getAudioStatus();
  if (!force && !enable) return console.log(src);
  try {
    player.src = `/tabata/sounds/${src}.mp3`;
    await player.play();
  } catch (error) {
    console.error(error);
    setAudioDisable();
  }
};

type Sound = "beep" | "tap" | "end";
