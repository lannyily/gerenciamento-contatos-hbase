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

            contatoList.innerHTML = '';
            contatosGrupo.innerHTML = '';

            data.forEach(contato => {
                const li = document.createElement('li');
                li.textContent = `${contato.nome} - ${contato.telefone} - ${contato.email}`;
                contatoList.appendChild(li);

                const option = document.createElement('option');
                option.value = contato.id;  
                option.textContent = contato.nome;  
                contatosGrupo.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Erro:', error);
        });
}

document.getElementById('contatosGrupo').addEventListener('change', function(event) {
    const selectedOptions = Array.from(event.target.selectedOptions);
    if (selectedOptions.length > 10) {
        alert('Você pode selecionar no máximo 10 contatos.');
        event.target.options[selectedOptions.length - 1].selected = false;
    }
});

document.addEventListener('DOMContentLoaded', loadContacts);

document.getElementById('addContatoBtn').addEventListener('click', function() {
    const contatosGrupo = document.getElementById('contatosGrupo');
    const selectedContactsList = document.getElementById('selectedContactsList');

    if (selectedContactsList.children.length >= 10) {
        alert("Você pode selecionar no máximo 10 contatos.");
        return; 
    }

    const selectedOptions = Array.from(contatosGrupo.selectedOptions);
    selectedOptions.forEach(option => {
        if (![...selectedContactsList.children].some(li => li.textContent === option.textContent)) {
            const li = document.createElement('li');
            li.textContent = option.textContent; 
            selectedContactsList.appendChild(li);
        } else {
            alert(`${option.textContent} já foi selecionado.`); 
        }
    });
});

document.getElementById('grupoForm').addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    const grupoData = {
        idGrupo: document.getElementById('idGrupo').value,
        nomeGrupo: document.getElementById('nomeGrupo').value,
        contatos: Array.from(document.getElementById('contatosGrupo').selectedOptions).map(option => option.value) 
    };

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
        console.log(data.message); 
        document.getElementById('grupoForm').reset();
        selectedContactsList.innerHTML = '';
    })
    .catch(error => {
        console.error('Erro:', error);
    });
});


