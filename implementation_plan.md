# Plano de implementação — integração real com servidor MU Online

## Objetivo

Auditar e alinhar todo o portal Next.js ao servidor MU Online real, exibindo dados dinâmicos do SQL Server, corrigindo autenticação/cadastro do painel e criando uma seção About inspirada na referência enviada, sem copiar conteúdo proprietário.

## Situação encontrada

- O projeto é Next.js 15 + TypeScript.
- A dependência `mssql` já está instalada.
- `lib/db.ts` já possui pool singleton, repositório `MuDatabase` e fallback mock.
- `/api/rankings` já chama `MuDatabase.getRankings()`.
- `/api/status` já existe, mas `getServerStats()` retorna valores fixos como `onlinePlayers: 487`, contas e personagens.
- O frontend consulta status/rankings, porém não há mecanismo consistente de atualização contínua.
- O schema exato do servidor MU ainda precisa ser confirmado; versões Season 6 usam nomes/colunas diferentes para conexão, resets, master level, guild e Castle Siege.
- O SQL Server real respondeu com o banco MuOnline e possui `Character.ResetCount`, `Character.MasterResetCount`, `Guild`, `GuildMember` e `MEMB_STAT`.
- O ranking já foi validado localmente com dados reais: BALSK, Admin, 2 contas, 4 personagens, 1 guilda e 1 jogador online.
- O login do painel reproduz `Validation failed for parameter 'memb___id'. type.validate is not a function`; a camada de parâmetros `mssql` precisa ser corrigida antes de liberar login/cadastro.
- A tela de registro já existe, mas o fluxo de criação precisa ser validado contra as colunas reais de `MEMB_INFO` e protegido contra duplicidade, abuso e escrita indevida.
- A referência visual solicitada usa uma página de informações com navegação lateral por categorias, texto introdutório, cards de regras/rates e tabelas de progressão.

## Arquitetura proposta

1. **Backend seguro de acesso ao SQL Server**
   - Manter todas as consultas dentro de `lib/db.ts`/repositórios server-side.
   - Validar e normalizar as variáveis `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, criptografia e timeout.
   - Desabilitar o fallback mock quando o ambiente for produção, para nunca exibir dados fictícios silenciosamente.
   - Usar queries parametrizadas e limitar resultados de ranking.

2. **Dados reais do MU Online**
   - Implementar consultas para:
     - jogadores online, normalmente com base em `MEMB_STAT.ConnectStat` e/ou tabela equivalente do emulador;
     - total de contas e personagens;
     - top resets, level e master level;
     - guilds e pontuação;
     - dono/estado do Castle Siege, se as tabelas existirem.
   - Adicionar tratamento de schema incompatível sem esconder falhas de configuração.
   - Criar uma consulta de diagnóstico protegida para confirmar conexão, banco e tabelas esperadas.

3. **API do site**
   - Corrigir `/api/status` para usar exclusivamente dados calculados no SQL Server.
   - Corrigir/validar `/api/rankings` com categorias permitidas, ordenação segura e cache desabilitado para dados dinâmicos.
   - Adicionar headers de controle (`no-store`) e respostas padronizadas com timestamp e estado da conexão.
   - Não expor senha, connection string ou erros internos ao navegador.

4. **Atualização em tempo quase real**
   - Implementar polling controlado no cliente para status e ranking, inicialmente a cada 10–15 segundos, com cancelamento ao desmontar o componente e sem chamadas duplicadas.
   - Atualizar navbar, dashboard e página de rankings com estado de carregamento/erro e indicação de “última atualização”.
   - Se for necessário push real abaixo de alguns segundos, criar um serviço separado de SSE/WebSocket/SignalR; não manter socket dentro de uma rota Next serverless sem confirmar o ambiente de hospedagem.

5. **Operação e segurança**
   - Atualizar `.env.example` sem inserir credenciais reais.
   - Restringir o SQL Server para aceitar conexão somente do IP do servidor web, quando possível.
   - Criar usuário SQL com permissões mínimas de leitura para rankings/status; manter permissões de escrita apenas nas rotas que realmente precisam delas.
   - Adicionar logs curtos de conectividade e métricas de erro, sem registrar senha ou dados sensíveis.

6. **Validação**
   - Rodar lint e build.
   - Testar API com SQL Server conectado e com conexão indisponível.
   - Confirmar que rankings e online players mudam após alteração real no servidor.
   - Verificar que nenhum dado mock aparece em produção.

7. **Auditoria completa do portal**
   - Comparar Home, Navbar, status, rankings, login, registro, dashboard, downloads, doações e suporte com os dados e limites reais do servidor.
   - Remover textos, números, contas de teste e taxas que não tenham origem em configuração validada.
   - Centralizar metadados do servidor em configuração segura e separar dados estáticos de dados SQL em tempo real.
   - Exibir estado de conexão, timestamp e mensagens de indisponibilidade sem inventar valores.

8. **Login, registro e painel interligados ao SQL**
   - Corrigir o tipo dos parâmetros `memb___id`/senha no driver `mssql` e validar login real contra `MEMB_INFO`.
   - Confirmar o formato de senha usado pelo emulador antes de criar ou alterar contas; não aplicar hash incompatível sem validação.
   - Criar conta com transação, validação de login/e-mail, limite de tamanho, verificação de duplicidade e inicialização das tabelas auxiliares somente quando existirem.
   - Manter sessão HttpOnly/Secure/SameSite, rate limit e mensagens genéricas contra enumeração de contas.
   - Fazer o dashboard consultar personagens, moedas e operações somente pelo backend, com autorização por sessão.

9. **Página About baseada no servidor**
   - Criar rota de informações com navegação lateral responsiva, seguindo a estrutura visual dos exemplos: Informações básicas, Reset, Classes, Progressão, Guildas/Castle Siege, Eventos, Itens e Opções.
   - Alimentar rates, nível máximo, reset máximo, pontos por reset, experiência, drop, limites e status a partir de configuração validada do servidor.
   - Usar somente informações do MU Online do usuário; textos e imagens serão originais ou assets autorizados.
   - Começar com abas essenciais e deixar conteúdo avançado preparado para expansão sem inventar mecânicas não confirmadas.

10. **Página geral e específica de informações do servidor**
   - Criar uma página pública dedicada, preferencialmente `/about`, acessível pela navegação principal como “Informações do Servidor”.
   - Usar os exemplos enviados como referência visual: painel lateral de categorias, fundo/contraste do portal atual, cards de resumo e tabelas legíveis em desktop e mobile.
   - Seções iniciais: Visão geral, Configurações & Rates, Sistema de Reset, Classes, Progressão, Guildas & Castle Siege, Eventos, Itens e Suporte.
   - Criar um endpoint server-side de informações para combinar configuração oficial com dados vivos do SQL: jogadores ativos, contas, personagens, guildas, dono do Castle Siege e timestamp.
   - Mostrar valores como versão, experiência, Master Exp, drop, reset máximo, pontos por reset, Bug Bless, quantidade de monstros, nível máximo e limites somente quando confirmados pelo usuário/configuração do servidor.
   - Mover valores configuráveis para variáveis `SERVER_*` ou uma fonte administrativa versionada; não esconder números fictícios em componentes React.
   - Incluir tabelas de progressão de reset apenas após confirmar a fórmula real, níveis, atributos, pontos, custos e requisitos do emulador.
   - Destacar no topo o estado atual do servidor e “última atualização”, com polling controlado para contadores ao vivo.
   - Não copiar textos, imagens ou identidade visual da referência; reproduzir somente a ideia de organização e criar conteúdo/estilo próprios do servidor.

## Informações necessárias antes da implementação

Após a aprovação deste plano, preciso validar no servidor:

- IP/hostname, porta e nome do banco SQL Server;
- versão do MU/emulador e nomes reais dos bancos/tabelas;
- qual tabela/coluna representa jogador online;
- nomes das colunas de reset, grand reset e master level;
- se o site ficará no mesmo servidor do SQL Server ou em hospedagem externa;
- intervalo aceitável de atualização: 10–15 segundos ou push via serviço separado.
- rates oficiais confirmados: experiência, master experience, drop, reset máximo, pontos por reset, nível máximo, limites de classe/guilda e regras de eventos;
- formato de senha e colunas obrigatórias da instalação real de `MEMB_INFO`;
- autorização para permitir criação de contas públicas no site e política de e-mail/anti-abuso;
- imagens/identidade visual próprias do servidor para a página About.

## Critérios de aceite

- O site não exibe números fixos quando o SQL Server está configurado.
- O ranking reflete alterações reais no banco.
- Jogadores online e estatísticas são atualizados automaticamente no navegador.
- Credenciais do SQL Server permanecem somente no ambiente do servidor.
- Falhas de conexão aparecem como estado indisponível, sem derrubar o site nem exibir dados falsos.
- Login e criação de conta funcionam no SQL real sem o erro `type.validate` e sem expor credenciais.
- O painel mostra somente dados da conta autenticada e as operações de escrita são auditáveis.
- A página About apresenta rates e regras confirmadas do servidor em uma navegação responsiva inspirada nos exemplos enviados.

