// CONFIGURAÇÃO DO BANCO
const supabaseUrl = "https://sldowummboxneilztyur.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZG93dW1tYm94bmVpbHp0eXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE1NjYsImV4cCI6MjA4OTg0NzU2Nn0.9LomtvuocyyGgSJWZMC_WIKEMnkOTSH3dKFaPR8IQcg";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 🔐 Proteção da página admin
async function verificarAcesso() {
  const {
    data: { user },
  } = await banco.auth.getUser();

  if (!user) {
    alert("Área restrita! Faça login primeiro.");
    window.location.href = "login.html";
  } else {
    document.getElementById("nome-usuario").innerText = user.email;
  }
}

verificarAcesso();

// ➕ Cadastrar produto
async function cadastrarProduto() {
  let nomeProduto = document.getElementById("input-nome").value;
  let precoProduto = document.getElementById("input-preco").value;
  let imagemProduto = document.getElementById("input-imagem").value;
  let aviso = document.getElementById("mensagem-aviso");

  if (nomeProduto === "" || precoProduto === "") {
    aviso.innerText = "Preencha todos os campos!";
    aviso.style.color = "red";
    return;
  }

  aviso.innerText = "Salvando na nuvem...";
  aviso.style.color = "blue";

  let { error } = await banco.from("produtos").insert([
    {
      nome: nomeProduto,
      preco: precoProduto,
      imagem_url: imagemProduto,
    },
  ]);

  if (error) {
    aviso.innerText = "Erro: " + error.message;
    aviso.style.color = "red";
  } else {
    aviso.innerText = "Produto cadastrado!";
    aviso.style.color = "green";

    document.getElementById("input-nome").value = "";
    document.getElementById("input-preco").value = "";
    document.getElementById("input-imagem").value = "";
  }
}

// 🚪 Logout
async function sairDoSistema() {
  await banco.auth.signOut();

  window.location.href = "index.html";
}
