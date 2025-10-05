# GitHub Workflows Setup Instructions

## ⚠️ Important: Manual Setup Required

GitHub workflows need to be added manually because the current GitHub token doesn't have `workflow` scope.

---

## 🔧 Setup Steps

### Option 1: Add via GitHub Web UI (Recommended)

1. **Go to your repository:**
   https://github.com/MoonMax000/tyrian-monorepo

2. **Navigate to Actions tab**
   - Click "Actions" in the top menu
   - Click "New workflow"
   - Click "set up a workflow yourself"

3. **Create ci.yml:**
   - Name: `.github/workflows/ci.yml`
   - Copy content from `Infrastructure_COMPLETE.md` section "CI.yml"
   - Or download from: `.github/workflows/ci.yml` (in repo)
   - Click "Start commit" → "Commit new file"

4. **Create cd.yml:**
   - Repeat for `.github/workflows/cd.yml`
   - Copy content from documentation

5. **Done!** CI/CD will now run automatically

---

### Option 2: Update GitHub Token and Push

1. **Create new token with `workflow` scope:**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes:
     - ✅ repo (all)
     - ✅ workflow
   - Generate token

2. **Push workflows:**
   ```bash
   cd tyrian-monorepo
   git add .github/workflows/
   git commit -m "ci: add GitHub Actions workflows"
   git push origin main
   ```

---

### Option 3: Add Locally and Push

1. **Ensure workflows exist:**
   ```bash
   ls -la .github/workflows/
   # Should show: ci.yml, cd.yml
   ```

2. **Add to git (already staged):**
   ```bash
   git add .github/workflows/
   git status  # Verify files are staged
   ```

3. **Commit and push:**
   ```bash
   git commit -m "ci: add GitHub Actions workflows"
   
   # Use Personal Access Token with workflow scope
   git push origin main
   ```

---

## 📋 Workflow Files Location

The workflow files are already created in your local repository:

```
tyrian-monorepo/
└── .github/
    └── workflows/
        ├── ci.yml    ✅ Created (not pushed)
        └── cd.yml    ✅ Created (not pushed)
```

---

## ✅ Verification

After adding workflows, verify they work:

1. **Check Actions tab:**
   - Go to: https://github.com/MoonMax000/tyrian-monorepo/actions
   - You should see workflows listed

2. **Trigger CI:**
   ```bash
   # Make a small change
   echo "# Test" >> README.md
   git add README.md
   git commit -m "test: trigger CI"
   git push origin main
   ```

3. **Watch CI run:**
   - Go to Actions tab
   - Click on the running workflow
   - Monitor progress

---

## 📊 Expected CI/CD Behavior

### CI (Continuous Integration)
**Triggers:** Push to main/develop, Pull Requests

**Jobs:**
1. ✅ Lint - Check code quality
2. ✅ Build Frontends - Build all 6 apps
3. ✅ Build Go Backends - Build 11 services
4. ✅ Build Python Backends - Build 3 services
5. ✅ Docker Build - Test containerization
6. ✅ E2E Tests - End-to-end testing

**Duration:** ~10-15 minutes

### CD (Continuous Deployment)
**Triggers:** Push to main, Tags (v*.*.*)

**Jobs:**
1. ✅ Build & Push Images - To GitHub Container Registry
2. ✅ Deploy to Staging - Auto-deploy main
3. ✅ Deploy to Production - Deploy on version tags
4. ✅ Smoke Tests - Verify deployment

**Duration:** ~10-20 minutes

---

## 🔐 Required Secrets (for CD)

After workflows are added, configure these secrets in GitHub:

1. **Go to Settings → Secrets and variables → Actions**

2. **Add these secrets:**
   ```
   DATABASE_URL          - Production database URL
   REDIS_URL            - Production Redis URL
   RABBITMQ_URL         - Production RabbitMQ URL
   S3_ENDPOINT          - Production S3 endpoint
   S3_ACCESS_KEY        - S3 access key
   S3_SECRET_KEY        - S3 secret key
   JWT_SECRET           - JWT signing secret
   ENCRYPTION_KEY       - Encryption key
   ```

3. **Optional (for Kubernetes deployment):**
   ```
   KUBECONFIG           - Kubernetes configuration
   KUBE_CA_CERT         - Kubernetes CA certificate
   KUBE_TOKEN           - Kubernetes token
   ```

---

## 🚀 Quick Test

Once workflows are added, test them:

```bash
# 1. Make a small change
cd tyrian-monorepo
echo "# Infrastructure Complete" >> README.md

# 2. Commit and push
git add README.md
git commit -m "docs: update readme"
git push origin main

# 3. Watch CI run
open https://github.com/MoonMax000/tyrian-monorepo/actions

# 4. Wait for ✅ Success!
```

---

## 🎯 CI Status Badges

After workflows are running, add badges to README.md:

```markdown
![CI](https://github.com/MoonMax000/tyrian-monorepo/workflows/CI%20-%20Build%20and%20Test/badge.svg)
![CD](https://github.com/MoonMax000/tyrian-monorepo/workflows/CD%20-%20Deploy/badge.svg)
```

---

## 📚 Additional Resources

- **GitHub Actions Docs:** https://docs.github.com/en/actions
- **Workflow Syntax:** https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions
- **Nx with GitHub Actions:** https://nx.dev/recipes/ci/monorepo-ci-github-actions

---

## 🆘 Troubleshooting

### Workflows not showing up?
- Ensure files are in `.github/workflows/` directory
- Check file names: `ci.yml`, `cd.yml` (lowercase)
- Verify YAML syntax: https://www.yamllint.com/

### CI fails immediately?
- Check Node.js version (should be 20)
- Verify `package.json` and `package-lock.json` exist
- Check GitHub Actions logs for details

### CD cannot push images?
- Verify `GITHUB_TOKEN` has packages permission
- Check GitHub Container Registry is enabled
- Review CD workflow logs

---

**Status:** Workflows created locally, need manual GitHub setup  
**Priority:** Medium (CI/CD not critical for development)  
**Time:** 10 minutes to setup

**Note:** All other infrastructure (Docker, Testing) is fully functional!

