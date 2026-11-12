import os
import re
import zipfile

JS_FILE = "pyq.js"
OUT_DIR = os.path.join("pyq", "zips")


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


with open(JS_FILE, encoding="utf-8") as f:
    source = f.read()

block = source.split("const papers = {", 1)[1].split("};", 1)[0]
subjects = re.findall(r'"([^"]+)"\s*:\s*\[(.*?)\]', block, re.S)

os.makedirs(OUT_DIR, exist_ok=True)

for subject, body in subjects:
    paths = re.findall(r'"([^"]+)"', body)

    if len(paths) < 2:
        continue

    zip_path = os.path.join(OUT_DIR, slugify(subject) + ".zip")

    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_STORED) as z:
        for p in paths:
            if not os.path.exists(p):
                print("  MISSING:", p)
                continue
            z.write(p, arcname=os.path.basename(p).replace(".pdf.pdf", ".pdf"))

    print("%-40s %2d papers  %6.1f MB" % (subject, len(paths), os.path.getsize(zip_path) / (1024 * 1024)))

print("\nDone. Commit the pyq/zips/ folder.")
