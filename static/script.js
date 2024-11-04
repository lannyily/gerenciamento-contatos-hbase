function loadContacts() {
    fetch('/api/Contatos')
        .then(response => {
            if (!response.ok) {
                console.error('Falha ao carregar contatos:', response.status, response.statusText);
                throw new Error('Erro ao carregar contatos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Contatos carregados:', data);
            const contatoList = document.getElementById('contatoList');
            const contatosGrupo = document.getElementById('contatosGrupo');

            // Limpa a lista e o select antes de adicionar os contatos
            contatoList.innerHTML = '';
            contatosGrupo.innerHTML = '';

            data.forEach(contato => {
                // Adiciona cada contato à lista
                const li = document.createElement('li');
                li.textContent = `${contato.nome} - ${contato.telefone} - ${contato.email}`;
                contatoList.appendChild(li);

                // Adiciona cada contato ao select
                const option = document.createElement('option');
                option.value = contato.id;  // Use o ID como valor
                option.textContent = contato.nome;  // Nome para ser exibido
                contatosGrupo.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

// Adiciona um listener para o evento de mudança no select
document.getElementById('contatosGrupo').addEventListener('change', function(event) {
    const selectedOptions = Array.from(event.target.selectedOptions);
    if (selectedOptions.length > 10) {
        alert('Você pode selecionar no máximo 10 contatos.');
        // Remove a seleção mais recente se exceder 10
        event.target.options[selectedOptions.length - 1].selected = false;
    }
});

// Chama a função para carregar os contatos ao iniciar
document.addEventListener('DOMContentLoaded', loadContacts);

document.getElementById('addContatoBtn').addEventListener('click', function() {
    const contatosGrupo = document.getElementById('contatosGrupo');
    const selectedContactsList = document.getElementById('selectedContactsList');

    // Verifica se o número máximo de contatos foi atingido
    if (selectedContactsList.children.length >= 10) {
        alert("Você pode selecionar no máximo 10 contatos.");
        return; // Impede a adição de mais contatos se o limite for atingido
    }

    // Itera sobre as opções selecionadas
    const selectedOptions = Array.from(contatosGrupo.selectedOptions);
    selectedOptions.forEach(option => {
        // Verifica se o contato já está na lista
        if (![...selectedContactsList.children].some(li => li.textContent === option.textContent)) {
            const li = document.createElement('li');
            li.textContent = option.textContent; // Usa o nome do contato
            selectedContactsList.appendChild(li);
        } else {
            alert(`${option.textContent} já foi selecionado.`); // Aviso se o contato já foi adicionado
        }
    });
});

// Lida com o envio do formulário para adicionar o grupo
document.getElementById('grupoForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio normal do formulário
    
    const grupoData = {
        idGrupo: document.getElementById('idGrupo').value,
        nomeGrupo: document.getElementById('nomeGrupo').value,
        contatos: Array.from(document.getElementById('contatosGrupo').selectedOptions).map(option => option.value) // Obtém o ID dos contatos selecionados
    };

    // Envia os dados do grupo para o servidor (você precisará criar a rota correspondente)
    fetch('/api/Grupos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(grupoData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao adicionar grupo');
        }
        return response.json();
    })
    .then(data => {
        console.log(data.message); // Mensagem de sucesso
        // Aqui você pode limpar o formulário ou adicionar outras ações
        document.getElementById('grupoForm').reset();
        selectedContactsList.innerHTML = ''; // Limpa a lista de contatos selecionados
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});


