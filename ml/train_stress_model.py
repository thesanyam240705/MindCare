"""Train a simple baseline for research into dataset-level stress labels.

This model is not a mental-health diagnostic, clinical screening, or crisis classifier.
"""
import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline


def normalise_label(value):
    value = str(value).strip().lower()
    mapping = {
        "1": "stress", "stress": "stress", "stressed": "stress", "true": "stress",
        "0": "non_stress", "non_stress": "non_stress", "non-stress": "non_stress",
        "not_stress": "non_stress", "false": "non_stress",
    }
    return mapping.get(value, value)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", required=True, help="Path to local, properly sourced CSV")
    parser.add_argument("--text-column", default="text")
    parser.add_argument("--label-column", default="label")
    parser.add_argument("--test-size", type=float, default=0.2)
    parser.add_argument("--random-state", type=int, default=42)
    args = parser.parse_args()

    if not 0.1 <= args.test_size <= 0.4:
        parser.error("--test-size must be between 0.1 and 0.4")

    df = pd.read_csv(args.csv)
    for column in (args.text_column, args.label_column):
        if column not in df.columns:
            parser.error(f"Required column {column!r} not found. Available columns: {list(df.columns)}")

    data = df[[args.text_column, args.label_column]].dropna().copy()
    data[args.text_column] = data[args.text_column].astype(str).str.strip()
    data[args.label_column] = data[args.label_column].map(normalise_label)
    data = data[data[args.text_column].str.len() > 0]
    allowed = {"stress", "non_stress"}
    unknown = sorted(set(data[args.label_column]) - allowed)
    if unknown:
        parser.error(f"Labels must map to stress/non_stress. Unrecognised labels: {unknown}")
    if data[args.label_column].nunique() != 2 or data[args.label_column].value_counts().min() < 2:
        parser.error("Need at least two examples from each class for a stratified holdout split")

    x_train, x_test, y_train, y_test = train_test_split(
        data[args.text_column], data[args.label_column],
        test_size=args.test_size, random_state=args.random_state, stratify=data[args.label_column]
    )

    model = Pipeline([
        ("tfidf", TfidfVectorizer(
            strip_accents="unicode", lowercase=True, ngram_range=(1, 2),
            min_df=2, max_features=30000, sublinear_tf=True,
        )),
        ("classifier", LogisticRegression(class_weight="balanced", max_iter=2000, random_state=args.random_state)),
    ])
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    labels = ["non_stress", "stress"]
    metrics = {
        "task": "prediction of dataset stress/non-stress annotation; not clinical screening",
        "rows_after_cleaning": int(len(data)),
        "train_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
        "class_counts": {str(k): int(v) for k, v in data[args.label_column].value_counts().items()},
        "accuracy": float(accuracy_score(y_test, predictions)),
        "balanced_accuracy": float(balanced_accuracy_score(y_test, predictions)),
        "stress_precision": float(precision_score(y_test, predictions, pos_label="stress", zero_division=0)),
        "stress_recall": float(recall_score(y_test, predictions, pos_label="stress", zero_division=0)),
        "stress_f1": float(f1_score(y_test, predictions, pos_label="stress", zero_division=0)),
        "confusion_matrix_labels_order": labels,
        "confusion_matrix": confusion_matrix(y_test, predictions, labels=labels).tolist(),
        "classification_report": classification_report(y_test, predictions, labels=labels, output_dict=True, zero_division=0),
        "random_state": args.random_state,
        "split_warning": "Use group-aware splitting when related texts, segments, users, or source groups may overlap across train and test.",
        "limitation": "Performance on this holdout does not establish clinical validity or generalization to MindCare users.",
    }
    root = Path(__file__).resolve().parent
    output = root / "artifacts"
    output.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, output / "model.joblib")
    with (output / "metrics.json").open("w", encoding="utf-8") as handle:
        json.dump(metrics, handle, indent=2)
    print(json.dumps({k: v for k, v in metrics.items() if k != "classification_report"}, indent=2))
    print(f"\nWrote model to: {output / 'model.joblib'}")
    print(f"Wrote metrics to: {output / 'metrics.json'}")
    print("Reminder: dataset label prediction is not mental-health diagnosis or crisis assessment.")


if __name__ == "__main__":
    main()
