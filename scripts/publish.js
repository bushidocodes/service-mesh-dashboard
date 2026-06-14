import { promisify } from "util";
import { exec as execCallback } from "child_process";
import commander from "commander";
import prompt from "prompt";

const exec = promisify(execCallback);
const program = commander;
prompt.start();
const promptGet = promisify(prompt.get);

function execWrapper(...args) {
  if (dryRun) {
    console.log(...args);
    return { stdout: "", stderr: "" };
  } else {
    return exec(...args);
  }
}

function _generateSemVerStrings(major, minor, patch, releaseCandidate = null) {
  // If there is a releaseCandidate value, don't tag with the major and
  // major.minor tags
  return releaseCandidate
    ? [`${major}.${minor}.${patch}-rc${releaseCandidate}`]
    : [`${major}`, `${major}.${minor}`, `${major}.${minor}.${patch}`];
}

/**
 * Helper function that takes a yes/no question and terminates
 * the Node.js process if the reponse isn't 'y' or 'yes'. It
 * also provides an alreadyConfirmed escape hatch to immediately
 * confirm the prompt (if running in a CI type environment)
 *
 * @param {string} description
 * @param {boolean} [alreadyConfirmed=false]
 * @returns
 */
async function _confirm(question, alreadyConfirmed = false) {
  if (alreadyConfirmed) return;
  const { confirm: initialConfirm } = await promptGet({
    properties: {
      confirm: {
        // allow yes, no, y, n, YES, NO, Y, N as answer
        pattern: /^(yes|no|y|n)$/gi,
        description: question,
        message: "Type yes/no",
        required: true,
        default: "no"
      }
    }
  });
  if (
    initialConfirm.toLowerCase() !== "y" &&
    initialConfirm.toLowerCase() !== "yes"
  ) {
    process.exit();
  }
}

/**
 * async function that confirms that the local branch is master, that it is up to date with
 * origin/master, and that it doesn't have any uncommitted local changes. This was developed
 * against the output from git version 2.13.6 (Apple Git-96), so this might erroneously fail
 * on other platforms
 */
async function validateReadyToPublish() {
  try {
    await execWrapper(`git fetch`);
    let { stdout: gitStatus } = await execWrapper(`git status`);
    let [, branchName] = gitStatus.match(/On branch ([\w-./]+)/);
    const isUpToDate =
      gitStatus.search(/Your branch is up-to-date with 'origin\/master'./) > -1;
    const isClean =
      gitStatus.search(/nothing to commit, working tree clean/) > -1;
    if (branchName !== "master") {
      console.log(
        `Current Branch is ${branchName}. You must publish from master`
      );
      process.exit();
    } else if (!isUpToDate) {
      console.log("local is not up to date with origin/master");
      process.exit();
    } else if (!isClean) {
      console.log("Uncommitted local changes detected.");
      process.exit();
    }
  } catch (err) {
    console.log(`Failed with:\n ${err}`);
    process.exit();
  }
}

async function publish({
  confirm = false,
  major = null,
  minor = null,
  patch = null,
  releaseCandidate = null,
  tags = [],
  dryRun = false
}) {
  try {
    if (!dryRun) await validateReadyToPublish();

    // Clean old gm-fabric-dashboard images and dangling images
    // Because rmi errors if docker images doesn't return anything, we check to
    // see if the docker images commands actually return valid IDs first
    let { stdout: dockerImageTags } = await execWrapper(
      `docker images "deciphernow/gm-fabric-dashboard" --format "{{.Repository}}:{{.Tag}}"`
    );
    // Filter out untagged image (deciphernow/gm-fabric-dashboard:<none>) if it exists
    if (dockerImageTags.includes("deciphernow/gm-fabric-dashboard:<none>")) {
      dockerImageTags = dockerImageTags.replace(
        "deciphernow/gm-fabric-dashboard:<none>",
        ""
      );
    }
    if (dockerImageTags.length > 0) {
      await execWrapper(
        `docker rmi --force $(docker images "deciphernow/gm-fabric-dashboard" --format "{{.Repository}}:{{.Tag}}")`
      );
    }
    // Remove untagged image (deciphernow/gm-fabric-dashboard:<none>) if it exists
    const { stdout: dockerImages } = await execWrapper(
      `docker images "deciphernow/gm-fabric-dashboard" --format "{{.ID}}"`
    );
    if (dockerImages.length > 0) {
      await execWrapper(
        `docker rmi --force $(docker images "deciphernow/gm-fabric-dashboard" --format "{{.ID}}")`
      );
    }
    // Remove dangling images if they exists
    const { stdout: danglingImages } = await execWrapper(
      `docker images --filter "dangling=true" --format "{{.ID}}"`
    );
    if (danglingImages.length > 0) {
      await execWrapper(
        `docker rmi --force $(docker images --filter "dangling=true" --format "{{.ID}}")`
      );
    }
    // Attempt to pull latest from deciphernow. This will error out if the user
    // running this script isn't logged into DockerHub or isn't actually
    // a member of the DecipherNow organization
    await execWrapper("docker pull deciphernow/gm-fabric-dashboard");
    console.log(`Login Validated`);
    console.log("It looks like you want to push up the following tags:");
    console.log("deciphernow/gm-fabric-dashboard:latest");
    let releaseTags = [];
    // Because these parameters are integers, one of them might be 0, so we can't
    // just use truthy / falsy. Instead these values are explicitly set to null by
    // default so we can explictly check that these values aren't null
    if (major !== null && minor !== null && patch !== null) {
      releaseTags = [
        ..._generateSemVerStrings(major, minor, patch, releaseCandidate),
        ...tags
      ].map((tag) => `deciphernow/gm-fabric-dashboard:${tag}`);
    } else if (process.env.npm_package_version) {
      console.log(
        `Detected the following version from npm package.json: ${
          process.env.npm_package_version
        }`
      );
      releaseTags = [
        ..._generateSemVerStrings(
          ...process.env.npm_package_version.split(/\.|-rc/g),
          releaseCandidate
        ),
        ...tags
      ].map((tag) => `deciphernow/gm-fabric-dashboard:${tag}`);
    } else {
      releaseTags = tags.map((tag) => `deciphernow/gm-fabric-dashboard:${tag}`);
    }
    releaseTags.forEach((tag) => console.log(tag));
    await _confirm("Is that correct?", confirm);
    console.log(`Building the project`);
    let build = await execWrapper("npm run build");
    console.log(build.stdout);
    if (!dryRun && !build.stdout.includes("Compiled successfully")) {
      throw new Error(`npm build failed with ${build.stderr}`);
    }
    console.log("Project build successfully");
    console.log("Building the Docker Image");
    let buildDocker = await execWrapper("npm run build-docker");
    console.log(buildDocker.stdout);
    console.log(buildDocker.stderr);
    console.log("Built the Docker image successfully");
    // Getting the Image ID of lastest
    let { stdout: imageIDWithEscapeChars } = await execWrapper(
      "docker images deciphernow/gm-fabric-dashboard:latest --format '{{.ID}}'"
    );
    const imageID = dryRun
      ? "b23b9f1b579d"
      : imageIDWithEscapeChars.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

    if (releaseTags.length > 0) {
      console.log("Tagging Docker image");
      releaseTags.forEach(
        async (releaseTag) =>
          await execWrapper(`docker tag ${imageID} ${releaseTag}`)
      );
    }
    // Confirming that tagging worked as expected
    const { stdout: imageDetailsRaw } = await execWrapper(
      `docker image inspect ${imageID}`
    );
    const actualTags = dryRun
      ? [...releaseTags, "deciphernow/gm-fabric-dashboard:latest"]
      : JSON.parse(imageDetailsRaw)[0]["RepoTags"];
    console.log(`${imageID} has been tagged with:`);
    actualTags.forEach((tag) => console.log(`${tag}`));
    // Add a final confirmation here unless --confirm was passed in
    await _confirm("Are you sure that you want to push to DockerHub?", confirm);
    console.log("Pushing to Docker Hub");
    await execWrapper(`docker push deciphernow/gm-fabric-dashboard`);
    console.log("Pushed to Docker Hub Successfully");
  } catch (err) {
    console.log(`Failed with:\n ${err}`);
  }
}

/**
 * Utility function to build out a collection of values
 * @param {any} val
 * @param {Object} memo
 * @returns
 */
function collect(val, memo = []) {
  memo.push(val);
  return memo;
}

// Capture CLI options and pass them into the publish utility function
const { major, minor, patch, releaseCandidate, tag, dryRun, confirm } = program
  .option(
    "-d, --dryRun",
    "Dry run of command, outputting docker commands to be used"
  )
  .option(
    "--confirm",
    "Accept all confirmation dialogs. This should only be used in automation"
  )
  .option("-m, --major [value]", "SemVer Major Version", parseInt)
  .option("-n, --minor [value]", "SemVer Minor Version", parseInt)
  .option("-p, --patch [value]", "SemVer Patch Version", parseInt)
  .option("-r, --releaseCandidate [value]", "SemVer Patch Version", parseInt)
  .option(
    "-t, --tag [value]",
    "One or more additional Release Tags",
    collect,
    []
  )
  .parse(process.argv);

publish({
  major,
  minor,
  patch,
  releaseCandidate,
  tags: tag,
  dryRun,
  confirm
});
