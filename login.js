// CONFIGURAÇÃO DO BANCO
const supabaseUrl = "https://sldowummboxneilztyur.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZG93dW1tYm94bmVpbHp0eXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE1NjYsImV4cCI6MjA4OTg0NzU2Nn0.9LomtvuocyyGgSJWZMC_WIKEMnkOTSH3dKFaPR8IQcg";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 👁️ Mostrar / esconder senha
function mostrarSenha() {
  let inputSenha = document.getElementById("password");
  let btnOlho = document.getElementById("btn-olho");

  if (inputSenha.type === "password") {
    inputSenha.type = "text";
    btnOlho.innerText = "🙈";
  } else {
    inputSenha.type = "password";
    btnOlho.innerText = "👁️";
  }
}

// 🔐 Se já estiver logado, pula direto para admin
async function verificarLoginExistente() {
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (user) {
    window.location.href = "admin.html";
  }
}

verificarLoginExistente();

// 🚪 Fazer login
async function fazerLogin() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const msg = document.getElementById("mensagem");
  const btn = document.getElementById("btn-entrar");

  btn.innerText = "Verificando...";
  btn.disabled = true;

  const { data, error } = await banco.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    msg.innerText = "Acesso Negado: " + error.message;
    msg.style.color = "red";

    btn.innerText = "Entrar no Painel";
    btn.disabled = false;
  } else {
    msg.innerText = "Acesso concedido!";
    msg.style.color = "green";

    setTimeout(() => {
      window.location.href = "admin.html";
    }, 1000);
  }
}

// ⌨️ Enter para fazer login
document
  .getElementById("password")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      fazerLogin();
    }
  });
