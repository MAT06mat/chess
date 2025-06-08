function playSound(soundName: string) {
    const audio = new Audio(
        `https://images.chesscomfiles.com/chess-themes/sounds/_MP3_/default/${soundName}.mp3`
    );

    console.log("played", soundName);
    audio.play().catch((error) => {
        console.error(`Error playing sound ${soundName}:`, error);
    });
}

export default playSound;
