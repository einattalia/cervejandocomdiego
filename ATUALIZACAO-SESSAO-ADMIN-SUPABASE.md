# Sessão do Admin — correção de token expirado

O Admin agora tenta renovar a sessão do Supabase antes do vencimento e repete uma vez a operação autenticada quando a API indica um JWT expirado. Isso abrange gravações e uploads pelo Storage. A chamada à API do próprio site também renova o token antes de usar a sessão.

Se o refresh token também tiver expirado ou sido revogado, será necessário entrar novamente no Admin. A correção é no front-end e não exige executar SQL nem alterar variáveis de ambiente.
