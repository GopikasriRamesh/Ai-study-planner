def calculate_plan(total_hours, total_days, subjects):
    """
    subjects: List of dicts [{'name': 'Python', 'difficulty': 1}, ...]
    difficulty: 1 (Easy), 2 (Medium), 3 (Hard)
    """
    total_available_time = total_hours * total_days
    total_weight = sum(int(s['difficulty']) for s in subjects)
    
    plan = []
    for sub in subjects:
        # Calculate portion based on difficulty weight
        weight_ratio = int(sub['difficulty']) / total_weight
        sub_total_hours = weight_ratio * total_available_time
        
        plan.append({
            "subject": sub['name'],
            "total_hours_allocated": round(sub_total_hours, 1),
            "daily_avg": round(sub_total_hours / total_days, 1),
            "difficulty": sub['difficulty']
        })
    return plan