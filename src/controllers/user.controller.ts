const allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  const userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  const adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  const moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };

  export {allAccess,userBoard,adminBoard,moderatorBoard};