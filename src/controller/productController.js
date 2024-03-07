require("dotenv").config();

const Firebird = require("node-firebird");

exports.getProducts = async (req, res) => {
  const { cod_entidade } = req.body;
  var options = {};
  // options.host = "192.168.1.12";
  // options.database = "C:\\banco\\easy.VCI";
  options.host = "89.213.142.202";
  options.port = "3050";
  options.database = "C:\\Dev\\Delphi\\Banco\\VCI.Vci";
  options.user = "sysdba";
  options.password = "ciecmaster";
  // options.password = "masterkey";
  options.lowercase_keys = false;
  options.role = null;
  options.pageSize = 4096;
  options.pageSize = 4096;
  options.retryConnectionInterval = 1000;
  options.blobAsText = false;
  options.encoding = "UTF-8";

  Firebird.attach(options, function (err, db) {
    if (err) {
      return res.status(200).json(err);
    }
    const query =
      "SELECT COD_PRODUTO AS ID, PRODUTO AS NOME FROM PRODUTOS WHERE COD_ENTIDADE = ?";

    const params = [cod_entidade];

    db.query(query, params, function (err, result) {
      db.detach();

      if (!result || result.length === 0) {
        return res.status(250).json({ msg: "Produto não encontrado" });
      }

      if (err) {
        return res.status(250).json({ msg: "Produto não encontrado" });
      } else {
        return res.status(200).json({ result });
      }
    });
  });
};

exports.insertProducts = async (req, res) => {
  try {
    const data = req.body;
    if (!data || !Array.isArray(data)) {
      return res
        .status(400)
        .json({ error: "Dados inválidos ou ausentes no corpo da requisição." });
    }

    console.log(data);

    var options = {};
    // options.host = "192.168.1.12";
    // options.database = "C:\\banco\\easy.VCI";
    options.host = "89.213.142.202";
    options.port = "3050";
    options.database = "C:\\Dev\\Delphi\\Banco\\VCI.Vci";
    options.user = "sysdba";
    options.password = "ciecmaster";
    // options.password = "masterkey";
    options.lowercase_keys = false;
    options.role = null;
    options.pageSize = 4096;
    options.pageSize = 4096;
    options.retryConnectionInterval = 1000;
    options.blobAsText = false;
    options.encoding = "UTF-8";

    const db = await new Promise(async (resolve, reject) => {
      Firebird.attach(options, async (err, db) => {
        if (err) throw err;

        const genIdQuery =
          "SELECT GEN_ID(GEN_TRANSACAO_PREVENDA, 1) AS GENERATED_ID FROM RDB$DATABASE";

        const resultGenId = await new Promise((resolve, reject) => {
          db.query(genIdQuery, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
        if (!resultGenId || resultGenId.length === 0) {
          throw new Error("Erro ao obter GEN_ID de PREVENDA.");
        }
        const codprevenda = resultGenId[0].GENERATED_ID;
        for (const item of data) {
          const prevendaQuery =
            "UPDATE OR INSERT INTO PREVENDA (COD_FILIAL, CODIGO, CODPREVENDA, COD_VENDEDOR, SITUACAO, DATA_EMISSAO, DATA_ENTREGA, COD_TRANSACAO, TOTAL_PRODUTOS, VALOR_FRETE, OUTRAS_DESPESAS, VALOR_IPI, DESCONTO, VALOR_ICMS, BASE_ICMS, PORC_ICMS, VALOR_SEGURO, VALOR_ICMSST, BASE_ICMSST, TOTAL_FINAL, VALOR_PIS, VALOR_COFINS, VALOR_FINANCEIRA) VALUES (?, ?, ?, ?, 'N', CURRENT_DATE, CURRENT_DATE, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)";

          const paramsPrevenda = [
            item.COD_FILIAL,
            item.CODIGO,
            codprevenda,
            item.CODIGO,
          ];

          db.query(prevendaQuery, paramsPrevenda, (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });

          const itemQuery =
            "SELECT COALESCE(MAX(ITEM), 0) + 1 AS NEXT_ITEM FROM PREITENS WHERE COD_FILIAL = ? AND CODPREVENDA = ?";

          const paramsItem = [item.COD_FILIAL, codprevenda];

          const resultItem = await new Promise((resolve, reject) => {
            db.query(itemQuery, paramsItem, (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            });
          });

          if (!resultItem || resultItem.length === 0) {
            throw new Error("Erro ao obter NEXT_ITEM de PREITENS.");
          }

          const nextItem = resultItem[0].NEXT_ITEM;

          const preitensQuery =
            "UPDATE OR INSERT INTO PREITENS (COD_FILIAL, CODPREVENDA, ITEM, COD_PRODUTO, COD_VENDEDOR, QUANTIDADE, PRODUTO, PRECO_CUSTO, VALOR_TOTAL, PRECO_VENDA, PRECO_FINAL, ORIGEM, MODALIDADE_ICMS, CFOP, CST_ICMS, BASE_ICMS, RED_BASE_ICMS, PORC_ICMS, VALOR_ICMS, MODALIDADE_ICMSST, BASE_ICMSST, RED_BASE_ICMSST, PORC_MVA, PORC_ICMSST, VALOR_ICMSST, CST_IPI, VALOR_IPI, PORC_IPI, CST_PIS, VALOR_PIS, PORC_PIS, CST_COFINS, VALOR_COFINS, PORC_COFINS, PRECO_DESCONTO) VALUES(?, ?, ?, ?, ?, ?, ?, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)";

          const paramsPreitens = [
            item.COD_FILIAL,
            codprevenda,
            nextItem,
            item.COD_PRODUTO,
            item.CODIGO,
            item.QUANTIDADE,
            item.PRODUTO,
          ];

          await new Promise((resolve, reject) => {
            db.query(preitensQuery, paramsPreitens, (err) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            });
          });
        }
        db.detach();
      });
    });

    return res.status(200).json({ msg: "Pedido realizado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
