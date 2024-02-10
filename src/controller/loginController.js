require("dotenv").config();
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "acesso negado" });
  }

  try {
    const secret = process.env.SECRET;
    decode = jwt.verify(token, secret);
    res.status(200).json({
      user: decode,
      token: token,
    });
  } catch (error) {
    res.status(400).json({ msg: "Token inválido" });
  }
};

const Firebird = require("node-firebird");

exports.authLogin = async (req, res) => {
  const { celular } = req.body;

  /////////////////////////////////////////////////////////////////////////////////
  var options = {};
  options.host = "192.168.1.20";
  options.port = 3050;
  options.database = "C:\\banco\\easy.VCI";
  options.user = "sysdba";
  options.password = "masterkey";
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
      "SELECT FIRST 1 cad.CODIGO, cad.NOME, cad.COD_ENTIDADE FROM CADASTRO as cad WHERE cad.CELULAR = ?";

    const params = [celular];

    db.query(query, params, function (err, result) {
      db.detach();

      if (!result || result.length === 0) {
        return res.status(250).json({ msg: "Usuário não encontrado" });
      }

      if (err) {
        return res.status(250).json({ msg: "Usuário não encontrado" });
      } else {
        console.log(result);
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
