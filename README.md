# MindCare — AI-Powered Mental Wellness and Early Screening Platform

**Milestone 1 starter:** a working React + Flask prototype, a privacy-first check-in API, safety-resource UI, tests, and a reproducible NLP experiment scaffold.

> **Important safety boundary:** this is an academic prototype, not a medical device or clinical service. The included five-item check-in is custom and unvalidated. Its total is a reflection aid only; it does not screen for, diagnose, or predict a mental-health condition. Do not present it as PHQ-9/GAD-7 or as a validated score. A qualified mental-health professional should review any clinical screening workflow before it is used with real users.

## 1. Architecture

```text
Browser (React + Vite)
    |
    | JSON over localhost
    v
Flask API (validation + transparent check-in logic)
    |-- /api/health
    |-- /api/check-in     (stateless; no DB writes)
    |-- /api/language-signal (reserved for a locally trained research model)

Offline ML experiment
    labeled public dataset -> TF-IDF + Logistic Regression -> held-out metrics + model artifact
```

The starter deliberately does not store answers, journal text, names, emails, or IP-linked profile data in a database. MongoDB, user accounts, and history should be added only after defining consent, deletion, access control, retention, and security requirements.

## 2. Prerequisites

- Python 3.10+ (3.11 recommended)
- Node.js 20.19+ and npm (compatible with current Vite releases)
- Git (optional)

## 3. Run the backend

Open a terminal in `MindCare/backend`:

### Windows PowerShell

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

API runs at `http://127.0.0.1:5000`. Test `http://127.0.0.1:5000/api/health` in a browser. Expected JSON: `{"status":"ok","service":"mindcare-api"}`.

## 4. Run the frontend

Open a second terminal in `MindCare/frontend`:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`). The Vite proxy forwards `/api` calls to Flask.

## 5. Run tests

In the backend virtual environment:

```bash
pip install -r requirements-dev.txt
pytest -q
```

## 6. NLP experiment (not needed to run the UI)

The ML module is a research scaffold, not a deployed mental-health detector. It trains a baseline text classifier for the *dataset's stress/non-stress labels*, not a model that diagnoses people.

1. Read `ml/README.md` and the source paper for Dreaddit: https://aclanthology.org/D19-6213/.
2. Obtain a dataset from a source whose terms permit your intended academic use. Do not scrape private posts or use private user journals as training data.
3. Export a CSV with `text` and `label` columns. Labels should be consistently named `stress` and `non_stress` (or `1` and `0`). Put the file under `ml/data/` and do not commit it if its terms or privacy status are unclear.
4. From the project root, install the ML dependencies and run:

```bash
pip install -r ml/requirements.txt
python ml/train_stress_model.py --csv ml/data/dataset.csv --text-column text --label-column label
```

Metrics and `model.joblib` are written to `ml/artifacts/`. Keep the model artifact out of source control unless intentionally versioned. Do not report one random train/test result as proof of clinical validity. Compare a simple baseline, inspect false negatives/positives, document dataset limitations, and test cross-domain performance before making any user-facing claim.

## 7. Safety and privacy checklist before a real pilot

- Obtain review from a qualified mental-health professional for screening wording, interpretation, and referral language.
- If using a standardized instrument, use the exact authorized version, follow its scoring guidance and reproduction terms, and make clear that screening is not diagnosis.
- Do not use a text classifier as a suicide detector or as the only source of crisis escalation.
- Provide visible help resources and a clear path to local emergency support.
- Publish a plain-language privacy notice: what data is collected, why, who receives it, how long it is retained, and how users can withdraw consent/delete it.
- Add explicit opt-in before saving a check-in or processing journal text. Minimize fields; never log sensitive text; configure HTTPS, strict CORS, secure secrets, rate limits, secure auth, authorization tests, deletion, backups, and incident handling before deployment.
- Treat mental-health information as highly sensitive even where a particular law uses a broader category. Check applicable law and institutional ethics requirements before any study or deployment.
- Do not use results to make employment, educational, insurance, or eligibility decisions.

## 8. Recommended next milestones

1. **Milestone 1 (this starter):** local UI/API, privacy-first check-in, visible support links, tests.
2. **Milestone 2:** professionally reviewed screening instrument integration and a structured referral flow; add a consent/notice screen before storing any data.
3. **Milestone 3:** train/evaluate the research NLP baseline; add a separate opt-in text-analysis screen with local-only processing during development and explicit no-diagnosis wording.
4. **Milestone 4:** MongoDB persistence only for accounts/history the user explicitly opts into; add password hashing, session security, ownership authorization, deletion/export endpoints, and audit tests.
5. **Milestone 5:** usability test, threat model, model card, bias/robustness analysis, deployment hardening, final report and viva slides.

## Reference starting points

- India Tele-MANAS information: https://www.dghs.mohfw.gov.in/national-mental-health-programme.php
- India emergency number 112: https://112.gov.in/about
- India DPDP Rules 2025: https://www.meity.gov.in/dpdp-rules-2025
- WHO guidance on ethics and governance of AI for health: https://www.who.int/publications/i/item/9789240029200
- Dreaddit paper (ACL Anthology): https://aclanthology.org/D19-6213/
