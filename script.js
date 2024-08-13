$(document).ready(function() {
    $('#consultar').on('click', function() {
        let cnpj = $('#cnpj').val();
        if (cnpj) {
            // Remove caracteres não numéricos do CNPJ
            cnpj = cnpj.replace(/\D/g, '');
            consultarCNPJ(cnpj);
        } else {
            alert('Por favor, insira um CNPJ.');
        }
    });

    function consultarCNPJ(cnpj) {
        fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`)
            .then(response => response.json())
            .then(data => {
                displayData(data);
                $('#enviar').show();
            })
            .catch(error => {
                console.error('Erro ao consultar a API:', error);
                alert('Erro ao consultar a API.');
            });
    }

    function displayData(data) {
        const empresaHtml = `
            <div>
                <h2>Informações da Empresa</h2>
                <div class="form-group">
                    <label for="nome">Nome:</label>
                    <input type="text" id="nome" value="${data.nome}">
                </div>
                <div class="form-group">
                    <label for="razao_social">Razão Social:</label>
                    <input type="text" id="razao_social" value="${data.razao_social}">
                </div>
                <div class="form-group">
                    <label for="data_inicio_atividade">Data de Abertura:</label>
                    <input type="text" id="data_inicio_atividade" value="${data.data_inicio_atividade}">
                </div>
                <div class="form-group">
                    <label for="descricao_situacao_cadastral">Situação:</label>
                    <input type="text" id="descricao_situacao_cadastral" value="${data.descricao_situacao_cadastral}">
                </div>
                <div class="form-group">
                    <label for="cnae_fiscal_descricao">Atividade Principal:</label>
                    <input type="text" id="cnae_fiscal_descricao" value="${data.cnae_fiscal_descricao}">
                </div>
                <div class="form-group">
                    <label for="endereco">Endereço:</label>
                    <textarea id="endereco">${data.logradouro}, ${data.numero} ${data.complemento ? data.complemento : ''}, ${data.bairro}, ${data.municipio}, ${data.uf}, ${data.cep}</textarea>
                </div>
                <div class="form-group">
                    <label for="telefone">Telefone:</label>
                    <input type="text" id="telefone" value="${data.ddd_telefone_1}">
                </div>
                <div class="form-group">
                    <label for="email">Email:</label>
                    <input type="text" id="email" value="${data.email}">
                </div>
            </div>
            <h3>Sócios:</h3>
            <div id="socios">
                ${data.qsa.map((socio, index) => `
                    <div class="card">
                        <div class="form-group">
                            <label for="nome_socio_${index}">Nome:</label>
                            <input type="text" id="nome_socio_${index}" value="${socio.nome_socio}">
                        </div>
                        <div class="form-group">
                            <label for="qualificacao_socio_${index}">Qualificação:</label>
                            <input type="text" id="qualificacao_socio_${index}" value="${socio.qualificacao_socio}">
                        </div>
                        <div class="form-group">
                            <label for="faixa_etaria_${index}">Faixa Etária:</label>
                            <input type="text" id="faixa_etaria_${index}" value="${socio.faixa_etaria}">
                        </div>
                        <div class="form-group">
                            <label for="data_entrada_sociedade_${index}">Data de Entrada:</label>
                            <input type="text" id="data_entrada_sociedade_${index}" value="${socio.data_entrada_sociedade}">
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        $('#resultado').html(empresaHtml);
    }

    $('#enviar').on('click', function() {
        const dadosEmpresa = {
            nome: $('#nome').val(),
            razao_social: $('#razao_social').val(),
            data_inicio_atividade: $('#data_inicio_atividade').val(),
            descricao_situacao_cadastral: $('#descricao_situacao_cadastral').val(),
            cnae_fiscal_descricao: $('#cnae_fiscal_descricao').val(),
            endereco: $('#endereco').val(),
            telefone: $('#telefone').val().replace(/\D/g, ''),
            email: $('#email').val(),
            socios: []
        };

        $('#socios .card').each(function(index, element) {
            const socio = {
                nome_socio: $(`#nome_socio_${index}`).val(),
                qualificacao_socio: $(`#qualificacao_socio_${index}`).val(),
                faixa_etaria: $(`#faixa_etaria_${index}`).val(),
                data_entrada_sociedade: $(`#data_entrada_sociedade_${index}`).val()
            };
            dadosEmpresa.socios.push(socio);
        });

        console.log('Dados enviados:', dadosEmpresa);
        alert('Dados enviados com sucesso!');
        // Aqui você pode enviar os dados para o servidor usando fetch ou ajax
    });
});