import React from 'react';
import './Piano.css';

const frequencies = [];
let frequency = 55; // start note (A) Frequency
const factor = Math.pow(2, 1 / 12); // factor between each note with its higher/lower note. (factor = 2 ^ (1 / 12)) 

// I'm not a musician, so the word 'octave' here may not be correct
// but I think an 'octave' is each series of notes from 'C' to 'B' => C, C#, D, ... B
const numberOfOctaves = 4; // and also you can change this number to see the result. for example change it to '2'...
// filling the whole 'A' notes in piano
for (let i = 0; i < numberOfOctaves; i++) {
    frequencies.push(frequency);
    frequency *= 2; // Freq = note * 2 ^ (N / 12)
}
// a handler for playing a special note for 0.5 second
const handlePlayFrequency = f => {
    let context = new AudioContext();
    let o = context.createOscillator();
    let g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.frequency.value = f;
    g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.5);
    o.start(0);
}

// get name of the note according to its index
const getName = (index) => ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'][index];

const Piano = (props) => {
    // detecting the black keys in piano
    const isBlack = (index) => {
        index++;
        let rem = index % 12;
        return index !== 0 && ([2 ,5 ,7 , 10, 0].indexOf(rem) !== -1) 
    }
    // renders each octave
    const renderOctave = (f, index) => {
        let res = [];
        for (let i = 0; i < 12; i++) {
            res.push(frequencies[index]);
            frequencies[index] *= factor; // Freq(A2) = Freq(A1) * 2 ^ (N / 12)  | 2 ^ (N / 12) = factor
        }
        let render = res.map((frequency, idx) => {
            // do not render the last G# ! => cause the ui is going to be ugly :(
            if (index === numberOfOctaves - 1 && idx === 11) return null;
            return (
                <div
                    key={frequency}
                    className={`piano__button--${isBlack(idx) ? 'black' : 'white'} piano__button`}
                    onClick={handlePlayFrequency.bind(null, frequency)}
                >
                    {getName(idx)}
                </div>
            )
        });
        return render;
    }

    // returns the piano component
    return (
        <div className="piano">
            {frequencies.map((f, index) => renderOctave(f, index))}
            <div className="sign">By: MS.Kashef</div>
        </div>
    )
}

export default Piano; // export the component