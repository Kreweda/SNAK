// Definicja tytułów nocy
const nightTitles = [
    "Noc 1 - Zjawa Koteu",
    "Noc 2 - Śmiech na (nie) pustej sali",
    "Noc 3 - Nie oglądaj się za siebie",
    "Noc 4 - Bez ryzyka nie ma Koteua",
    "Noc 5 - Upadek wytrwałych",
    "Noc 6 - Gorzej być (nie) może"
];

let currentNight = 1;
let currentTime = 0;
let intervalId;

// Elementy DOM
const nightTitle = document.getElementById('night-title');
const timeDisplay = document.getElementById('time-display');
const startButton = document.getElementById('start-button');
const flashlightButton = document.getElementById('flashlight-button');
const endPopup = document.getElementById('end-popup');
const popupText = document.getElementById('popup-text');
const nextNightButton = document.getElementById('next-night-button');
const restartButton = document.getElementById('restart-button');
const continueButton = document.getElementById('continue-button');

// Funkcja aktualizująca zegar
function updateClock() {
    currentTime++;
    const hours = Math.floor(currentTime / 60);
    const minutes = currentTime % 60;
    timeDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    if (hours === 6) {
        clearInterval(intervalId);
        showEndPopup();
    }
}

// Rozpoczęcie zegara
startButton.addEventListener('click', () => {
    if (intervalId) clearInterval(intervalId);
    currentTime = 0;
    timeDisplay.textContent = '00:00';
    intervalId = setInterval(updateClock, 1000); // Każda minuta to 1 sekunda
});

// Wyświetlenie okienka po zakończeniu nocy
function showEndPopup() {
    const nightName = nightTitles[currentNight - 1];
    if (currentNight < 6) {
        popupText.textContent = `Przetrwałeś ${nightName}. Ale czy uda ci się dalej?`;
        nextNightButton.classList.remove('hidden');
        restartButton.classList.add('hidden');
        continueButton.classList.add('hidden');
    } else {
        popupText.textContent = `Przetrwałeś ${nightName}. Odważysz się przejść do nocy 6?`;
        nextNightButton.classList.add('hidden');
        restartButton.classList.remove('hidden');
        continueButton.classList.remove('hidden');
    }
    endPopup.classList.remove('hidden');
}

// Przejście do kolejnej nocy
nextNightButton.addEventListener('click', () => {
    currentNight++;
    nightTitle.textContent = nightTitles[currentNight - 1];
    endPopup.classList.add('hidden');
    timeDisplay.textContent = '00:00';
});

// Opcje po ukończeniu wszystkich nocy
restartButton.addEventListener('click', () => {
    currentNight = 1;
    nightTitle.textContent = nightTitles[currentNight - 1];
    endPopup.classList.add('hidden');
    timeDisplay.textContent = '00:00';
});

continueButton.addEventListener('click', () => {
    currentNight++;
    nightTitle.textContent = nightTitles[currentNight - 1];
    endPopup.classList.add('hidden');
    timeDisplay.textContent = '00:00';
});

// Obsługa latarki
let isFlashlightOn = false; // Zmienna przechowująca stan latarki
let activeTrack = null; // Przechowywanie ścieżki wideo dla latarki

flashlightButton.addEventListener('click', () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Twoje urządzenie nie obsługuje latarki!');
        return;
    }

    if (isFlashlightOn) {
        // Wyłącz latarkę
        if (activeTrack) {
            activeTrack.applyConstraints({ advanced: [{ torch: false }] })
                .catch(() => alert('Nie udało się wyłączyć latarki.'));
            activeTrack.stop(); // Zatrzymanie ścieżki wideo
            activeTrack = null;
        }
        isFlashlightOn = false;
        flashlightButton.textContent = 'Włącz latarkę';
    } else {
        // Włącz latarkę
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                const track = stream.getVideoTracks()[0];
                if (track.getCapabilities().torch) {
                    track.applyConstraints({ advanced: [{ torch: true }] })
                        .then(() => {
                            activeTrack = track; // Zapisanie aktywnej ścieżki
                            isFlashlightOn = true;
                            flashlightButton.textContent = 'Wyłącz latarkę';
                        })
                        .catch(() => alert('Nie udało się włączyć latarki.'));
                } else {
                    alert('Latarka nie jest dostępna na tym urządzeniu.');
                    track.stop();
                }
            })
            .catch(() => alert('Nie udało się uzyskać dostępu do kamery.'));
    }
});
