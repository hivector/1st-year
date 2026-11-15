"""
Builds one ZIP per subject into pyq/zips/ using the paths listed in pyq.js.

Run from the project folder (the one with index.html):
    python make_zips.py

The output is deterministic: the same PDFs always give byte-identical ZIPs,
so the GitHub Action only commits when a paper really changed.
"""

import os
import re
import zipfile

JS_FILE = "pyq.js"
OUT_DIR = os.path.join("pyq", "zips")

# Fixed timestamp so rebuilding never changes the ZIP by itself
FIXED_TIME = (2020, 1, 1, 0, 0, 0)


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


with open(JS_FILE, encoding="utf-8") as f:
    source = f.read()

# Only the `const papers = { ... };` block
block = source.split("const papers = {", 1)[1].split("};", 1)[0]

# "Subject": [ "path", "path", ... ]
subjects = re.findall(r'"([^"]+)"\s*:\s*\[(.*?)\]', block, re.S)

os.makedirs(OUT_DIR, exist_ok=True)

for subject, body in subjects:
    paths = re.findall(r'"([^"]+)"', body)

    if len(paths) < 2:
        continue  # the site hides the ZIP button for single-paper subjects

    zip_path = os.path.join(OUT_DIR, slugify(subject) + ".zip")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_STORED) as z:
        for p in sorted(paths):
            if not os.path.exists(p):
                print("  MISSING:", p)
                continue

            name = os.path.basename(p).replace(".pdf.pdf", ".pdf")
            info = zipfile.ZipInfo(name, date_time=FIXED_TIME)
            info.compress_type = zipfile.ZIP_STORED
            info.external_attr = 0o644 << 16

            with open(p, "rb") as pdf:
                z.writestr(info, pdf.read())

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print("%-40s %2d papers  %6.1f MB" % (subject, len(paths), size_mb))

print("\nDone. Commit the pyq/zips/ folder.")
