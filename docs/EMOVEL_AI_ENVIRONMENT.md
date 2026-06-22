# EMOVEL Prompt Studio AI Environment

Prompt Studio keeps provider keys server-side in `app/api/ai/generate/route.ts`.

Minimum AI mode:

```env
AI_PRIMARY_PROVIDER=anthropic
AI_PRIMARY_MODEL=claude-sonnet-4-5
ANTHROPIC_API_KEY=your_key_here
```

OpenAI alternative:

```env
AI_PRIMARY_PROVIDER=openai
AI_PRIMARY_MODEL=gpt-4.1
OPENAI_API_KEY=your_key_here
```

Optional fallback:

```env
AI_FALLBACK_PROVIDER=openai
AI_FALLBACK_MODEL=gpt-4.1-mini
OPENAI_API_KEY=your_key_here
```

Optional tuning:

```env
AI_MAX_TOKENS=2200
AI_TEMPERATURE=0.35
AI_PRIMARY_MAX_TOKENS=2200
AI_PRIMARY_TEMPERATURE=0.35
AI_FALLBACK_MAX_TOKENS=1800
AI_FALLBACK_TEMPERATURE=0.35
```

If no configured provider and key are available, Prompt Studio stays in Fallback Mode and uses deterministic local Strategy generation. No Supabase, billing, analytics, or auth variables are required for this adapter.
