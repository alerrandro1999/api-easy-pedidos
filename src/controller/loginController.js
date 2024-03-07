require("dotenv").config();
const jwt = require("jsonwebtoken");
const Firebird = require("node-firebird");

exports.authLogin = async (req, res) => {
  const { celular } = req.body;

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
      return res.status(404).json(err);
    }

    const query =
      "SELECT cad.CODIGO, cad.NOME, cad.COD_ENTIDADE FROM CADASTRO as cad WHERE cad.CELULAR = ?";

    db.query(query, celular, function (err, result) {
      db.detach();

      if (!result || result.length === 0) {
        return res.status(250).json({ msg: "Usuário não encontrado" });
      }

      if (err) {
        return res.status(250).json({ msg: "Usuário não encontrado" });
      } else {
        const secret = process.env.SECRET;
        const token = jwt.sign(
          {
            id: result[0]["CODIGO"],
            nome: result[0]["NOME"],
            cod_entidade: result[0]["COD_ENTIDADE"],
          },
          secret
        );
        return res
          .status(200)
          .json({ msg: "Autenticação realizada com sucesso", token });
      }
    });
  });
};
