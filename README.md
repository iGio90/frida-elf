# Frida Elf

A frida module to parse Elf headers in runtime

## install

```$xslt
git clone https://github.com/iGio90/frida-elf.git
npm install
npm link
```

### try it out
```$xslt
cd example
npm link frida-elf
npm install
npm run watch

# make your edits to index.ts
# inject the agent (quick att.py)
```

example code
```typescript
import {Elf} from 'frida-elf';


const target = Module.findExportByName('libc.so', 'open');

if (target) {
    const elf = Elf.parse(target);
    console.log(JSON.stringify(elf, null, 4));
}
```

example output
```json
{
    "header": {
        "e_ident": [
            127,
            69,
            76,
            70,
            2,
            1,
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0
        ],
        "e_type": 3,
        "e_machine": 183,
        "e_version": 1,
        "e_entry": 0,
        "e_phoff": 64,
        "e_shoff": 1125048,
        "e_flags": 0,
        "e_ehsize": 64,
        "e_phentsize": 56,
        "e_phnum": 8,
        "e_shentsize": 64,
        "e_shnum": 30,
        "e_shstrndx": 27
    },
    "sectionHeaders": [
        {
            "data": [],
            "name": "",
            "sh_name": 0,
            "sh_type": 0,
            "sh_flags": 0,
            "sh_addr": 0,
            "sh_offset": 0,
            "sh_size": 0,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 0,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".note.android.ident",
            "sh_name": 27,
            "sh_type": 7,
            "sh_flags": 2,
            "sh_addr": 512,
            "sh_offset": 512,
            "sh_size": 24,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 4,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".note.gnu.build-id",
            "sh_name": 47,
            "sh_type": 7,
            "sh_flags": 2,
            "sh_addr": 536,
            "sh_offset": 536,
            "sh_size": 32,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 4,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".dynsym",
            "sh_name": 66,
            "sh_type": 11,
            "sh_flags": 2,
            "sh_addr": 568,
            "sh_offset": 568,
            "sh_size": 32664,
            "sh_link": 4,
            "sh_info": 1,
            "sh_addralign": 8,
            "sh_entsize": 24
        },
        {
            "data": [],
            "name": ".dynstr",
            "sh_name": 74,
            "sh_type": 3,
            "sh_flags": 2,
            "sh_addr": 33232,
            "sh_offset": 33232,
            "sh_size": 15878,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 1,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".gnu.hash",
            "sh_name": 82,
            "sh_type": 1879048182,
            "sh_flags": 2,
            "sh_addr": 49112,
            "sh_offset": 49112,
            "sh_size": 10576,
            "sh_link": 3,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".gnu.version",
            "sh_name": 92,
            "sh_type": 1879048191,
            "sh_flags": 2,
            "sh_addr": 59688,
            "sh_offset": 59688,
            "sh_size": 2722,
            "sh_link": 3,
            "sh_info": 0,
            "sh_addralign": 2,
            "sh_entsize": 2
        },
        {
            "data": [],
            "name": ".gnu.version_d",
            "sh_name": 105,
            "sh_type": 1879048189,
            "sh_flags": 2,
            "sh_addr": 62412,
            "sh_offset": 62412,
            "sh_size": 264,
            "sh_link": 4,
            "sh_info": 8,
            "sh_addralign": 4,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".gnu.version_r",
            "sh_name": 120,
            "sh_type": 1879048190,
            "sh_flags": 2,
            "sh_addr": 62676,
            "sh_offset": 62676,
            "sh_size": 48,
            "sh_link": 4,
            "sh_info": 1,
            "sh_addralign": 4,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".rela.dyn",
            "sh_name": 135,
            "sh_type": 4,
            "sh_flags": 2,
            "sh_addr": 62728,
            "sh_offset": 62728,
            "sh_size": 33768,
            "sh_link": 3,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 24
        },
        {
            "data": [],
            "name": ".rela.plt",
            "sh_name": 145,
            "sh_type": 4,
            "sh_flags": 66,
            "sh_addr": 96496,
            "sh_offset": 96496,
            "sh_size": 11640,
            "sh_link": 3,
            "sh_info": 21,
            "sh_addralign": 8,
            "sh_entsize": 24
        },
        {
            "data": [],
            "name": ".plt",
            "sh_name": 150,
            "sh_type": 1,
            "sh_flags": 6,
            "sh_addr": 108136,
            "sh_offset": 108136,
            "sh_size": 7792,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 16
        },
        {
            "data": [],
            "name": ".text",
            "sh_name": 155,
            "sh_type": 1,
            "sh_flags": 6,
            "sh_addr": 115968,
            "sh_offset": 115968,
            "sh_size": 606084,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 64,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".rodata",
            "sh_name": 161,
            "sh_type": 1,
            "sh_flags": 2,
            "sh_addr": 722112,
            "sh_offset": 722112,
            "sh_size": 63338,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 64,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".eh_frame",
            "sh_name": 169,
            "sh_type": 1,
            "sh_flags": 2,
            "sh_addr": 785456,
            "sh_offset": 785456,
            "sh_size": 69016,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".eh_frame_hdr",
            "sh_name": 179,
            "sh_type": 1,
            "sh_flags": 2,
            "sh_addr": 854472,
            "sh_offset": 854472,
            "sh_size": 16828,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 4,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".fini_array",
            "sh_name": 193,
            "sh_type": 15,
            "sh_flags": 3,
            "sh_addr": 958656,
            "sh_offset": 893120,
            "sh_size": 8,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 8
        },
        {
            "data": [],
            "name": ".data.rel.ro",
            "sh_name": 205,
            "sh_type": 1,
            "sh_flags": 3,
            "sh_addr": 958688,
            "sh_offset": 893152,
            "sh_size": 19064,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 32,
            "sh_entsize": 0
        },
        {
            "data": [
                718832,
                116008,
                292120,
                670200
            ],
            "name": ".init_array",
            "sh_name": 218,
            "sh_type": 14,
            "sh_flags": 3,
            "sh_addr": 977752,
            "sh_offset": 912216,
            "sh_size": 32,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 8
        },
        {
            "data": [],
            "name": ".dynamic",
            "sh_name": 230,
            "sh_type": 6,
            "sh_flags": 3,
            "sh_addr": 977784,
            "sh_offset": 912248,
            "sh_size": 528,
            "sh_link": 4,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 16
        },
        {
            "data": [],
            "name": ".got",
            "sh_name": 239,
            "sh_type": 1,
            "sh_flags": 3,
            "sh_addr": 978312,
            "sh_offset": 912776,
            "sh_size": 800,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".got.plt",
            "sh_name": 244,
            "sh_type": 1,
            "sh_flags": 3,
            "sh_addr": 979112,
            "sh_offset": 913576,
            "sh_size": 3904,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 8,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".data",
            "sh_name": 253,
            "sh_type": 1,
            "sh_flags": 3,
            "sh_addr": 983040,
            "sh_offset": 917504,
            "sh_size": 6096,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 32,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".bss",
            "sh_name": 259,
            "sh_type": 8,
            "sh_flags": 3,
            "sh_addr": 991232,
            "sh_offset": 923600,
            "sh_size": 39472,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 4096,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".comment",
            "sh_name": 264,
            "sh_type": 1,
            "sh_flags": 48,
            "sh_addr": 0,
            "sh_offset": 923600,
            "sh_size": 303,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 1,
            "sh_entsize": 1
        },
        {
            "data": [],
            "name": ".note.gnu.gold-version",
            "sh_name": 273,
            "sh_type": 7,
            "sh_flags": 0,
            "sh_addr": 0,
            "sh_offset": 923904,
            "sh_size": 28,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 4,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".gnu_debuglink",
            "sh_name": 296,
            "sh_type": 1,
            "sh_flags": 0,
            "sh_addr": 0,
            "sh_offset": 923932,
            "sh_size": 12,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 1,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".shstrtab",
            "sh_name": 17,
            "sh_type": 3,
            "sh_flags": 0,
            "sh_addr": 0,
            "sh_offset": 1124731,
            "sh_size": 311,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 1,
            "sh_entsize": 0
        },
        {
            "data": [],
            "name": ".symtab",
            "sh_name": 1,
            "sh_type": 2,
            "sh_flags": 0,
            "sh_addr": 0,
            "sh_offset": 923944,
            "sh_size": 152400,
            "sh_link": 29,
            "sh_info": 4990,
            "sh_addralign": 8,
            "sh_entsize": 24
        },
        {
            "data": [],
            "name": ".strtab",
            "sh_name": 9,
            "sh_type": 3,
            "sh_flags": 0,
            "sh_addr": 0,
            "sh_offset": 1076344,
            "sh_size": 48387,
            "sh_link": 0,
            "sh_info": 0,
            "sh_addralign": 1,
            "sh_entsize": 0
        }
    ],
    "programHeaders": [
        {
            "p_type": 6,
            "p_flags": 4,
            "p_offset": 64,
            "p_vaddr": 64,
            "p_paddr": 64,
            "p_filesz": 448,
            "p_memsz": 448,
            "p_align": 8
        },
        {
            "p_type": 1,
            "p_flags": 5,
            "p_offset": 0,
            "p_vaddr": 0,
            "p_paddr": 0,
            "p_filesz": 871300,
            "p_memsz": 871300,
            "p_align": 65536
        },
        {
            "p_type": 1,
            "p_flags": 6,
            "p_offset": 893120,
            "p_vaddr": 958656,
            "p_paddr": 958656,
            "p_filesz": 30480,
            "p_memsz": 72048,
            "p_align": 65536
        },
        {
            "p_type": 2,
            "p_flags": 6,
            "p_offset": 912248,
            "p_vaddr": 977784,
            "p_paddr": 977784,
            "p_filesz": 528,
            "p_memsz": 528,
            "p_align": 8
        },
        {
            "p_type": 4,
            "p_flags": 4,
            "p_offset": 512,
            "p_vaddr": 512,
            "p_paddr": 512,
            "p_filesz": 56,
            "p_memsz": 56,
            "p_align": 4
        },
        {
            "p_type": 1685382480,
            "p_flags": 4,
            "p_offset": 854472,
            "p_vaddr": 854472,
            "p_paddr": 854472,
            "p_filesz": 16828,
            "p_memsz": 16828,
            "p_align": 4
        },
        {
            "p_type": 1685382481,
            "p_flags": 6,
            "p_offset": 0,
            "p_vaddr": 0,
            "p_paddr": 0,
            "p_filesz": 0,
            "p_memsz": 0,
            "p_align": 16
        },
        {
            "p_type": 1685382482,
            "p_flags": 6,
            "p_offset": 893120,
            "p_vaddr": 958656,
            "p_paddr": 958656,
            "p_filesz": 24384,
            "p_memsz": 24384,
            "p_align": 32
        }
    ],
    "is64bit": true,
    "endian": "little"
}
```

```
Copyright (c) 2019 Giovanni (iGio90) Rocca

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```