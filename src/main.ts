import * as core from '@actions/core';
import path from 'path';
import fs from 'fs';

import commentToPR from './comment';
import { execSync } from 'child_process';

function main() {
  const depcruiseOptionsPath = core.getInput('depcruise_config');
  const depcruiseBaseDir = core.getInput('depcruise_base_dir');
  const shouldReportStatusCheck = core.getBooleanInput('status_check');

  if (fs.existsSync(depcruiseOptionsPath)) {
    console.log('Config file found!');
  } else {
    throw Error(
      `Config file not found. If your config file is not in the root of your repo, edit the "depcruise_config" option of this GitHub action.`,
    );
  }

  // Using depcruise.cruise API is unstable
  // Output a markdown file via CLI
  execSync(`npx depcruise --config ${depcruiseOptionsPath} -T markdown -f depcruise-report.md ${depcruiseBaseDir}`, {
    stdio: 'inherit',
  });

  const output = fs.readFileSync(path.resolve(__dirname, 'depcruise-report.md'));

  commentToPR(output.toString());

  // Determine job status
  if (shouldReportStatusCheck) {
    execSync(`npx depcruise --config ${depcruiseOptionsPath} ${depcruiseBaseDir}`, {
      stdio: 'inherit',
    });
  }
}

main();
