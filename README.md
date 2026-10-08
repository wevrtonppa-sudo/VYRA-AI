# VYRA AI V14

Full-stack starter for the VYRA AI creative SaaS.

## Estrutura
- `apps/web`: frontend estático inicial
- `apps/api`: API Express com validação de JWT Supabase
- `supabase/schema.sql`: tabelas e RLS

## Configuração
1. Crie um projeto Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Copie `apps/api/.env.example` para `.env` e preencha `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY`.
4. `npm install`
5. `npm run start`

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no frontend.

Esta entrega é uma base V14 verificável; geração de IA, pagamentos e deploy ainda exigem credenciais/configuração externas.
