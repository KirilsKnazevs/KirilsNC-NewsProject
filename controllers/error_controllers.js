function handlePSQLErrors(err, req, res, next) {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required fields" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  } else {
    next(err);
  }
}

function handleCustomErrors(err, req, res, next) {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
}

function handleInternalErrors(err, req, res, next) {
  res.status(500).send({ msg: "internal server error" });
}

module.exports = { handlePSQLErrors, handleCustomErrors, handleInternalErrors };
