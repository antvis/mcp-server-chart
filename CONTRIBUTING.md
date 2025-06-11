# Contributing

## Fork Workflow

```bash
# Daily development
git checkout -b feature-name
git add .
git commit -m "Your commit message"
git push origin feature-name

# Keep fork updated
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Sync feature branch
git checkout feature-name
git rebase main

# Cleanup after PR merge
git branch -d feature-name
git push origin --delete feature-name
```

## Remote Setup

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/mcp-server-chart.git
git remote add upstream https://github.com/antvis/mcp-server-chart.git
```

## Guidelines

- Create feature branches from latest `main`
- Write clear commit messages
- Test changes before submitting
- One feature per PR

**Workflow**: Branch → Changes → Commit → Push → PR → Merge → Cleanup → Repeat