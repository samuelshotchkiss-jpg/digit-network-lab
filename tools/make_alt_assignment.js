// Builds handouts/alternative-assignment.docx, the independent-research alternative to the app.
// Needs the docx package: run `npm install docx` somewhere on the module path, then
//   node tools/make_alt_assignment.js
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, ExternalHyperlink, AlignmentType,
  LevelFormat, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
} = require("docx");

const FONT = "Arial";
const INK = "1B2330", MUTED = "586374", LINK = "2563C9", RULE = "CFD6DF", HEAD_FILL = "EEF1F5";

const p = (children, opts = {}) => new Paragraph({ spacing: { after: 140, line: 300 }, ...opts, children: [].concat(children) });
const t = (text, o = {}) => new TextRun({ text, font: FONT, size: 22, color: INK, ...o });
const b = (text) => t(text, { bold: true });
const link = (text, url) => new ExternalHyperlink({ link: url, children: [t(text, { color: LINK, underline: {} })] });
const h1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 360, after: 160 }, children: [new TextRun({ text, font: FONT, size: 30, bold: true, color: INK })] });
const h2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 260, after: 100 }, children: [new TextRun({ text, font: FONT, size: 25, bold: true, color: INK })] });
const bullet = (children) => new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80, line: 290 }, children: [].concat(children) });
const source = (label, url, note) => bullet([link(label, url)].concat(note ? [t(" " + note, { color: MUTED })] : []));

// research log table: content width is 12240 - 2 * 1300 = 9640 DXA
const COLS = [3400, 3400, 2840];
const cellBorders = { top: { style: BorderStyle.SINGLE, size: 4, color: RULE }, bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE }, left: { style: BorderStyle.SINGLE, size: 4, color: RULE }, right: { style: BorderStyle.SINGLE, size: 4, color: RULE } };
const cell = (text, w, head) => new TableCell({
  width: { size: w, type: WidthType.DXA }, borders: cellBorders,
  shading: head ? { type: ShadingType.CLEAR, color: "auto", fill: HEAD_FILL } : undefined,
  margins: { top: 80, bottom: 80, left: 100, right: 100 },
  children: [new Paragraph({ children: [t(text, head ? { bold: true, size: 20 } : { size: 20 })] })],
});
const logTable = new Table({
  width: { size: 9640, type: WidthType.DXA }, columnWidths: COLS,
  rows: [
    new TableRow({ tableHeader: true, children: [cell("Source (title and link)", COLS[0], true), cell("What you took from it", COLS[1], true), cell("What it made you want to look up next", COLS[2], true)] }),
    ...Array.from({ length: 6 }, () => new TableRow({ height: { value: 700, rule: "atLeast" }, children: COLS.map((w) => cell("", w)) })),
  ],
});

const children = [
  new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: "Neural Networks and AI Ethics", font: FONT, size: 40, bold: true, color: INK })] }),
  p(t("An independent research assignment: the alternative to the Digit Network Lab", { size: 26, color: MUTED }), { spacing: { after: 280 } }),

  p([t("This is the alternative to the Digit Network Lab app. You can choose it for any reason, including not wanting to use a tool that was built by an AI. Choosing it won't affect your grade. You have three class periods.")]),

  h1("How it works"),
  p([t("Below are five topics, each with a few sources to start from. "), b("You decide where to go."), t(" Start with whatever interests you. Follow links and references from one source to the next, find your own sources, and skip anything that doesn't hold your attention. You can go deep on one topic or range across several.")]),
  p([t("Keep a research log as you go (at the end of this document). At the end, you'll present what you found to Mr. Hotchkiss, in whatever format suits you.")]),

  h1("Starting points"),

  h2("How neural networks work"),
  p(t("A neural network is built from simple pieces called artificial neurons, loosely modeled on nerve cells in the brain. A network learns by adjusting thousands or billions of numbers called weights.")),
  source("3Blue1Brown, neural networks series", "https://www.3blue1brown.com/topics/neural-networks", "(animated videos; the first one is the basis for the app)"),
  source("Michael Nielsen, Neural Networks and Deep Learning", "https://neuralnetworksanddeeplearning.com/chap1.html", "(a free online book; chapter 1 starts from scratch)"),
  source("Queensland Brain Institute, \"What is a neuron?\"", "https://qbi.uq.edu.au/brain/brain-anatomy/what-neuron", "(how real neurons work)"),
  source("\"Perceptron,\" Wikipedia", "https://en.wikipedia.org/wiki/Perceptron", "(the history, going back to the 1940s and 1950s)"),

  h2("The black box problem"),
  p(t("Large AI systems make decisions using billions of weights. Even with all of them in view, it is very hard to say why the system decided what it did. These systems are used in hiring, lending, medicine, and courts.")),
  source("J. Angwin et al., \"Machine Bias,\" ProPublica, 2016", "https://www.propublica.org/article/machine-bias-risk-assessments-in-criminal-sentencing", "(a risk-scoring tool used in US courts)"),
  source("J. Dastin, \"Amazon scraps secret AI recruiting tool that showed bias against women,\" Reuters, 2018", "https://www.reuters.com/article/us-amazon-com-jobs-automation-insight-idUSKCN1MK08G"),
  source("\"Explainable artificial intelligence,\" Wikipedia", "https://en.wikipedia.org/wiki/Explainable_artificial_intelligence", "(efforts to make AI decisions understandable)"),

  h2("Whose data?"),
  p(t("A network learns only the patterns in its training data. The handwritten digits used to teach the 3Blue1Brown network were written in the 1990s by US Census Bureau employees and American high school students. Other systems have been trained on data that leaves whole groups of people out.")),
  source("\"MNIST database,\" Wikipedia", "https://en.wikipedia.org/wiki/MNIST_database", "(where the handwritten digits came from)"),
  source("Gender Shades project (Joy Buolamwini and Timnit Gebru)", "http://gendershades.org/", "(face recognition accuracy across skin tones and genders)"),
  source("A. Koenecke et al., \"Racial disparities in automated speech recognition,\" PNAS, 2020", "https://www.pnas.org/doi/10.1073/pnas.1915768117"),

  h2("Energy, water, and carbon"),
  p(t("Training and running AI models takes a lot of electricity, and data centers use water for cooling. Most companies don't publish exact figures, so much of what is known comes from outside researchers' estimates.")),
  source("D. Patterson et al., \"Carbon Emissions and Large Neural Network Training,\" 2021", "https://arxiv.org/abs/2104.10350", "(estimates for training GPT-3 and other models)"),
  source("P. Li et al., \"Making AI Less 'Thirsty',\" 2023", "https://arxiv.org/abs/2304.03271", "(water use)"),
  source("Google, \"Measuring the environmental impact of AI inference,\" 2025", "https://cloud.google.com/blog/products/infrastructure/measuring-the-environmental-impact-of-ai-inference", "(a company's own figures for a single AI question)"),
  source("Epoch AI, \"How much energy does ChatGPT use?\"", "https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use"),
  source("S. Couch, \"Electricity use of AI coding agents,\" 2026", "https://simonpcouch.com/blog/2026-01-20-cc-impact/", "(the method used to estimate the app's energy use)"),

  h2("How AI tools get built, and who pays"),
  p(t("The Digit Network Lab is an example. As of October 8, 2026:")),
  bullet([t("It was \"vibe coded\": Mr. Hotchkiss described what he wanted in plain English, and an AI model, Claude Opus 5.5 by Anthropic, wrote the code and most of the text.")]),
  bullet([t("It used about 45 million tokens (chunks of text the AI reads or writes), roughly 2.5 to 3 kWh of electricity by middle estimates (outside estimates range from about 0.3 to 5 kWh), and a little over $20 at Anthropic's prices for developers.")]),
  bullet([t("A skilled programmer would need an estimated 120 to 240 hours to build it, which would cost roughly $7,700 to $36,000.")]),
  bullet([t("The AI learned to code largely from programmers who shared their knowledge for free on forums, in open-source projects, and in tutorials. They weren't asked whether their work could be used this way, and they weren't paid for it.")]),
  source("E. Brynjolfsson, B. Chandar, R. Chen, \"Canaries in the Coal Mine?\" Stanford Digital Economy Lab", "https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine", "(AI and jobs for young workers)"),
  source("US Bureau of Labor Statistics, \"Software Developers\"", "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm"),

  h1("Present your findings"),
  p([t("By the end of the third class, present what you found to Mr. Hotchkiss. "), b("You choose the format:"), t(" a written piece, a slide deck, a short recorded talk, a poster or infographic, or a conversation with Mr. Hotchkiss (set up a time in advance).")]),
  p(t("Whatever the format, include:")),
  bullet(t("what you looked into, and why it interested you")),
  bullet(t("what you found out")),
  bullet(t("something that surprised you, changed your mind, or that you disagree with")),
  bullet(t("what you'd still want to know")),
  bullet(t("your sources")),
  p(t("Upload your presentation, or this document with your research log, to the Canvas assignment. If you're presenting in conversation, upload your research log.")),

  h1("Research log"),
  p(t("Add a row for each source you spend time with, including ones you found yourself. Add more rows as you need them."), { spacing: { after: 160 } }),
  logTable,
];

const doc = new Document({
  creator: "Digit Network Lab",
  title: "Neural Networks and AI Ethics: independent research assignment",
  styles: { default: { document: { run: { font: FONT, size: 22 } } } },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
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
