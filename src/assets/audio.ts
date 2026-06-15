let player: HTMLAudioElement | null = null;
const audioKey = "audioEnable";

document.addEventListener("DOMContentLoaded", () => {
  player = document.getElementById("player") as HTMLAudioElement | null;
  if (player) {
    player.muted = !getAudioStatus();
  }
});

// Set audio disable
export const setAudioDisable = () => {
  if (player) player.muted = true;
  localStorage.setItem(audioKey, "false");
};

// Set audio enable
export const setAudioEnable = () => {
  if (player) player.muted = false;
  localStorage.setItem(audioKey, "true");
  play("tap", true);
};

// Set audio status
export const setAudioStatus = (status: boolean) => {
  if (status) setAudioEnable();
  else setAudioDisable();
};

// Get audio status
export const getAudioStatus = () => localStorage.getItem(audioKey) !== "false";

// Play sound function
export const play = async (src: Sound, force = false) => {
  try {
    if (!player) return console.error("Player not found");
    const enable = getAudioStatus();
    if (!force && !enable) return;

    player.src = `/tabata/sounds/${src}.mp3`;
    await player.play();
  } catch (error) {
    console.error(error);
  }
};

type Sound = "beep" | "tap" | "end";
