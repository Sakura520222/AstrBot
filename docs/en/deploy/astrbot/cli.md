# Deploy this personal fork from source

See the [fork maintenance guide](/en/fork-maintenance). Install Git, uv and Python 3.12 or later:

```bash
git clone https://github.com/Sakura520222/AstrBot.git
cd AstrBot
uv sync --locked --inexact
uv run --no-sync main.py
```

Open `http://localhost:6185`. Stop the running instance, then back up and preserve the entire `data/` directory before updating. The WebUI comes from this fork's matching GitHub Release.
