const PT_TYPE_NAME: { [s: number]: string; } = {
    0: "NULL",
    1: "LOAD",
    2: "DYNAMIC",
    3: "INTERP",
    4: "NOTE",
    5: "SHLIB",
    6: "PHDR",
    0x60000000: "LOOS",
    0x6474e550: "PT_GNU_EH_FRAME",
    0x6474e551: "PT_GNU_STACK",
    0x6474e552: "PT_GNU_RELO",
    0x6fffffff: "HIOS",
    0x70000000: "LOPROC",
    0x7fffffff: "HIPROC"
};

const SH_TYPE_NAME: { [s: number]: string; } = {
    0: "NULL",
    1: "PROGBITS",
    2: "SYMTAB",
    3: "STRTAB",
    4: "RELA",
    5: "HASH",
    6: "DYNAMIC",
    7: "NOTE",
    8: "NOBITS",
    9: "REL",
    10: "SHLIB",
    11: "DYNSYM",
    14: "INIT_ARRAY",
    15: "FINI_ARRAY",
    16: "PREINIT_ARRAY",
    17: "GROUP",
    18: "SYMTAB_SHNDX",
    19: "RELR",
    0x60000000: "LOOS",
    0x60000001: "ANDROID_REL",
    0x60000002: "ANDROID_RELA",
    0x6fff4c00: "LLVM_ORDTAB",
    0x6fff4c01: "LLVM_LINKER_OPTIONS",
    0x6fff4c02: "LLVM_CALL_GRAPH_PROFILE",
    0x6fff4c03: "LLVM_ADDRSIG",
    0x6fff4c04: "LLVM_DEPENDENT_LIBRARIES",
    0x6fffff00: "ANDROID_RELR",
    0x6ffffff5: "GNU_ATTRIBUTES",
    0x6fffffff: "GNU_VERSYM",
    0x6ffffff6: "GNU_HASH",
    0x6ffffffd: "GNU_VERDEF",
    0x6ffffffe: "GNU_VERNEED",
    0x70000000: "LOPROC",
    0x7fffffff: "HIPROC",
    0x80000000: "LOUSER",
    0xffffffff: "HIUSER"
};

const fopenImpl = initializeNativeFunction('fopen', 'pointer', ['pointer', 'pointer']);
const fcloseImpl = initializeNativeFunction('fclose', 'int', ['pointer']);
const fseekImpl = initializeNativeFunction('fseek', 'int', ['pointer', 'int', 'int']);
const freadImpl = initializeNativeFunction('fread', 'uint32', ['pointer', 'int', 'int', 'pointer']);

export class Elf {
    header: null | ElfHeader;
    sectionHeaders: ElfSectionHeader[];
    programHeaders: ElFProgamHeader[];
    is64bit: boolean;
    endian: string;

    static parse(target: NativePointer) {
        const module = Process.findModuleByAddress(target);
        if (module) {
            return new Elf(module.path);
        } else {
            console.log('failed to get module for: ' + target);
        }
    }

    private constructor(path: string) {
        this.header = null;
        this.sectionHeaders = [];
        this.programHeaders = [];
        this.is64bit = false;
        this.endian = 'little';

        const _file = fopen(path, 'r');
        if (_file.isNull()) {
            console.log('failed to open file at path: ' + path);
            return;
        }

        const headerBuffer = allocateRw(0x40);
        if (headerBuffer.isNull()) {
            console.log('failed to allocate header buffer');
            fclose(_file);
            return;
        }

        if (fread(headerBuffer, 1, 0x40, _file) !== 0x40) {
            console.log('failed to read from header buffer');
            fclose(_file);
            return;
        }

        this.header = new ElfHeader(headerBuffer);

        if (this.header.e_ident[0] !== 0x7f || this.header.e_ident[1] !== 0x45 ||
            this.header.e_ident[2] !== 0x4c || this.header.e_ident[3] !== 0x46) {
            console.log('the file does not contain a valid elf header');
            fclose(_file);
            return;
        }

        if (this.header.e_ident[6] !== 1) {
            fclose(_file);
            console.log('the file does not contain a valid elf header');
            return;
        }

        if (this.header.e_version !== 1) {
            fclose(_file);
            console.log('the file does not contain a valid elf header');
            return;
        }

        if (this.header.e_ident[4] === 0) {
            fclose(_file);
            console.log('the file does not contain a valid elf header');
            return;
        } else if (this.header.e_ident[4] === 1) {
            this.is64bit = false;
        } else if (this.header.e_ident[4] === 2) {
            this.is64bit = true;
        }

        if (this.header.e_ident[5] === 0) {
            fclose(_file);
            console.log('the file does not contain a valid elf header');
            return;
        } else if (this.header.e_ident[5] === 1) {
            this.endian = 'little';
        } else if (this.header.e_ident[5] === 2) {
            this.endian = 'big';
        }

        // get programHeaders
        const progHeadersBuffer = allocateRw(this.header.e_phnum * this.header.e_phentsize);
        if (progHeadersBuffer.isNull()) {
            console.log('failed to allocate program header buffer');
            fclose(_file);
            return;
        }

        if (fseek(_file, this.header.e_phoff, 0) !== 0) {
            console.log('failed to seek program header buffer');
            fclose(_file);
            return;
        }

        if (fread(progHeadersBuffer, 1, this.header.e_phentsize * this.header.e_phnum, _file) != (this.header.e_phentsize * this.header.e_phnum)) {
            console.log('failed to read from program header buffer');
            fclose(_file);
            return;
        }

        for (let i = 0; i < this.header.e_phnum; i++) {
            this.programHeaders.push(new ElFProgamHeader(progHeadersBuffer.add(this.header.e_phentsize * i), this.is64bit));
        }

        const strTableBuffer = allocateRw(this.header.e_shentsize);
        if (strTableBuffer.isNull()) {
            console.log('failed to allocate string table buffer');
            fclose(_file);
            return;
        }

        if (fseek(_file, this.header.e_shoff + this.header.e_shentsize * this.header.e_shstrndx, 0) !== 0) {
            console.log('failed to seek string table buffer');
            fclose(_file);
            return;
        }
        if (fread(strTableBuffer, 1, this.header.e_shentsize, _file) !== this.header.e_shentsize) {
            console.log('failed to read from string table buffer');
            fclose(_file);
            return;
        }

        let section = new ElfSectionHeader(strTableBuffer, this.is64bit);

        if (fseek(_file, section.sh_offset, 0) !== 0) {
            console.log('failed to seek section header buffer');
            fclose(_file);
            return;
        }

        const strSectionBuffer = allocateRw(section.sh_size);
        if (strSectionBuffer.isNull()) {
            console.log('failed to allocate string section buffer');
            fclose(_file);
            return;
        }

        if (fread(strSectionBuffer, 1, section.sh_size, _file) !== section.sh_size) {
            console.log('failed to read from string section buffer');
            fclose(_file);
            return;
        }

        let string_table = [];
        let pos = 0;
        while (pos < section.sh_size) {
            const str = strSectionBuffer.add(pos).readCString();
            if (str && str.length > 0) {
                string_table[pos] = str;
                pos += str.length + 1;
            } else {
                string_table[pos] = "";
                pos += 1;
            }
        }

        // get sections
        const sectionsBuffer = allocateRw(this.header.e_shentsize * this.header.e_shnum);
        if (sectionsBuffer.isNull()) {
            console.log('failed to allocate sections buffer');
            fclose(_file);
            return;
        }

        if (fseek(_file, this.header.e_shoff, 0) !== 0) {
            console.log('failed to seek sections buffer');
            fclose(_file);
            return;
        }

        if (fread(sectionsBuffer, 1, this.header.e_shentsize * this.header.e_shnum, _file) !== this.header.e_shentsize * this.header.e_shnum) {
            console.log('failed to read from sections buffer');
            fclose(_file);
            return;
        }

        for (let i = 0; i < this.header.e_shnum; i++) {
            section = new ElfSectionHeader(sectionsBuffer.add(this.header.e_shentsize * i), this.is64bit);
            section.name = strSectionBuffer.add(section.sh_name).readCString();

            if (section.name === '.init_array') {
                const initArrayBuffer = allocateRw(section.sh_size);
                if (fseek(_file, section.sh_offset, 0) !== 0) {
                    console.log('failed to seek initialization array buffer');
                    fclose(_file);
                    return;
                }
                if (fread(initArrayBuffer, 1, section.sh_size, _file) !== section.sh_size) {
                    console.log('failed to read from initialization array buffer');
                    fclose(_file);
                    return;
                }
                let size = 4;
                if (this.is64bit) {
                    size += 4;
                }
                for (let a = 0; a < section.sh_size; a += size) {
                    if (this.is64bit) {
                        section.data.push(initArrayBuffer.add(a).readU64().toNumber());
                    } else {
                        section.data.push(initArrayBuffer.add(a).readU32());
                    }
                }
            }

            this.sectionHeaders.push(section);
        }
        fclose(_file);
    }
}

class ElfHeader {
    e_ident: number[];
    e_type: number;
    e_machine: number;
    e_version: number;
    e_entry: number;
    e_phoff: number;
    e_shoff: number;
    e_flags: number;
    e_ehsize: number;
    e_phentsize: number;
    e_phnum: number;
    e_shentsize: number;
    e_shnum: number;
    e_shstrndx: number;

    constructor(buffer: NativePointer) {
        this.e_ident = [];
        for (let i = 0; i < 0x10; i++) {
            this.e_ident.push(buffer.add(i).readU8());
        }

        this.e_type = buffer.add(0x10).readU16();
        this.e_machine = buffer.add(0x12).readU16();
        this.e_version = buffer.add(0x14).readU32();

        let pos = 0;
        if (this.e_ident[4] === 1) { // ELFCLASS32
            this.e_entry = buffer.add(0x18).readU32();
            this.e_phoff = buffer.add(0x1c).readU32();
            this.e_shoff = buffer.add(0x20).readU32();
            pos = 0x24;
        } else if (this.e_ident[4] === 2) { //ELFCLASS64
            this.e_entry = buffer.add(0x18).readU64().toNumber();
            this.e_phoff = buffer.add(0x20).readU64().toNumber();
            this.e_shoff = buffer.add(0x28).readU64().toNumber();
            pos = 0x30;
        } else {
            this.e_entry = 0;
            this.e_phoff = 0;
            this.e_shoff = 0;
        }

        this.e_flags = buffer.add(pos).readU32();
        this.e_ehsize = buffer.add(pos + 0x4).readU16();
        this.e_phentsize = buffer.add(pos + 0x6).readU16();
        this.e_phnum = buffer.add(pos + 0x8).readU16();
        this.e_shentsize = buffer.add(pos + 0xa).readU16();
        this.e_shnum = buffer.add(pos + 0xc).readU16();
        this.e_shstrndx = buffer.add(pos + 0xe).readU16();
    }

    toString() {
        const str = [];
        str.push("e_type: 0x" + this.e_type.toString(16));
        str.push("e_machine: 0x" + this.e_machine.toString(16));
        str.push("e_version: 0x" + this.e_version.toString(16));
        str.push("e_entry: 0x" + this.e_entry.toString(16));
        str.push("e_phoff: 0x" + this.e_phoff.toString(16));
        str.push("e_shoff: 0x" + this.e_shoff.toString(16));
        str.push("e_flags: 0x" + this.e_flags.toString(16));
        str.push("e_ehsize: 0x" + this.e_ehsize.toString(16));
        str.push("e_phentsize: 0x" + this.e_phentsize.toString(16));
        str.push("e_phnum: 0x" + this.e_phnum.toString(16));
        str.push("e_shentsize: 0x" + this.e_shentsize.toString(16));
        str.push("e_shnum: 0x" + this.e_shnum.toString(16));
        str.push("e_shstrndx: 0x" + this.e_shstrndx.toString(16));
        return str.join('\n');
    }
}

class ElFProgamHeader {
    p_type: number;
    p_offset: number;
    p_vaddr: number;
    p_paddr: number;
    p_filesz: number;
    p_memsz: number;
    p_flags: number;
    p_align: number;

    constructor(buffer: NativePointer, is64bit: boolean) {
        this.p_type = buffer.readU32();
        if (!is64bit) {
            this.p_offset = buffer.add(0x4).readU32();
            this.p_vaddr = buffer.add(0x8).readU32();
            this.p_paddr = buffer.add(0xc).readU32();
            this.p_filesz = buffer.add(0x10).readU32();
            this.p_memsz = buffer.add(0x14).readU32();
            this.p_flags = buffer.add(0x18).readU32();
            this.p_align = buffer.add(0x1c).readU32();
        } else {
            this.p_flags = buffer.add(0x4).readU32();
            this.p_offset = buffer.add(0x8).readU64().toNumber();
            this.p_vaddr = buffer.add(0x10).readU64().toNumber();
            this.p_paddr = buffer.add(0x18).readU64().toNumber();
            this.p_filesz = buffer.add(0x20).readU64().toNumber();
            this.p_memsz = buffer.add(0x28).readU64().toNumber();
            this.p_align = buffer.add(0x30).readU64().toNumber();
        }
    }

    toString() {
        const str = [];
        str.push("p_type: 0x" + this.p_type.toString(16) + " - " + PT_TYPE_NAME[this.p_type]);
        str.push("p_offset: 0x" + this.p_offset.toString(16));
        str.push("p_vaddr: 0x" + this.p_vaddr.toString(16));
        str.push("p_paddr: 0x" + this.p_paddr.toString(16));
        str.push("p_filesz: 0x" + this.p_filesz.toString(16));
        str.push("p_memsz: 0x" + this.p_memsz.toString(16));
        str.push("p_flags: 0x" + this.p_flags.toString(16));
        str.push("p_align: 0x" + this.p_align.toString(16));
        return str.join('\n');
    }
}

class ElfSectionHeader {
    name: string | null;
    sh_name: number;
    sh_type: number;
    sh_flags: number;
    sh_addr: number;
    sh_offset: number;
    sh_size: number;
    sh_link: number;
    sh_info: number;
    sh_addralign: number;
    sh_entsize: number;
    data: number[] = [];

    constructor(buffer: NativePointer, is64bit: boolean) {
        this.name = "";
        this.sh_name = buffer.add(0x0).readU32();
        this.sh_type = buffer.add(0x4).readU32();
        if (!is64bit) {
            this.sh_flags = buffer.add(0x8).readU32();
            this.sh_addr = buffer.add(0xc).readU32();
            this.sh_offset = buffer.add(0x10).readU32();
            this.sh_size = buffer.add(0x14).readU32();
            this.sh_link = buffer.add(0x18).readU32();
            this.sh_info = buffer.add(0x1c).readU32();
            this.sh_addralign = buffer.add(0x20).readU32();
            this.sh_entsize = buffer.add(0x24).readU32();
        } else {
            this.sh_flags = buffer.add(0x8).readU64().toNumber();
            this.sh_addr = buffer.add(0x10).readU64().toNumber();
            this.sh_offset = buffer.add(0x18).readU64().toNumber();
            this.sh_size = buffer.add(0x20).readU64().toNumber();
            this.sh_link = buffer.add(0x28).readU32();
            this.sh_info = buffer.add(0x2c).readU32();
            this.sh_addralign = buffer.add(0x30).readU64().toNumber();
            this.sh_entsize = buffer.add(0x38).readU64().toNumber();
        }
    }

    toString() {
        const str = [];
        str.push("sh_name: 0x" + this.sh_name.toString(16) + " - " + this.name);
        str.push("sh_type: 0x" + this.sh_type.toString(16) + " - " + SH_TYPE_NAME[this.sh_type]);
        str.push("sh_flags: 0x" + this.sh_flags.toString(16));
        str.push("sh_addr: 0x" + this.sh_addr.toString(16));
        str.push("sh_offset: 0x" + this.sh_offset.toString(16));
        str.push("sh_size: 0x" + this.sh_size.toString(16));
        str.push("sh_link: 0x" + this.sh_link.toString(16));
        str.push("sh_info: 0x" + this.sh_info.toString(16));
        str.push("sh_addralign: 0x" + this.sh_addralign.toString(16));
        str.push("sh_entsize: 0x" + this.sh_entsize.toString(16));
        return str.join('\n');
    }
}

function allocateRw(size: number) {
    const pt = Memory.alloc(size);
    Memory.protect(pt, size, 'rw-');
    return pt;
}

function fclose(fd: NativePointer) {
    if (fcloseImpl) {
        return fcloseImpl(fd);
    }
    return NULL;
}

function fopen(filePath: string, perm: string): NativePointer {
    const filePathPtr = Memory.allocUtf8String(filePath);
    const p = Memory.allocUtf8String(perm);
    if (fopenImpl) {
        return fopenImpl(filePathPtr, p) as NativePointer;
    }
    return NULL;
}

function fread(pt: NativePointer, size: number, nmemb: number, stream: NativePointer): NativeReturnValue {
    if (freadImpl) {
        return freadImpl(pt, size, nmemb, stream);
    }

    return 0;
}

function fseek(stream: NativePointer, offset: number, whence: number): NativeReturnValue {
    if (fseekImpl) {
        return fseekImpl(stream, offset, whence);
    }
    return 0;
}

function initializeNativeFunction(fname: string, retType: string, argTypes: string[]): NativeFunction | null {
    const p = Module.findExportByName(null, fname);
    if (p !== null) {
        return new NativeFunction(p, retType, argTypes);
    }
    return null;
}
