const synth = window.speechSynthesis; //API

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const voiceSelect = document.querySelector('#voice-select');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const body = document.querySelector('body');

//init voices array
let voices = [];

const getVoices = () => {
    voices = synth.getVoices();

    voices.forEach(voice => {
        const option = document.createElement('option');
        option.textContent = voice.name + ' ('+ voice.lang +') ';
        option.setAttribute('data-lang', voice.lang);
        option.setAttribute('data-name', voice.name);
        voiceSelect.appendChild(option);
    });
};

getVoices();
if(synth.onvoiceschanged !== undefined) {
    synth.onvoiceschanged = getVoices;
}

//Speak
const speak = () => {
    if(synth.speaking) {
        console.error('Already speaking....');
        return;
    }
    if(textInput.value !== '') {
        //background animation
        body.style.background = '#2C3E50 url(img/wave.gif)';
        body.style.backgroundRepeat = 'repeat-x';
        body.style.backgroundSize = '100% 100%';

        const speakText = new SpeechSynthesisUtterance(textInput.value);

        //speak end
        speakText.onend = e => {
            console.log('Done speaking....');
            body.style.background = '#2C3E50';
        }

        //speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        }

        //selected voice
        const selectedVoice = voiceSelect.selectedOptions[0]
        .getAttribute('data-name');

        //loop through voices
        voices.forEach(voice => {
            if(voice.name === selectedVoice) {
                speakText.voice = voice;
            }
        });

        //rate and pitch
        speakText.rate = rate.value;
        speakText.pitch = pitch.value;

        //speak
        synth.speak(speakText);
    }
};

//Event listeners

//text form
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});

//rate value change
rate.addEventListener('change', e => rateValue.textContent = rate.value)

//pitch value change
pitch.addEventListener('change', e => pitchValue.textContent = pitch.value)

//voice select change
voiceSelect.addEventListener('change', e => speak());