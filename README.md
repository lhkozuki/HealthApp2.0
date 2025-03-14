
# HealthApp2.0  - Sistema de Alarmes para Medicação

## Descrição
O *HealthApp* é um sistema desenvolvido para ajudar usuários a lembrarem de tomar seus medicamentos no horário correto. A aplicação permite o cadastro de usuários, a associação de medicamentos com informações detalhadas e a geração automática de alarmes baseados na periodicidade e duração do tratamento.

## Funcionalidades
- Cadastro de usuários
- Registro de medicamentos para cada usuário
- Definição de periodicidade, dose e tempo de tratamento
- Acesso a bula do medicamento ***
- Geração automática de alarmes com base nas informações fornecidas ***
- Notificações para lembrar os usuários sobre os horários dos medicamentos ***

## Tecnologias Utilizadas
- *Backend:* C# (.NET 8)
  > * **Swagger:** https://github.com/user-attachments/files/19220999/API.MedSync.v1.0.json
  > * **Diagrama de classes:** https://github.com/amanda-barbosa-dev/HealthApp2.0/issues/7#issuecomment-2724249893
- *Frontend:* HTML, CSS, JavaScript
  > * **Telas no Figma:** https://www.figma.com/design/XEPELADEB7k8MpV41fBxBm/Health-App?node-id=10-4&t=y1B9pNFLKfjb56sW-1
- *Banco de Dados:* SQL Server hospedado no Azure
  > * **Diagrama Relacional do Banco de Dados:** https://www.mermaidchart.com/raw/bdfa32c6-115e-4499-83aa-3eb1386b67b8?theme=light&version=v0.1&format=svg
  > 
  > * **Script SQL para criação das tabelas e exemplos de operações CRUD:** https://github.com/amanda-barbosa-dev/HealthApp2.0/issues/8#issuecomment-2706727445

## Como Funciona
1. *Cadastro de Usuário:* O usuário cria uma conta no sistema.
2. *Adição de Medicamentos:* O usuário adiciona seus medicamentos informando:
   - Nome do medicamento
   - Dosagem
   - Periodicidade (exemplo: a cada 8 horas)
   - Tempo de tratamento (exemplo: 10 dias)
3. *Geração de Alarmes:* Com base nos dados fornecidos, o sistema gera automaticamente os horários dos alarmes.
4. *Notificações:* O sistema notifica o usuário nos horários corretos para garantir que ele tome sua medicação no tempo certo.
   
    > * **Landing Page do Projeto (Github Pages):** 
    > 
    > * **Vídeo de apresentação do Projeto:**

## Instalação e Configuração
Recomendamos a utilização da IDE ![Vscode](https://img.shields.io/badge/Vscode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white) para a execução do projeto ser leve, flexível, funcionando em Windows, macOS e Linux, e equipado com recursos modernos via extensões. Além de trabalhar perfeitamente com o .NET Command Line Interface (CLI), permitindo criar, compilar e executar projetos C# diretamente pelo terminal integrado. Por exemplo, comandos como `dotnet new`, `dotnet build` e `dotnet run` são fáceis de usar sem sair do ambiente.
- ### Clone o repositório
  ```bash
  git clone https:https://github.com/amanda-barbosa-dev/HeathApp2.0
  ```
- ### Backend
    - #### Acesse a pasta do projeto e instale as dependências
      ```bash
      cd BACKEND\MedSync
      dotnet restore
      ```
    - #### Configure a senha para conexão com o banco de dados utilizada no appsettings.json
      ```bash
      dotnet user-secrets init --project MedSync.Backend.csproj
      dotnet user-secrets set "DB_PASSWORD" "SuaSenha123!" --project MedSync.Backend.csproj
      ```
      Obs.: Importante substituir o "SuaSenha123!" pela senha válida. 

    - #### Execute as migrações do banco de dados
      ```bash
      dotnet ef database update
      ```
    - #### Inicie a API
      ```bash
      dotnet run
      ```

- ### Frontend
    - #### Instale a extenção Live Server no Vs Code:
       O **Live Server** é uma extensão popular no VS Code que permite visualizar páginas HTML em tempo real no navegador, atualizando automaticamente ao salvar alterações no 
       código. Abaixo está o passo a passo para instalá-la:
       - Abra o Vs Code
       - Acesse a Marketplace de Extensões usando o atalho `Ctrl+Shift+X` (Windows/Linux) ou `Cmd+Shift+X` (macOS).
       - Na barra de pesquisa no topo da janela de extensões, digite **"Live Server"**. A extensão oficial é desenvolvida por **Ritwick Dey**. Verifique o nome do autor para 
         garantir que está instalando a versão correta.
       - Quando o **Live Server** aparecer nos resultados, clique no botão verde **"Install"** (Instalar) ao lado do nome da extensão.
       - Aguarde alguns segundos até que a instalação esteja concluída. O botão mudará para **"Installed"** ou exibirá opções como "Disable" e "Uninstall".
    - #### Inicie a aplicação
      - Abra no VS Code a pasta HealthApp, localizada dento da pasta Frontend no repositório clonado. 
      - Abrir um arquivo HTML no VS Code.
      - Clicar com o botão direito no arquivo e selecionar **"Open with Live Server"** no menu de contexto. Ou, na barra inferior do VS Code, clicar em **"Go Live"** (se 
       disponível após a instalação).
      - O navegador padrão será aberto automaticamente com o endereço `http://localhost:5500` (ou outra porta, se configurada), exibindo sua página.

## Contribuição 
 - Contribuições são bem-vindas! Para contribuir:
     - #### Faça um fork do projeto
     - ##### Crie uma branch para sua funcionalidade
       ```bash
       git checkout -b minha-feature
       ```
     - ##### Faça commit das suas alterações
       ```bash
       git commit -m 'Adiciona nova funcionalidade'
       ```

     - ##### Envie para o repositório
       ```bash
       git push origin minha-feature
       ```
     - ##### Abra um Pull Request


## Licença
Este projeto está licenciado sob a licença MIT. Consulte o arquivo LICENSE para mais detalhes.

## Contato
Para dúvidas ou sugestões, entre em contato:
- *GitHub:* [HealthApp](https://github.com/amanda-barbosa-dev/HealthApp2.0/issues)

## Melhorias 
- Implementar o acesso ao link para consulta da bula. ***
- Implementar envio de mensagem via WhatsApp ***
- Implementar funcionalidade de recusividade no envio dos lembretes via de push notification com data de início, fim, e de acordo com o horário
recomendado para uso do medicamento, por exemplo 8h/8h. ***
- Implementar check-box para confirmar no aplicativo que o medicamento foi injerido para auxiliar no controle. 


## Autores
- Amanda Bonholi Barbosa
- Anderson Salaori
- Cauê Cabral Rocha
- Cristiano Batista da Costa
- Igor Gomes da Costa Junior
- Leonardo de Oliveira Domingos
- Lucas Hikaru Kozuki
- Luiz Henrique Nunes Gonçalves


