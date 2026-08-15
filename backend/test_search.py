from app.agents.search_agent import SearchAgent

agent = SearchAgent()

results = agent.search("Artificial Intelligence in Healthcare")

print("\nSEARCH RESULTS\n")

for i, result in enumerate(results, start=1):
    print(f"{i}. {result['title']}")
    print(result["url"])
    print()