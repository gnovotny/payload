#!/usr/bin/env node

const { getArgs } = require('../utils/getArgs');
const { getTemplate } = require('../utils/getTemplate');
const { getProjectName } = require('../utils/getProjectName');
const { createProject } = require('../utils/createProject');
const { welcomeMessage, helpMessage, successMessage } = require('../utils/messages');
const { success } = require('../utils/log');
const { getDatabaseConnection } = require('../utils/getDatabaseConnection');
const { getPayloadSecret } = require('../utils/getPayloadSecret');
const { writeEnvFile } = require('../utils/writeEnvFile');
const { getLanguage } = require('../utils/getLanguage');
const { validateTemplate } = require('../utils/getValidTemplates');

(async () => {
  const args = getArgs();
  if (args['--help'] || args.count === 0) {
    console.log(await helpMessage());
    return 0;
  }
  const templateArg = args['--template']
  if (templateArg) {
    const valid = await validateTemplate(templateArg);
    if (!valid) {
      console.log(await helpMessage());
      process.exit(1);
    }
  }

  console.log(welcomeMessage);

  await getProjectName();
  await getLanguage();
  await getTemplate();
  await getDatabaseConnection();
  await getPayloadSecret();
  if (!args['--dry-run']) {
    await createProject();
    await writeEnvFile();
  }

  success('Payload project successfully created');

  console.log(await successMessage());

})();