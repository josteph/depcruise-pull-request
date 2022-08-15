import * as core from '@actions/core';
import path from 'path';
import fs from 'fs';

import commentToPR from './comment';
import { execSync } from 'child_process';

const MARKDOWN_REPORT_FILENAME = 'depcruise-report.md';

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
  execSync(
    `npx dependency-cruiser --config ${depcruiseOptionsPath} -T markdown -f ${MARKDOWN_REPORT_FILENAME} ${depcruiseBaseDir}`,
    {
      stdio: 'inherit',
    },
  );

  const output = fs.readFileSync(MARKDOWN_REPORT_FILENAME);

  commentToPR(output.toString());

  // Determine job status
  if (shouldReportStatusCheck) {
    execSync(`npx dependency-cruiser --config ${depcruiseOptionsPath} ${depcruiseBaseDir}`, {
      stdio: 'inherit',
    });
  }
}

main();
