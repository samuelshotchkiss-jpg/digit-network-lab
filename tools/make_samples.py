"""Shrink DFin's MNIST test images (28x28) to 14x14 and write app/samples.js.

Each image is averaged in 2x2 blocks, then stored as one byte per pixel.
"""
import base64, pathlib, random

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "dfin" / "assets" / "data"
N = 6000

imgs = (SRC / "mnist-test-images-uint8.bin").read_bytes()
labels = (SRC / "mnist-test-labels-uint8.bin").read_bytes()

random.seed(7)
order = random.sample(range(len(labels)), N)
out_imgs, out_labels = bytearray(), bytearray()
for i in order:
    img = imgs[i * 784:(i + 1) * 784]
    for r in range(14):
        for c in range(14):
            s = (img[(2*r)*28 + 2*c] + img[(2*r)*28 + 2*c + 1]
                 + img[(2*r+1)*28 + 2*c] + img[(2*r+1)*28 + 2*c + 1])
            out_imgs.append(min(255, round(s / 4 * 1.3)))
    out_labels.append(labels[i])

js = ("// 6000 handwritten digits from the MNIST test set, shrunk to 14x14.\n"
      "// Source: MNIST (LeCun, Cortes & Burges), via github.com/DFin/Neural-Network-Visualisation\n"
      f"window.SAMPLES = {{ count: {N}, size: 14,\n"
      f"  images: \"{base64.b64encode(out_imgs).decode()}\",\n"
      f"  labels: \"{base64.b64encode(out_labels).decode()}\" }};\n")
(ROOT / "app").mkdir(exist_ok=True)
(ROOT / "app" / "samples.js").write_text(js)
print("wrote", len(js), "bytes")
