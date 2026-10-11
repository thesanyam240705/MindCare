import sys
from pathlib import Path

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from screening import score_check_in

VALID = {"mood": 0, "stress": 1, "sleep": 2, "energy": 3, "connection": 1}


def test_score_and_focus_areas():
    result = score_check_in(VALID)
    assert result["total"] == 7
    assert result["max_total"] == 15
    assert result["focus_areas"] == ["Low energy"]
    assert "unvalidated" in result["notice"]


def test_zero_answers_give_supportive_suggestion():
    result = score_check_in({key: 0 for key in VALID})
    assert result["total"] == 0
    assert result["focus_areas"] == []
    assert result["suggestions"]


def test_rejects_missing_answer():
    answers = dict(VALID)
    answers.pop("sleep")
    with pytest.raises(ValueError, match="missing answers"):
        score_check_in(answers)


@pytest.mark.parametrize("invalid", [-1, 4, 2.5, True, "2", None])
def test_rejects_invalid_answer_value(invalid):
    answers = dict(VALID)
    answers["mood"] = invalid
    with pytest.raises(ValueError, match="mood must be an integer"):
        score_check_in(answers)


def test_rejects_extra_answer():
    answers = dict(VALID, name="sensitive")
    with pytest.raises(ValueError, match="unexpected answers"):
        score_check_in(answers)
