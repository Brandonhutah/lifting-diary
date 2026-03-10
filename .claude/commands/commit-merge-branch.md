# Commit, Merge to Main, and Create New Branch

Perform the following steps in order:

## Step 1: Commit current changes

1. Run `git status` to see all changed and untracked files.
2. Run `git diff` to understand what has changed.
3. Run `git log --oneline -5` to understand the commit style of this repo.
4. Stage all relevant changed files (avoid secrets like `.env`).
5. Write a concise, meaningful commit message based on the actual changes. Follow the repo's existing commit message style.
6. Commit with:
```
git commit -m "$(cat <<'EOF'
<your message here>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

## Step 2: Merge current branch into main

1. Note the current branch name: `git branch --show-current`
2. Switch to main: `git checkout main`
3. Merge: `git merge <current-branch>`
4. If there are merge conflicts, resolve them carefully by reading each conflicted file and applying the correct resolution. After resolving, stage the files and complete the merge with `git commit`.
5. Verify the merge succeeded: `git log --oneline -5`

## Step 3: Create new branch

1. Create and switch to a new branch named `$ARGUMENTS`:
```
git checkout -b $ARGUMENTS
```
2. Confirm the new branch is active: `git branch --show-current`

Report the final state: what was committed, what was merged, and the name of the new branch now active.
