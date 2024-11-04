from flask import Flask, render_template, request, jsonify
import happybase

app = Flask(__name__)

# Substitua isso pelo seu endereço HBase, se necessário
connection = happybase.Connection('localhost')
table = connection.table('Contatos')
grupos_table = connection.table('Grupos')

@app.route('/')
def index():
    return render_template('index.html')  # Altera para o caminho correto

@app.route('/api/Contatos', methods=['GET'])
def get_contacts():
    try:
        contatos = []
        for key, data in table.scan():
            contatos.append({
                'id': key.decode('utf-8'),  # Decodifica o ID
                'nome': data[b'info:nome'].decode('utf-8'),  # Decodifica o nome
                'telefone': data[b'info:telefone'].decode('utf-8'),  # Decodifica o telefone
                'email': data[b'info:email'].decode('utf-8')  # Decodifica o email
            })
        return jsonify(contatos), 200
    except Exception as e:
        print(f"Erro ao obter contatos: {e}")  # Log de erro para depuração
        return jsonify({"error": str(e)}), 500

@app.route('/api/Contatos', methods=['POST'])
def add_contact():
    try:
        data = request.get_json()
        contato_id = data['id']
        nome = data['nome']
        telefone = data['telefone']
        email = data['email']
        
        # Insere o contato no HBase
        table.put(contato_id, {
            'info:nome': nome,
            'info:telefone': telefone,
            'info:email': email,
        })

        return jsonify({"message": "Contato adicionado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/Grupos', methods=['POST'])
def add_group():
    try:
        data = request.get_json()
        id_grupo = data['idGrupo']
        nome_grupo = data['nomeGrupo']
        contatos = data['contatos']

        # Insere o grupo no HBase
        grupos_table.put(id_grupo, {
            'detalhes:nomeGrupo': nome_grupo,
            'detalhes:contatos': ','.join(contatos)  # Armazena os IDs dos contatos como uma string
        })

        return jsonify({"message": "Grupo adicionado com sucesso!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/Grupos', methods=['GET'])
def get_grupos():
    try:
        grupos = []
        for key, data in table.scan():
            grupos.append({
                'idGrupo': key.decode('utf-8'),
                'nomeGrupo': data[b'info:nomeGrupo'].decode('utf-8'),
                'contatos': data[b'info:contatos'].decode('utf-8')  # Aqui você pode formatar como preferir
            })
        return jsonify(grupos), 200
    except Exception as e:
        print(f"Erro ao obter grupos: {e}")  # Log de erro para depuração
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
