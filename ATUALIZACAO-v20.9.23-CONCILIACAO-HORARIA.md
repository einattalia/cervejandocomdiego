# v20.9.23 — Conciliação horária da Stripe

- O Vercel agenda a rota `/api/reconcile-stripe` no início de cada hora (UTC).
- A execução agendada usa `CRON_SECRET` e não depende de o Admin estar aberto.
- O botão manual continua exigindo uma sessão autenticada de administrador.
- Cada execução verifica até 10 pedidos elegíveis; as execuções seguintes continuam a fila.

## Aplicação

1. Cadastre `CRON_SECRET` nas variáveis de ambiente do projeto Vercel em produção. Use um valor aleatório forte com pelo menos 16 caracteres. Não reutilize nem publique esse segredo.
2. Publique a versão v20.9.23. O agendamento só é registrado após o deploy de produção.
3. Confirme em Vercel → projeto → Settings → Cron Jobs se `/api/reconcile-stripe` está listado e consulte os logs da execução.

O horário `0 * * * *` significa uma execução por hora. A Vercel Hobby limita Cron Jobs a uma execução por dia; para executar de hora em hora, o projeto precisa de um plano que aceite essa frequência. Na Vercel, as expressões são interpretadas em UTC.
