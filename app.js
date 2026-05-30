/*
 * Desenvolvido por Marcos Ribeiro
 * Contacto Suporte: +351 936 707 337
 * © 2026 | Portfólio de Análise e Desenvolvimento de Sistemas (ADS) - Código Protegido
 */

let tokenGerado = "";
let userMestre = localStorage.getItem('adminUserPimenta') || "";
let senhaMestra = localStorage.getItem('adminSenhaPimenta') || "";
let dispositivoConfiavel = localStorage.getItem('dispositivoConfiavel') || "nao";

// ============================================================
// INICIALIZAÇÃO — verifica se é primeiro acesso
// ============================================================
window.onload = function() {
    if (!userMestre || !senhaMestra) {
        // Primeiro acesso: mostra formulário de criação
        mostrarTela('criar-conta');
    } else {
        mostrarTela('login-normal');
    }
};

function mostrarTela(tela) {
    document.getElementById('tela-criar-conta').style.display = "none";
    document.getElementById('tela-login-normal').style.display = "none";
    document.getElementById('tela-token').style.display = "none";
    if (tela === 'criar-conta') document.getElementById('tela-criar-conta').style.display = "block";
    if (tela === 'login-normal') document.getElementById('tela-login-normal').style.display = "block";
    if (tela === 'token') document.getElementById('tela-token').style.display = "block";
}

// ============================================================
// CRIAR CONTA — primeiro acesso
// ============================================================
const CODIGO_INSTALACAO = "GFT2026";

function criarPrimeiroAcesso() {
    let codigoDigitado = document.getElementById('codigoInstalacao').value.trim();
    if (codigoDigitado !== CODIGO_INSTALACAO) {
        alert("❌ Código de instalação inválido! Contacte o administrador do sistema.");
        return;
    }

    let novoUser = document.getElementById('novoUserAdmin').value.trim();
    let novaSenha = document.getElementById('novaSenhaAdmin').value.trim();
    let tel = document.getElementById('adminTel').value.trim();
    let email = document.getElementById('adminEmail').value.trim();

    if (!novoUser || !novaSenha || !tel) {
        alert("Preencha pelo menos o utilizador, senha e telefone!");
        return;
    }
    if (novaSenha.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres!");
        return;
    }

    let telLimpo = tel.replace(/\D/g, '');
    if (!telLimpo.startsWith('55')) telLimpo = '55' + telLimpo;

    localStorage.setItem('adminUserPimenta', novoUser);
    localStorage.setItem('adminSenhaPimenta', novaSenha);
    localStorage.setItem('adminTelPimenta', telLimpo);
    if (email) localStorage.setItem('adminEmailPimenta', email);

    // Marca este dispositivo como confiável automaticamente no primeiro acesso
    localStorage.setItem('dispositivoConfiavel', 'sim');

    userMestre = novoUser;
    senhaMestra = novaSenha;
    dispositivoConfiavel = 'sim';

    alert("✅ Conta criada! Este dispositivo foi marcado como confiável. Bem-vindo!");
    desbloquearPainel();
}

// ============================================================
// LOGIN NORMAL
// ============================================================
function tentarLogin() {
    let user = document.getElementById('userLogin').value.trim();
    let senha = document.getElementById('senhaLogin').value.trim();

    if (user !== userMestre || senha !== senhaMestra) {
        alert("❌ Credenciais inválidas!");
        return;
    }

    if (dispositivoConfiavel === 'sim') {
        // Dispositivo confiável → entra direto
        desbloquearPainel();
    } else {
        // Dispositivo novo → envia token automaticamente
        tokenGerado = String(Math.floor(100000 + Math.random() * 900000));
        enviarTokenAutomatico();
        mostrarTela('token');
    }
}

// ============================================================
// TOKEN — envio automático pelo WhatsApp
// ============================================================
function enviarTokenAutomatico() {
    let numeroDestino = localStorage.getItem('adminTelPimenta') || "5531973586216";
    numeroDestino = numeroDestino.replace(/\D/g, '');
    if (!numeroDestino.startsWith('55')) numeroDestino = '55' + numeroDestino;
    let mensagem = `🔒 *GFT PIMENTA SEGURANÇA*\n\nO seu código de verificação é: *${tokenGerado}*\n\nNão partilhe este código com ninguém.`;
    window.open(`https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensagem)}`, '_blank');
}

function verificarToken() {
    let digitado = document.getElementById('tokenInput').value.trim();
    if (digitado.length < 6) return; // Aguarda 6 dígitos

    if (digitado === tokenGerado) {
        // Pergunta se quer marcar como confiável
        let confiar = confirm("✅ Código correto!\n\nDeseja marcar este dispositivo como confiável?\n(Não precisará de token nas próximas entradas)");
        if (confiar) {
            localStorage.setItem('dispositivoConfiavel', 'sim');
            dispositivoConfiavel = 'sim';
        }
        desbloquearPainel();
    } else {
        alert("❌ Código incorreto! Tente novamente.");
        document.getElementById('tokenInput').value = "";
    }
}

// ============================================================
// DESBLOQUEAR PAINEL
// ============================================================
function desbloquearPainel() {
    document.getElementById('tela-login').style.display = "none";
    document.getElementById('painel-admin').style.display = "block";
    carregarMenuInicio();
}

// ============================================================
// NAVEGAÇÃO DO MENU
// ============================================================
function carregarMenuInicio() {
    document.querySelectorAll('.box-screen').forEach(el => el.style.display = "none");
    document.getElementById('tela-inicio').style.display = "block";
}

function abrirTela(id) {
    document.querySelectorAll('.box-screen').forEach(el => el.style.display = "none");
    document.getElementById(id).style.display = "block";
    if (id === 'tela-alunos') carregarListaAlunos();
    if (id === 'tela-fotos') carregarListaFotos();
    if (id === 'tela-eventos') carregarListaEventos();
}

// ============================================================
// GESTÃO DE ALUNOS
// ============================================================
function salvarAluno() {
    let nome = document.getElementById('alunoNome').value.trim();
    let tel = document.getElementById('alunoTel').value.trim();
    let modalidade = document.getElementById('alunoModalidade').value;
    let nascimento = document.getElementById('alunoNasc').value;

    if (!nome || !tel) { alert("Preencha nome e telefone!"); return; }

    let alunos = JSON.parse(localStorage.getItem('alunosPimenta') || '[]');
    let matricula = '2026' + String(alunos.length + 1).padStart(3, '0');
    
    alunos.push({ matricula, nome, tel, modalidade, nascimento, data: new Date().toLocaleDateString('pt-BR') });
    localStorage.setItem('alunosPimenta', JSON.stringify(alunos));

    alert("✅ Aluno cadastrado! Matrícula: " + matricula);
    document.getElementById('alunoNome').value = "";
    document.getElementById('alunoTel').value = "";
    document.getElementById('alunoNasc').value = "";
    carregarListaAlunos();
}

function carregarListaAlunos() {
    let alunos = JSON.parse(localStorage.getItem('alunosPimenta') || '[]');
    let tabela = document.getElementById('tabelaAlunos');
    if (alunos.length === 0) {
        tabela.innerHTML = '<p style="color:#aaa;">Nenhum aluno cadastrado ainda.</p>';
        return;
    }
    let html = '<table style="width:100%;border-collapse:collapse;font-size:14px;">';
    html += '<tr style="background:#333;"><th style="padding:8px;">Matrícula</th><th style="padding:8px;">Nome</th><th style="padding:8px;">Modalidade</th><th style="padding:8px;">Telefone</th><th style="padding:8px;">Ações</th></tr>';
    alunos.forEach((a, i) => {
        html += `<tr style="border-bottom:1px solid #333;">
            <td style="padding:8px;text-align:center;">${a.matricula}</td>
            <td style="padding:8px;">${a.nome}</td>
            <td style="padding:8px;text-align:center;">${a.modalidade}</td>
            <td style="padding:8px;text-align:center;">${a.tel}</td>
            <td style="padding:8px;text-align:center;">
                <button onclick="removerAluno(${i})" style="background:#ff4444;color:white;padding:4px 10px;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Remover</button>
            </td>
        </tr>`;
    });
    html += '</table>';
    tabela.innerHTML = html;
}

function removerAluno(index) {
    if (!confirm("Remover este aluno?")) return;
    let alunos = JSON.parse(localStorage.getItem('alunosPimenta') || '[]');
    alunos.splice(index, 1);
    localStorage.setItem('alunosPimenta', JSON.stringify(alunos));
    carregarListaAlunos();
}

function buscarAlunoAdmin() {
    let termo = document.getElementById('buscaAlunoAdmin').value.trim().toLowerCase();
    let alunos = JSON.parse(localStorage.getItem('alunosPimenta') || '[]');
    let filtrados = alunos.filter(a => a.nome.toLowerCase().includes(termo) || a.matricula.includes(termo));
    let tabela = document.getElementById('tabelaAlunos');
    if (filtrados.length === 0) {
        tabela.innerHTML = '<p style="color:#ff4444;">Nenhum aluno encontrado.</p>';
        return;
    }
    let html = '<table style="width:100%;border-collapse:collapse;font-size:14px;">';
    html += '<tr style="background:#333;"><th style="padding:8px;">Matrícula</th><th style="padding:8px;">Nome</th><th style="padding:8px;">Modalidade</th><th style="padding:8px;">Telefone</th></tr>';
    filtrados.forEach(a => {
        html += `<tr style="border-bottom:1px solid #333;">
            <td style="padding:8px;text-align:center;">${a.matricula}</td>
            <td style="padding:8px;">${a.nome}</td>
            <td style="padding:8px;text-align:center;">${a.modalidade}</td>
            <td style="padding:8px;text-align:center;">${a.tel}</td>
        </tr>`;
    });
    html += '</table>';
    tabela.innerHTML = html;
}

// Função usada no portal público para buscar matrícula
function buscarMatriculaPublica(matricula) {
    let alunos = JSON.parse(localStorage.getItem('alunosPimenta') || '[]');
    return alunos.find(a => a.matricula === matricula) || null;
}

// ============================================================
// GESTÃO DE FOTOS
// ============================================================
function adicionarFoto() {
    let nome = document.getElementById('fotoNome').value.trim();
    if (!nome) { alert("Digite o nome do ficheiro! Ex: pimenta22.jpg"); return; }
    
    let fotos = JSON.parse(localStorage.getItem('fotosPimenta') || '[]');
    if (fotos.includes(nome)) { alert("Esta foto já existe na lista!"); return; }
    
    fotos.push(nome);
    localStorage.setItem('fotosPimenta', JSON.stringify(fotos));
    document.getElementById('fotoNome').value = "";
    carregarListaFotos();
}

function carregarListaFotos() {
    let fotos = JSON.parse(localStorage.getItem('fotosPimenta') || '[]');
    let lista = document.getElementById('listaFotos');
    if (fotos.length === 0) {
        lista.innerHTML = '<p style="color:#aaa;">Nenhuma foto extra adicionada. O carrossel usa as fotos padrão (pimenta1 a pimenta21).</p>';
        return;
    }
    let html = '';
    fotos.forEach((f, i) => {
        html += `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px;border-bottom:1px solid #333;">
            <span>📷 ${f}</span>
            <button onclick="removerFoto(${i})" style="background:#ff4444;color:white;padding:4px 10px;border:none;border-radius:4px;cursor:pointer;font-size:12px;">Remover</button>
        </div>`;
    });
    lista.innerHTML = html;
}

function removerFoto(index) {
    if (!confirm("Remover esta foto do carrossel?")) return;
    let fotos = JSON.parse(localStorage.getItem('fotosPimenta') || '[]');
    fotos.splice(index, 1);
    localStorage.setItem('fotosPimenta', JSON.stringify(fotos));
    carregarListaFotos();
}

// ============================================================
// GESTÃO DE EVENTOS / CALENDÁRIO
// ============================================================
function salvarEvento() {
    let titulo = document.getElementById('eventoTitulo').value.trim();
    let data = document.getElementById('eventoData').value;
    let hora = document.getElementById('eventoHora').value;
    let local = document.getElementById('eventoLocal').value.trim();
    let descricao = document.getElementById('eventoDesc').value.trim();

    if (!titulo || !data) { alert("Preencha título e data!"); return; }

    let eventos = JSON.parse(localStorage.getItem('eventosPimenta') || '[]');
    eventos.push({ titulo, data, hora, local, descricao });
    // Ordena por data
    eventos.sort((a, b) => new Date(a.data) - new Date(b.data));
    localStorage.setItem('eventosPimenta', JSON.stringify(eventos));

    alert("✅ Evento adicionado com sucesso!");
    document.getElementById('eventoTitulo').value = "";
    document.getElementById('eventoData').value = "";
    document.getElementById('eventoHora').value = "";
    document.getElementById('eventoLocal').value = "";
    document.getElementById('eventoDesc').value = "";
    carregarListaEventos();
}

function carregarListaEventos() {
    let eventos = JSON.parse(localStorage.getItem('eventosPimenta') || '[]');
    let lista = document.getElementById('listaEventos');
    if (eventos.length === 0) {
        lista.innerHTML = '<p style="color:#aaa;">Nenhum evento agendado.</p>';
        return;
    }
    let html = '';
    eventos.forEach((e, i) => {
        let dataFormatada = new Date(e.data + 'T00:00:00').toLocaleDateString('pt-BR');
        html += `<div style="background:#1a1a1a;padding:12px;border-radius:6px;margin-bottom:10px;border-left:3px solid #ffcc00;">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                    <strong style="font-size:15px;">🥊 ${e.titulo}</strong><br>
                    <span style="color:#aaa;font-size:13px;">📅 ${dataFormatada} ${e.hora ? 'às ' + e.hora : ''} ${e.local ? '| 📍 ' + e.local : ''}</span>
                    ${e.descricao ? '<br><span style="font-size:13px;color:#ccc;">' + e.descricao + '</span>' : ''}
                </div>
                <button onclick="removerEvento(${i})" style="background:#ff4444;color:white;padding:4px 10px;border:none;border-radius:4px;cursor:pointer;font-size:12px;margin-left:10px;">Remover</button>
            </div>
        </div>`;
    });
    lista.innerHTML = html;
}

function removerEvento(index) {
    if (!confirm("Remover este evento?")) return;
    let eventos = JSON.parse(localStorage.getItem('eventosPimenta') || '[]');
    eventos.splice(index, 1);
    localStorage.setItem('eventosPimenta', JSON.stringify(eventos));
    carregarListaEventos();
}

// ============================================================
// ALTERAR CREDENCIAIS
// ============================================================
function alterarCredenciais() {
    let novoUser = document.getElementById('altUser').value.trim();
    let novaSenha = document.getElementById('altSenha').value.trim();
    let novoTel = document.getElementById('altTel').value.trim();

    if (!novoUser || !novaSenha || !novoTel) { alert("Preencha todos os campos!"); return; }

    let telLimpo = novoTel.replace(/\D/g, '');
    if (!telLimpo.startsWith('55')) telLimpo = '55' + telLimpo;

    localStorage.setItem('adminUserPimenta', novoUser);
    localStorage.setItem('adminSenhaPimenta', novaSenha);
    localStorage.setItem('adminTelPimenta', telLimpo);
    // Remove confiança de todos os dispositivos ao alterar credenciais
    localStorage.removeItem('dispositivoConfiavel');
    dispositivoConfiavel = 'nao';
    userMestre = novoUser;
    senhaMestra = novaSenha;

    alert("✅ Credenciais atualizadas! Todos os dispositivos precisarão de token na próxima entrada.");
}

function recuperarAlterarSenha() {
    let mensagem = `Olá! Preciso de suporte para recuperar o acesso ao painel GFT Pimenta.`;
    window.open(`https://wa.me/351936707337?text=${encodeURIComponent(mensagem)}`, '_blank');
}
