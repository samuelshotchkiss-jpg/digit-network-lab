# Digit Network Lab

A browser-based lab for a 9th-grade AI ethics class. Students build up a neural network that reads handwritten digits, one piece at a time, then use what they saw to discuss the black box problem, training-data bias, and the environmental cost of large AI systems. It's based on 3Blue1Brown's [neural network video](https://youtu.be/aircAruvnKk) and chapter 1 of Michael Nielsen's [Neural Networks and Deep Learning](https://neuralnetworksanddeeplearning.com/chap1.html).

Everything runs in the student's browser. Nothing they draw or type is sent anywhere; answers are saved in the browser's local storage until they download their lab report.

## Structure

| Tab | What students do |
| --- | --- |
| How this app was made (landing page) | Read before using the app: it was vibe coded with Claude Opus 5.5; token count, energy estimate, labor comparison; choose the app or the alternative assignment |
| Start | Compare a biological neuron with an artificial one; solve logic-gate challenges |
| 1 · One neuron | Set the weights of one neuron on a 5×5 grid by hand |
| 2 · One layer | Train ten output neurons with a perceptron rule on 14×14 digits |
| 3 · Hidden layer | Train a 196-16-10 network with backpropagation; sigmoid and backprop walkthroughs |
| 4 · Full network | Explore the video's 196-16-16-10 network; train it in any amount, including one drawing at a time |
| Ethics | Black box problem, whose handwriting is in the data, energy/water/carbon |
| Lab report | Download a PDF of results and answers for Canvas |

## Files

- `app/index.html`: the whole app (HTML, CSS and JavaScript, no build step). The link to the alternative assignment is the `ALT_ASSIGNMENT_URL` constant near the end of the script.
- `app/samples.js`: 6,000 MNIST digits shrunk to 14×14 (5,000 training, 1,000 test).
- `app/build-log.js`: running total of the Claude tokens used to build the app, one entry per version.
- `handouts/alternative-assignment.docx`: the independent-research alternative for students who opt out of the app.
- `tools/make_samples.py`: regenerates `app/samples.js` from the MNIST test set shipped in [DFin's visualiser](https://github.com/DFin/Neural-Network-Visualisation). Clone that repository into `dfin/` first.
- `tools/token_usage.py`: totals token usage from Claude Code's session logs and appends an entry to `app/build-log.js`.
- `tools/make_alt_assignment.js`: regenerates the alternative assignment (needs `npm install docx`).

## Saving a new version

The app's "How this app was made" tab shows the token total for every version, so record it before each commit:

```bash
python tools/token_usage.py --record "Short description of the change"
git add -A
git commit
```

## Running it locally

Serve the `app` folder with any static file server, for example:

```bash
python -m http.server 8766 -d app
```

Then open http://localhost:8766.

## Credits

- Handwriting data: the MNIST database (Y. LeCun, C. Cortes, C. Burges), via DFin's Neural-Network-Visualisation (Apache 2.0).
- PDF export: [jsPDF](https://github.com/parallax/jsPDF), loaded from cdnjs.
- Fonts: Bricolage Grotesque and Lexend, from Google Fonts.
