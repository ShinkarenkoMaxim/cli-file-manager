import { arch } from 'process';
import { cpus, EOL, homedir, userInfo } from 'os';
import { inspect } from 'util';

export const printEOL = () => inspect(EOL);

export const printCpusInfo = () => {
  const cpusInfo = cpus();
  const outputInfo = cpusInfo.map((cpu) => ({
    model: cpu.model,
    clockRate: `${cpu.speed / 1000} GHz`,
  }));

  return {
    overallAmount: cpusInfo.length,
    details: outputInfo,
  };
};

export const printHomedir = () => homedir();

export const printSystemUsername = () => userInfo().username;

export const printArch = () => arch;
