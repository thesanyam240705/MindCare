# MindCare NLP research module

## Research question
Can a text classifier learn the *dataset's* stress/non-stress labels from public, labeled text? This is an NLP coursework experiment, not a mental-health diagnosis or an inference about a person's clinical state.

## Dataset option
The Dreaddit paper describes a corpus for stress analysis in social-media text (Turcan & McKeown, 2019): https://aclanthology.org/D19-6213/. Check the dataset's original access route, license/terms, provenance, and permitted uses before downloading or redistributing it. The paper describes 3.5K labeled segments from 3K posts, alongside a larger pool of posts; do not assume all posts are labeled or that all records can be redistributed.

Prepare a local CSV with two columns, for example:

```csv
text,label
"Example text used only if legitimately licensed",stress
"Another labeled example",non_stress
```

The example rows above are placeholders, not a dataset. Do not commit your dataset to the repository.

## Run

```bash
pip install -r ml/requirements.txt
python ml/train_stress_model.py --csv ml/data/dataset.csv --text-column text --label-column label
```

Outputs: `ml/artifacts/model.joblib` and `ml/artifacts/metrics.json`.

## Required evaluation for a credible final-year project

- Compare at least majority-class and TF-IDF + logistic-regression baselines.
- Report held-out precision, recall, F1, balanced accuracy and the confusion matrix; do not optimize only accuracy.
- Inspect false negatives and false positives qualitatively with a privacy-safe review protocol.
- Check class balance, text source/domain leakage, duplicates and possible grouping by original post/author before splitting. Use group-aware splitting if related segments can land in both train and test.
- Report dataset limitations, annotation ambiguity, language/domain mismatch, and intended-use restrictions.
- Do not infer suicidality, depression, anxiety, or immediate safety from this classifier. Never use it as the only crisis pathway.
- Do not send user journal content to third-party APIs; the starter does not implement journal analysis.
