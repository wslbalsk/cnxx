# Genesys Admin Panel

Painel administrativo local para administrar um servidor MU Online Season 6 através de ODBC.

## Execução

1. Configure o DSN `MuOnlineS6` no Windows.
2. Ajuste `PanelData/profiles.json` para apontar para a raiz do seu MuServer.
3. Execute `Start-GenesysAdminPanel.bat`.
4. Abra `http://127.0.0.1:8090/`.

O painel cria backups dos arquivos de configuração antes de salvar alterações e mantém um log de auditoria local. Não publique `profiles.json` com credenciais ou caminhos que você não queira compartilhar.

## Escopo

O painel administra dados por ODBC e arquivos de configuração permitidos do servidor. Binários fechados do cliente (`main.exe`/`Main.dll`) e arquivos de banco de dados não fazem parte deste repositório.

