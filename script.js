const supabaseUrl = "https://sldowummboxneilztyur.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZG93dW1tYm94bmVpbHp0eXVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQyNzE1NjYsImV4cCI6MjA4OTg0NzU2Nn0.9LomtvuocyyGgSJWZMC_WIKEMnkOTSH3dKFaPR8IQcg";

const banco = window.supabase.createClient(supabaseUrl, supabaseKey);

// Tenta carregar o carrinho salvo no navegador, ou começa um vazio []
let carrinho = JSON.parse(localStorage.getItem("meu_carrinho")) || [];

// 📦 Carregar produtos
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
      <button onclick="adicionarAoCarrinho('${item.nome}', ${item.preco})">
          Adicionar ao Carrinho
      </button>
    `;

    vitrine.appendChild(div);
  });
}

carregarCatalogo();

// 1. ADICIONAR ITEM AO CARRINHO
function adicionarAoCarrinho(nome, preco) {
  const item = { nome, preco };
  carrinho.push(item); // Adiciona na lista
  atualizarCarrinho(); // Atualiza a tela
}

// 2. ATUALIZAR CARRINHO
function atualizarCarrinho() {
  const listaHtml = document.getElementById("lista-carrinho");
  const totalHtml = document.getElementById("valor-total");
  listaHtml.innerHTML = ""; // Limpa a lista visual

  let somaTotal = 0;

  carrinho.forEach((item, index) => {
    somaTotal += item.preco;
    listaHtml.innerHTML += `<li>${item.nome} - R$ ${item.preco.toFixed(2)} 
                            <button onclick="removerDoCarrinho(${index})">❌</button></li>`;
  });

  // Atualiza o valor total na tela
  totalHtml.innerText = somaTotal.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Salva a lista no navegador (LocalStorage)
  localStorage.setItem("meu_carrinho", JSON.stringify(carrinho));
}

// 3. REMOVER ITEM DO CARRINHO
function removerDoCarrinho(index) {
  carrinho.splice(index, 1); // Remove o item do carrinho
  atualizarCarrinho(); // Atualiza a tela
}

// 4. LIMPAR CARRINHO
function esvaziarCarrinho() {
  carrinho = [];
  atualizarCarrinho();
}

// 5. FINALIZAR COMPRA (simplesmente limpa o carrinho por enquanto)
function finalizarCompra() {
  alert("Compra finalizada! Estamos processando seu pedido.");
  esvaziarCarrinho(); // Limpa o carrinho após a compra
}

// Código para arrastar o carrinho
let carrinhoContainer = document.querySelector(".carrinho-container");

let isDragging = false;
let offsetX, offsetY;

// Ativar o arraste ao clicar no carrinho
carrinhoContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - carrinhoContainer.getBoundingClientRect().left;
  offsetY = e.clientY - carrinhoContainer.getBoundingClientRect().top;

  carrinhoContainer.style.cursor = "grabbing"; // Mudar o cursor durante o arrasto
});

// Desativar o arraste ao soltar o botão do mouse
document.addEventListener("mouseup", () => {
  isDragging = false;
  carrinhoContainer.style.cursor = "move"; // Restaurar o cursor
});

// Mover o carrinho enquanto o mouse estiver pressionado
document.addEventListener("mousemove", (e) => {
  if (isDragging) {
    let newX = e.clientX - offsetX;
    let newY = e.clientY - offsetY;
    carrinhoContainer.style.left = `${newX}px`;
    carrinhoContainer.style.top = `${newY}px`;
  }
});
