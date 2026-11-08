let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    return audioContext;
}

export function playLaneSound(lane: "left" | "right") {
    const ctx = getAudioContext();

    if (ctx.state === "suspended") {
        void ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = lane === "left" ? 440 : 554.37;

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
}

export function playHitSound() {
    const ctx = getAudioContext();

    if (ctx.state === "suspended") {
        void ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sawtooth";
    oscillator.frequency.value = 110;

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.25);
}
