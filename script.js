const supabaseUrl = "https://sldowummboxneilztyur.supabase.co";

const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZG93dW1tYm94bmVpbHp0eXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE1NjYsImV4cCI6MjA4OTg0NzU2Nn0.9LomtvuocyyGgSJWZMC_WIKEMnkOTSH3dKFaPR8IQcg";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// 📦 carregar produtos
async function carregarCatalogo() {
  let { data: produtos, error } = await banco.from("produtos").select("*");

  if (error) {
    console.error("Erro:", error);
    return;
  }

  let vitrine = document.getElementById("vitrine");

  vitrine.innerHTML = "";

  produtos.forEach((item) => {
    let precoFormatado = Number(item.preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    let div = document.createElement("div");

    div.className = "card-produto";

    div.innerHTML = `
      <img src="${item.imagem_url}" width="150">
      <h3>${item.nome}</h3>
      <p class="preco">${precoFormatado}</p>
    `;

    vitrine.appendChild(div);
  });
}

carregarCatalogo();
