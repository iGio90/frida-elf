import {Elf} from 'frida-elf';


const target = Module.findExportByName('libc.so', 'open');

if (target) {
    const elf = Elf.parse(target);
    console.log(JSON.stringify(elf, null, 4));
}
