const Firebird = require("node-firebird");

exports.getProducts = async (req, res) => {
  var options = {};
  options.host = "localhost";
  options.port = 3050;
  options.database = "C:\\banco\\EASY.FDB";
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
    const query = "SELECT * FROM PRODUTOS";

    const params = [cpf];

    db.query(query, params, function (err, result) {
      db.detach();

      if (!result || result.length === 0) {
        return res.status(250).json({ msg: "Usuário não encontrado" });
      }

      if (err) {
        return res.status(250).json({ msg: "Usuário não encontrado" });
      } else {
        console.log(result);
        return res.status(200).json({ result });
      }
    });
  });
};
