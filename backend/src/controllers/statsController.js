exports.getHomeStats = (req, res) => {
  const { gameCode } = req.params;

  res.json({ gameCode, stats: [] });
};

exports.getAwayStats = (req, res) => {
  const { gameCode } = req.params;

  res.json({ gameCode, stats: [] });
};

exports.getH2HStats = (req, res) => {
  const { gameCode } = req.params;

  res.json({ gameCode, stats: [] });
};
