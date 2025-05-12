# 📅 Event Hub

Sistema completo para **gestão de eventos, inscrições e autenticação JWT**, com frontend em **React (SPA)** e backend em **Laravel**.  
Permite **criar, editar, listar e se inscrever** em eventos, com integração automática de endereço via **ViaCEP**.

---

## 🚀 Funcionalidades

- Cadastro e login de usuários com autenticação JWT
- Listagem de eventos ativos
- Criação, edição e exclusão de eventos (restrito ao criador)
- Inscrição e cancelamento de inscrição em eventos
- Visualização de eventos do usuário (como dono ou participante)
- Integração automática de endereço via CEP (ViaCEP)
- Validações robustas e mensagens de erro amigáveis
- SPA responsiva com navegação protegida

---

## 🛠️ Tecnologias Utilizadas

### Backend:
- Laravel 10+
- PostgreSQL ou MySQL
- JWT Auth

### Frontend:
- React (com Vite)
- Axios
- React Router

### API Externa:
- [ViaCEP](https://viacep.com.br) (consulta de endereço por CEP)

---

## ⚙️ Instalação e Execução

### 1. Backend (Laravel)

```bash
# Clone o repositório
git clone SEU_REPOSITORIO
cd event-hub

# Instale as dependências
composer install

# Configure o .env
cp .env.example .env
# Edite as variáveis de ambiente conforme necessário

# Gere a chave da aplicação
php artisan key:generate

# Configure o JWT
php artisan jwt:secret

# Rode as migrations
php artisan migrate

# Inicie o servidor Laravel
php artisan serve

### 2. Frontend (React + Vite)

```bash
# Instale as dependências do frontend
npm install

# Inicie o Vite (em outro terminal)
npm run dev

Por padrão, o frontend será servido junto com o Laravel em http://localhost:8000.

## 🔁 Configuração das Rotas

- **Rotas da API:** definidas em `routes/api.php` e protegidas por middleware JWT (`auth:api`)
- **Rotas do Frontend (SPA):** fallback configurado em `routes/web.php` para entregar `resources/views/app.blade.php`
- **Ponto de entrada do React:** `resources/js/index.jsx`

---

## 🔗 Principais Endpoints da API

| Método | Rota                                      | Descrição                           |
|--------|-------------------------------------------|-------------------------------------|
| POST   | `/api/auth/register`                     | Cadastro de usuário                 |
| POST   | `/api/auth/login`                        | Login e obtenção do token JWT       |
| GET    | `/api/events`                            | Listar eventos ativos               |
| POST   | `/api/events`                            | Criar evento (autenticado)          |
| PUT    | `/api/events/{uuid}`                     | Editar evento (apenas criador)      |
| DELETE | `/api/events/{uuid}`                     | Excluir evento (apenas criador)     |
| POST   | `/api/events/{uuid}/subscribe`           | Inscrição em evento                 |
| DELETE | `/api/events/{uuid}/unsubscribe`         | Cancelar inscrição                  |
| GET    | `/api/my-events`                         | Eventos em que o usuário participa |

---

## 💻 Funcionalidades do Frontend

- Armazenamento de token JWT no localStorage
- Navegação protegida por autenticação
- Listagem de eventos com cards interativos e responsivos
- Formulário de criação/edição de eventos com busca de endereço via CEP
- Página "Meus Eventos" para exibição de eventos do usuário
- Feedbacks visuais para erros, validações e ações bem-sucedidas

---

## 🤝 Como Contribuir

1. **Fork** este repositório
2. Crie uma nova branch:  
   `git checkout -b minha-feature`
3. Faça suas modificações e commit:  
   `git commit -m 'Minha feature'`
4. Envie sua branch para
