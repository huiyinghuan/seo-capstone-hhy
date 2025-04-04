from openai import OpenAI

client = OpenAI(
  api_key="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"
)

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  store=True,
  messages=[
    {"role": "user", "content": "Provide me a travel plan for a 8d7n trip for haikou china"}
  ]
)

print(completion.choices[0].message)
