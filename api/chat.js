export default function handler(req, res) {
  res.status(200).json({
    content: [
      {
        text: "Test OK — Clerra fonctionne."
      }
    ]
  });
}
