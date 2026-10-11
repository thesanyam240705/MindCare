# MindCare project plan

## Proposed major modules

1. Consent and privacy notice (before optional storage or text analysis).
2. Reflective daily check-in, then reviewed standardized instrument integration.
3. Wellness activities: breathing, mindful breaks, journaling prompts, and resource navigation.
4. Optional NLP research panel (trained offline; explicit opt-in; never a diagnostic result).
5. Mood/history dashboard only after users opt into storage; include deletion/export.
6. Admin/clinician view only if institutionally and clinically governed; no unreviewed risk ranking.

## Candidate research question

"How well does a transparent TF-IDF + Logistic Regression baseline generalize for stress-label prediction on a licensed public text corpus, and where does it fail?"

## Evaluation plan

- Baseline: majority class.
- Model: TF-IDF word uni-/bigrams + Logistic Regression.
- Metrics: precision, recall, F1, balanced accuracy, confusion matrix.
- Additional work: duplicates/group leakage checks, error analysis, ablation (word vs word+bigram), robustness across source/domain, and simple calibration checks if probability outputs are later used.
- Ethical evaluation: label ambiguity, mismatch between online forum text and direct user journaling, language coverage, privacy, consent, false-positive/false-negative consequences, and clear intended-use restrictions.

## Data/security acceptance checks before a pilot

- HTTPS only; no development debug server in deployment.
- No sensitive body text in logs or analytics.
- Authentication uses a vetted password-hashing library; never store plaintext passwords.
- Every read/write query is user-scoped and tested against cross-account access.
- Explicit consent, consent withdrawal, data export and deletion are tested.
- Secrets are environment variables and are never committed.
- Database backups and retention/deletion jobs are documented.
- Security review, clinician review, and institution ethics review as appropriate.
