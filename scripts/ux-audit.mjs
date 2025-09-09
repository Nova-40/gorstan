#!/usr/bin/env node

/**
 * UX Audit Script
 * Comprehensive UX audit for demo, routes, and full game experience
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIT_COMMANDS = {
  spellcheck: {
    command: 'npx cspell "src/**/*.{ts,tsx,js,jsx}" "public/**/*.html" --no-progress',
    description: 'Spell check all source files and public HTML',
  },
  'images:scan': {
    command: 'find public/images -name "*.{png,jpg,jpeg,gif,svg}" -exec ls -lh {} \\;',
    description: 'Scan image sizes and optimize large files',
    fallback:
      'Get-ChildItem public\\images -Recurse -Include *.png,*.jpg,*.jpeg,*.gif,*.svg | Select-Object Name,Length',
  },
  'ux:a11y': {
    command: 'npm run test:e2e -- --grep "accessibility"',
    description: 'Run accessibility e2e tests',
  },
  'ux:perf': {
    command: 'npm run build && npm run preview',
    description: 'Build and check performance in preview mode',
    background: true,
  },
};

const LINT_RULES = {
  'demo-isolation': {
    pattern: /localStorage\.getItem\(['"](?!demo_|DEMO_)/g,
    files: ['src/demo/**/*.ts', 'src/demo/**/*.tsx'],
    message: 'Demo mode should use isolated storage keys',
  },
  'save-validation': {
    pattern: /JSON\.parse\([^)]+\)(?!\s*[;}])/g,
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    message: 'JSON.parse should include error handling',
  },
  'error-boundaries': {
    pattern: /<[A-Z][^>]*>\s*{[^}]*}\s*<\/[A-Z][^>]*>/g,
    files: ['src/**/*.tsx'],
    message: 'Complex components should be wrapped in error boundaries',
  },
};

class UXAuditor {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
    };
  }

  async runCommand(key, config) {
    console.log(`\n🔍 ${config.description}...`);

    try {
      let command = config.command;

      // Use Windows fallback if provided and on Windows
      if (config.fallback && process.platform === 'win32') {
        command = config.fallback;
      }

      if (config.background) {
        console.log(`🚀 Starting: ${command}`);
        console.log('   (Run manually to check performance)');
        this.results.warnings.push(`${key}: Manual check required - ${command}`);
        return;
      }

      const output = execSync(command, {
        encoding: 'utf8',
        cwd: process.cwd(),
        stdio: 'pipe',
      });

      console.log(`✅ ${key}: PASSED`);
      this.results.passed.push(key);

      if (output.trim()) {
        console.log(`   Output: ${output.slice(0, 200)}${output.length > 200 ? '...' : ''}`);
      }
    } catch (error) {
      console.log(`❌ ${key}: FAILED`);
      console.log(
        `   Error: ${error.message.slice(0, 200)}${error.message.length > 200 ? '...' : ''}`,
      );
      this.results.failed.push({ key, error: error.message });
    }
  }

  async lintCheck(key, rule) {
    console.log(`\n🔍 Checking ${key}...`);

    let issuesFound = 0;

    for (const filePattern of rule.files) {
      try {
        const files = this.globFiles(filePattern);

        for (const file of files) {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            const matches = content.match(rule.pattern);

            if (matches) {
              issuesFound += matches.length;
              console.log(`   ⚠️  ${file}: ${matches.length} issues`);
            }
          }
        }
      } catch (error) {
        console.log(`   Error checking ${filePattern}: ${error.message}`);
      }
    }

    if (issuesFound === 0) {
      console.log(`✅ ${key}: PASSED`);
      this.results.passed.push(key);
    } else {
      console.log(`⚠️  ${key}: ${issuesFound} issues found`);
      console.log(`   ${rule.message}`);
      this.results.warnings.push(`${key}: ${issuesFound} issues - ${rule.message}`);
    }
  }

  globFiles(pattern) {
    // Simple glob implementation for the patterns we use
    const basePath = pattern.split('*')[0];
    const extension = pattern.split('.').pop();

    if (!fs.existsSync(basePath)) {
      return [];
    }

    const files = [];
    this.walkDir(basePath, files, extension);
    return files;
  }

  walkDir(dir, files, extension) {
    try {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          this.walkDir(fullPath, files, extension);
        } else if (fullPath.endsWith(`.${extension}`)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }

  async runAudit() {
    console.log('🎯 Starting UX Audit...\n');
    console.log('======================================');

    // Run command-based checks
    for (const [key, config] of Object.entries(AUDIT_COMMANDS)) {
      await this.runCommand(key, config);
    }

    console.log('\n📋 Running custom lint checks...');
    console.log('======================================');

    // Run custom lint rules
    for (const [key, rule] of Object.entries(LINT_RULES)) {
      await this.lintCheck(key, rule);
    }

    // Print summary
    console.log('\n📊 Audit Summary');
    console.log('======================================');
    console.log(`✅ Passed: ${this.results.passed.length}`);
    console.log(`❌ Failed: ${this.results.failed.length}`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length}`);

    if (this.results.failed.length > 0) {
      console.log('\n❌ Failed Checks:');
      this.results.failed.forEach((failure) => {
        console.log(`   • ${failure.key}: ${failure.error.slice(0, 100)}...`);
      });
    }

    if (this.results.warnings.length > 0) {
      console.log('\n⚠️  Warnings:');
      this.results.warnings.forEach((warning) => {
        console.log(`   • ${warning}`);
      });
    }

    console.log('\n🎉 UX Audit Complete!');

    // Exit with error code if there are failures
    if (this.results.failed.length > 0) {
      process.exit(1);
    }
  }
}

// Run audit if called directly
if (require.main === module) {
  const auditor = new UXAuditor();
  auditor.runAudit().catch((error) => {
    console.error('Audit failed:', error);
    process.exit(1);
  });
}

export { UXAuditor };
