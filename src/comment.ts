import * as github from '@actions/github';
import * as core from '@actions/core';

async function commentToPR(message: string) {
  try {
    const context = github.context;
    const prNumberFromInput: string = core.getInput('pr_number');
    const commentIncludes = core.getInput('comment_includes');
    const githubToken: string = core.getInput('GITHUB_TOKEN');

    const octokit = github.getOctokit(githubToken);

    const prNumber = parseInt(prNumberFromInput) || context.payload.pull_request?.number;

    if (!prNumber) {
      core.setFailed('No pull request in input neither in current context.');
      return;
    }

    if (commentIncludes) {
      let comment;
      for await (const { data: comments } of octokit.paginate.iterator(octokit.rest.issues.listComments, {
        ...context.repo,
        issue_number: prNumber,
      })) {
        comment = comments.find((comment) => comment?.body?.includes(commentIncludes));
        if (comment) break;
      }

      if (comment) {
        await octokit.rest.issues.updateComment({
          ...context.repo,
          comment_id: comment.id,
          body: message,
        });
        return;
      } else {
        core.info('No comment has been found with asked pattern. Creating a new comment.');
      }
    }

    await octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: prNumber,
      body: message,
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

export default commentToPR;
