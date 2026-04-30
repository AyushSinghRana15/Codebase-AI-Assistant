from typing import List, Dict
from ragas.datasets import Dataset
import json


def build_ragas_dataset(queries: List[Dict], answers: List[str], contexts: List[List[str]], ground_truths: List[str]) -> Dataset:
    data = {
        "question": [q["query"] for q in queries],
        "answer": answers,
        "contexts": contexts,
        "ground_truth": ground_truths,
    }
    return Dataset.from_dict(data)


def run_ragas_eval(dataset: Dataset) -> Dict:
    try:
        from ragas import evaluate
        from ragas.metrics import faithfulness, answer_relevancy, context_precision, context_recall
        
        result = evaluate(
            dataset,
            metrics=[faithfulness, answer_relevancy, context_precision, context_recall]
        )
        return result.to_pandas().to_dict('records')[0]
    except ImportError:
        return {"error": "ragas not installed. Run: pip install ragas datasets langchain-openai"}


def load_ground_truth(path: str = "eval/ground_truth.json") -> List[Dict]:
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []


if __name__ == "__main__":
    print("RAGAS Evaluation")
    print("Make sure to run pipeline and collect answers first.")
    print("Example usage:")
    print("""
    from eval.ragas_eval import build_ragas_dataset, run_ragas_eval
    # Collect data from your eval queries
    dataset = build_ragas_dataset(queries, answers, contexts, ground_truths)
    result = run_ragas_eval(dataset)
    print(result)
    """)
