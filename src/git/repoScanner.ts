import * as fs from "node:fs/promises";
import * as path from "node:path";

export interface DiscoveredRepo {
  /** Absolute path to the git repo root */
  path: string;
  /** Display name (folder name) */
  name: string;
  /** Relative path from the workspace root, or "." if the root itself is a repo */
  relativePath: string;
}

/**
 * Scan a directory for nested git repositories.
 * Looks for directories containing a `.git` folder or `.git` file.
 * Scans up to 2 levels deep to avoid excessive filesystem access.
 */
export async function discoverGitRepos(
  rootDir: string,
  maxDepth = 2,
): Promise<DiscoveredRepo[]> {
  const repos: DiscoveredRepo[] = [];

  async function isGitRepo(dir: string): Promise<boolean> {
    try {
      const gitPath = path.join(dir, ".git");
      const stat = await fs.stat(gitPath);
      return stat.isDirectory() || stat.isFile();
    } catch {
      return false;
    }
  }

  async function scanDir(dir: string, depth: number, relativeBase: string) {
    if (depth > maxDepth) return;

    let entries: string[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: false });
    } catch {
      return;
    }

    // Check each subdirectory
    for (const entry of entries) {
      // Skip common non-project directories
      if (
        entry.startsWith(".") ||
        entry === "node_modules" ||
        entry === "dist" ||
        entry === "build" ||
        entry === "out" ||
        entry === "target" ||
        entry === "__pycache__" ||
        entry === "vendor"
      ) {
        // Don't skip .git itself, but skip .idea, .vscode etc
        if (entry !== ".git") continue;
        else continue; // .git is not a subdirectory to scan
      }

      const fullPath = path.join(dir, entry);
      const relativePath = relativeBase ? `${relativeBase}/${entry}` : entry;

      try {
        const stat = await fs.stat(fullPath);
        if (!stat.isDirectory()) continue;

        if (await isGitRepo(fullPath)) {
          repos.push({
            path: fullPath,
            name: entry,
            relativePath,
          });
          // Don't scan deeper inside a git repo (avoid discovering submodules)
        } else {
          // Scan deeper
          await scanDir(fullPath, depth + 1, relativePath);
        }
      } catch {
        // Skip inaccessible directories
      }
    }
  }

  // First check if root itself is a git repo
  if (await isGitRepo(rootDir)) {
    repos.push({
      path: rootDir,
      name: path.basename(rootDir),
      relativePath: ".",
    });
  }

  // Scan subdirectories
  await scanDir(rootDir, 1, "");

  return repos;
}
