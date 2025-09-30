from datasets import load_dataset
ds = load_dataset("HuggingFaceH4/MATH-500", split="test")
ds = ds.remove_columns("unique_id")

ds_no_solution = ds.remove_columns("solution")
ds_no_solution.to_csv("math500_no_solution.csv", index=False)

ds_solution = ds.select_columns(["solution"])
ds_solution.to_csv("math500_solution.csv", index=False)