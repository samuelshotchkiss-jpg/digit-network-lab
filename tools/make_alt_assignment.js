// Builds handouts/alternative-assignment.docx, the reading-and-writing alternative to the app.
// Needs the docx package: run `npm install docx` somewhere on the module path, then
//   node tools/make_alt_assignment.js
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, AlignmentType,
  LevelFormat, BorderStyle,
} = require("docx");

const FONT = "Arial";
const INK = "1B2330", MUTED = "586374", LINK = "2563C9";

const p = (children, opts = {}) => new Paragraph({ spacing: { after: 140, line: 300 }, ...opts, children: [].concat(children) });
const t = (text, o = {}) => new TextRun({ text, font: FONT, size: 22, color: INK, ...o });
const b = (text) => t(text, { bold: true });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [t(text, { color: LINK, underline: {} })] });
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 }, children: [new TextRun({ text, font: FONT, size: 30, bold: true, color: INK })] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 }, children: [new TextRun({ text, font: FONT, size: 25, bold: true, color: INK })] });
const bullet = (children) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80, line: 290 }, children: [].concat(children) });
// numbered questions continue across the whole document
const q = (text) => new Paragraph({ numbering: { reference: "questions", level: 0 }, spacing: { before: 120, after: 80, line: 300 }, children: [t(text)] });
const answer = () => new Paragraph({
  spacing: { after: 240 }, indent: { left: 720 },
  border: { left: { style: BorderStyle.SINGLE, size: 12, color: "CFD6DF", space: 8 } },
  children: [t("Your answer:", { color: MUTED, italics: true })],
});
const source = (label, url, note) => bullet([link(label, url)].concat(note ? [t(" " + note, { color: MUTED })] : []));

const children = [
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Neural Networks and AI Ethics", font: FONT, size: 40, bold: true, color: INK })] }),
  p(t("A reading and writing assignment: the alternative to the Digit Network Lab", { size: 26, color: MUTED }), { spacing: { after: 280 } }),

  p([t("This assignment covers the same material as the Digit Network Lab app, using videos, books, and articles made by people. You can choose it instead of the app for any reason, including not wanting to use a tool that was built by an AI. Choosing it won't affect your grade.")]),
  p([t("Plan on about three class periods. Make your own copy of this document (in Google Docs: File > Make a copy), write your answers under each question, and upload it to the Canvas assignment. Answers of a few sentences are fine unless a question asks for more.")]),

  h1("Part 1: How a neural network works"),
  p(t("About one class period. Watch and read these, in order:")),
  source("3Blue1Brown, \"But what is a neural network?\"", "https://youtu.be/aircAruvnKk", "(video, about 19 minutes)"),
  source("Queensland Brain Institute, \"What is a neuron?\"", "https://qbi.uq.edu.au/brain/brain-anatomy/what-neuron", "(short reading on real neurons)"),
  source("Michael Nielsen, Neural Networks and Deep Learning, Chapter 1", "https://neuralnetworksanddeeplearning.com/chap1.html", "(read the sections \"Perceptrons\" and \"Sigmoid neurons\")"),
  source("3Blue1Brown, \"Gradient descent, how neural networks learn\"", "https://www.3blue1brown.com/lessons/gradient-descent"),
  source("3Blue1Brown, \"Backpropagation, intuitively\"", "https://www.3blue1brown.com/lessons/backpropagation"),
  h2("Questions"),
  q("Describe how a real neuron decides whether to fire, and how an artificial neuron (Nielsen's perceptron) decides. Name two ways they're different."),
  answer(),
  q("Explain weights and bias in your own words. Then make up your own example of a perceptron with three inputs, like Nielsen's example about whether to go to a festival. Give each input a weight and choose a threshold."),
  answer(),
  q("Nielsen switches from perceptrons, which output only 0 or 1, to sigmoid neurons, which output any number between 0 and 1. Why does that make it possible for a network to learn?"),
  answer(),
  q("In the first video, what did Grant Sanderson hope the hidden layers would learn to detect? In the second video, what did the trained network's hidden layers actually look like?"),
  answer(),
  q("Why do people test a network on examples that weren't used to train it? What could go wrong if they didn't?"),
  answer(),
  q("Explain backpropagation in two or three sentences, for someone who hasn't watched the videos."),
  answer(),

  h1("Part 2: Ethics"),
  p(t("About one class period. There are three topics. Read the sources for each, then answer its questions.")),

  h2("A. The black box problem"),
  p(t("Large AI systems have billions of weights. Even with every one of them in front of you, it's very hard to say why the system made a particular decision. Researchers call this the black box problem.")),
  source("J. Angwin et al., \"Machine Bias,\" ProPublica, 2016", "https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing"),
  source("J. Dastin, \"Amazon scraps secret AI recruiting tool that showed bias against women,\" Reuters, 2018", "https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G"),
  q("Pick one of the two stories. Who was affected by the system's decisions? Could they find out why a decision was made about them?"),
  answer(),
  q("What do you think a person should be able to learn about an AI decision that affects them? Who should be responsible for making that possible?"),
  answer(),

  h2("B. Whose data?"),
  p(t("A network only learns patterns that are in its training data. The handwritten digits used in the 3Blue1Brown video come from MNIST, a dataset assembled in the 1990s from handwriting by US Census Bureau employees and American high school students.")),
  source("\"MNIST database,\" Wikipedia", "https://en.wikipedia.org/wiki/MNIST_database"),
  source("Gender Shades project (Joy Buolamwini and Timnit Gebru)", "http://gendershades.org/", "(watch the short video on the page)"),
  source("A. Koenecke et al., \"Racial disparities in automated speech recognition,\" PNAS, 2020", "https://www.pnas.org/doi/10.1073/pnas.1915768117", "(read the abstract and the Significance section)"),
  q("Whose handwriting might a network trained only on MNIST read badly? Why?"),
  answer(),
  q("Explain how an AI system can score well on its own tests and still fail for some groups of people. Use Gender Shades or the speech recognition study as your example."),
  answer(),

  h2("C. Energy, water, and carbon"),
  p(t("Training GPT-3 in 2020 used an estimated 1,287,000 kWh of electricity (about what 120 US homes use in a year), produced about 552 tonnes of CO₂, and evaporated about 700,000 liters of water for cooling. Those figures are estimates by outside researchers. The companies didn't publish exact numbers, and newer models are much larger.")),
  source("D. Patterson et al., \"Carbon Emissions and Large Neural Network Training,\" 2021", "https://arxiv.org/abs/2104.10350", "(read the abstract)"),
  source("P. Li et al., \"Making AI Less 'Thirsty',\" 2023", "https://arxiv.org/abs/2304.03271", "(read the abstract)"),
  source("Google, \"Measuring the environmental impact of AI inference,\" 2025", "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference", "(the cost of a single question to an AI model)"),
  q("Who should pay the environmental costs of training and running large AI models? Who should get to decide whether they're worth it?"),
  answer(),
  q("Most AI companies don't publish how much electricity and water their models use. Why does that matter?"),
  answer(),

  h1("Part 3: The app you didn't use"),
  p(t("About half a class period. Here is how the Digit Network Lab was made, as of October 8, 2026:")),
  bullet([b("It was \"vibe coded.\" "), t("Your teacher described what they wanted in plain English, and an AI model, Claude Opus 5.5 by Anthropic, wrote all of the code and most of the text. Your teacher tested it and decided what stayed in.")]),
  bullet([b("It used about 40 million tokens "), t("(chunks of text the AI reads or writes). Most of those came from the AI re-reading the whole conversation before each reply. At Anthropic's prices for developers, that would cost a little over $20.")]),
  bullet([b("Estimated electricity: roughly 2.5 to 3 kWh "), t("(outside estimates range from about 0.3 to 5 kWh, because Anthropic doesn't publish these figures). That's about as much as driving an electric car 9 miles or charging a phone 175 times.")]),
  bullet([b("Labor: "), t("a skilled programmer would need an estimated 120 to 240 hours to build the same app, which would cost roughly $7,700 to $36,000. A teacher couldn't have paid for that, so without AI the app wouldn't exist. But when companies make the same trade, fewer people get hired. See ")]
    .concat([link("the Stanford \"Canaries in the Coal Mine\" study", "https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine"), t(" on young workers in jobs exposed to AI.")])),
  bullet([b("Whose knowledge it used: "), t("the AI that wrote the app learned to code largely from programmers who shared their knowledge for free on internet forums, open-source projects, and tutorials. They weren't asked whether their work could be used to train an AI, and they weren't paid for it. The app itself acknowledges this.")]),
  q("Was building the app this way a good choice? Weigh at least one cost against at least one benefit. There isn't a single right answer."),
  answer(),
  q("What would have to be true for you to be comfortable using a tool built by AI? If nothing would make you comfortable, explain why."),
  answer(),

  h1("Part 4: What do you want to look into?"),
  p(t("Use the rest of your time on this. Pick a question about AI that you want to know more about. It can come from something in this assignment, something you've read or heard, or something that worries you or makes you curious.")),
  q("Write your question. Find at least two sources about it, and list them with links. Then write about a page: what you found, what you're still unsure about, and what you'd want to find out next."),
  answer(),
];

const doc = new Document({
  creator: "Digit Network Lab",
  title: "Neural Networks and AI Ethics: alternative assignment",
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: "questions", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 360 } }, run: { bold: true, font: FONT } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1260, bottom: 1260, left: 1300, right: 1300 } } },
    children,
  }],
});

const out = path.join(__dirname, "..", "handouts", "alternative-assignment.docx");
fs.mkdirSync(path.dirname(out), { recursive: true });
Packer.toBuffer(doc).then((buf) => { fs.writeFileSync(out, buf); console.log("wrote", out); });
