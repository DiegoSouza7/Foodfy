# Foodfy
Projeto de estudo do curso Launchbase da Rocketseat em desenvolvimento

# Banco de dados utilizado:
:elephant: PostgreSQL

# Dependências:

- **Express** para criação do servidor usando node.js
- **Nunjuks** para melhor aproveitamento de código HTML e utilização do JS
- **nodemailer** para enviar email para os usuários. Todos os emails de criação e recuperação de senha serão enviados para sua conta no Mailtrap que pode ser criada no site: https://mailtrap.io/

# Como inicializar o projeto:

- Após baixar o repositório, utilize o comando  'npm install' para baixar todas as dependências do projeto no diretório onde o repositório foi baixado.

- Para criar o banco de dados utilizado rode as query que está no arquivo database.SQL.

- Altere os dados user, password, host, port e database do arquivo que está em 'src/config/db.js' de acordo com o seu banco de dados.

- Configure o arquivo 'src/config/mailer.js' com os dados de integração que está disponível na sua conta do mailtrap. Selecione a opção nodemailer e altere os dados de host, port, user e pass do arquivo da aplicação inserindo os dados de integração de sua conta.

- Utilize o comando 'node seed.js' para criar dados fakes de usuários, chefs e receitas.

- Utilize o comando 'npm start' para rodar a aplicação.

- Para logar na aplicação utilize o email 'adm@adm.com' e a senha '123' esse email e senha serão criados assim que for rodado o comando 'node seed.js'. Não rode o comando duas vezes para evitar erro por repetição de email. Para rodar o comando uma segunda vez, rode antes as query que está no arquivo database.SQL da linha 100 até a linha 112; esta query ira limpar os dados do banco de dados permitindo rodar novamente o comando 'node seed.js' sem o conflito de repetição de dados.
