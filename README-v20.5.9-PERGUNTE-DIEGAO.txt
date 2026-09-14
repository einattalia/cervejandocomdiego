CERVEJANDO COM DIEGO — v20.5.9 — PERGUNTE PRO DIEGÃO

ALTERAÇÕES
- Não abre mais Gmail, Outlook ou mailto.
- Envio em segundo plano por /api/send-question.
- Destino: contato@cervejandocomdiego.com.br.
- Reply-To: e-mail digitado pelo cliente.
- Estado "Enviando...", limpeza do formulário e popup de sucesso.
- Botão "Explorar o catálogo" fecha o popup e leva ao catálogo.
- Validação e honeypot anti-spam.

CONFIGURAÇÃO NA VERCEL
1. No Resend, verifique o domínio cervejandocomdiego.com.br e adicione os registros DNS solicitados.
2. Crie uma API Key no Resend.
3. Vercel > Project > Settings > Environment Variables:
   RESEND_API_KEY = re_...
   QUESTION_FROM_EMAIL = Cervejando com Diego <site@cervejandocomdiego.com.br>
   QUESTION_TO_EMAIL = contato@cervejandocomdiego.com.br
4. Marque Production (e Preview, se desejar testar previews).
5. Faça um novo Redeploy.

A senha do Zoho não deve ser colocada no código.
