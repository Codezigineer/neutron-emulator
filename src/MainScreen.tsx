import { useState } from 'react';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormDialog from './NewChrootMenu';

function ChrootButton(name: string)
{
    return <Button sx={{ borderRadius: 15 }} variant="outlined" size="large">
        {name}
    </Button>;
};

async function runCmd(params: string[])
{
    const res = await new Promise<{ exitStatus: number, output: string }>((r, _) => (window as unknown as { ShellExec: { exec: (a: string[], b: (value: { exitStatus: number, output: string }) => void) => void } }).ShellExec.exec(params, r));
    if(res.exitStatus !== 0)
    {
        throw new EvalError(`Error with command \`${params.join(" ")}\`: \n${res.output}`);
    } else return res;
};

async function addChroot(file: File, name: string)
{
    const tarballCmd = ["/bin/tar", "-xvzf", `./${name}.tar.gz`];
    const scriptCmd = ["/bin/sh"];

    await Filesystem.mkdir({
        path: `VMS/${name}`,
        directory: Directory.External
    });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise((res, _) => reader.addEventListener("loadend", res));

    if(name)
    {
        await Filesystem.writeFile({
            path: `VMS/${name}/script.sh`,
            directory: Directory.External,
            data: (reader.result as string).replace("data:*/*;base64,", "")
        });
        const scriptPath = (await Filesystem.getUri({
            path: `VMS/${name}/script.sh`,
            directory: Directory.External
        })).uri.replace("content://", "");
        var newscript = scriptCmd.map(s => s);
        newscript.push(scriptPath);
        await runCmd(newscript);
        await Filesystem.deleteFile({
            path: `VMS/${name}/script.sh`,
            directory: Directory.External
        });
    } else 
    {
        await Filesystem.writeFile({
            path: `VMS/${name}.tar.gz`,
            directory: Directory.External,
            data: (reader.result as string).replace("data:*/*;base64,", "")
        });
        await Filesystem.rmdir({
            path: `VMS/${name}`,
            directory: Directory.External
        });
        const tarPath = (await Filesystem.getUri({
            path: `VMS/${name}.tar.gz`,
            directory: Directory.External
        })).uri.replace("content://", "");
        var newtar = tarballCmd.map(s => s);
        newtar.push(tarPath);
        await runCmd(newtar);
        await Filesystem.deleteFile({
            path: `VMS/${name}.tar.gz`,
            directory: Directory.External
        });
    };

    location.reload();
};

function MainScreen()
{
    Filesystem
    const [ chroots, setChroots ] = useState([""].slice(0, 0));
    Filesystem.stat({
        path: "VMS",
        directory: Directory.External
    }).catch(_ => Filesystem.mkdir({ path: "VMS", directory: Directory.External })).then(() => Filesystem.readdir({ path: "VMS", directory: Directory.External }).then(ls => setChroots(ls.files.filter(f => f.type === "directory").map(f => f.name)))).catch(r => alert(r));
    const buttons = chroots.map(ChrootButton);
    const addDialog = FormDialog(addChroot);
    const add = (<Fab color="primary" aria-label="add" sx={{ position: "absolute", right: "20pt", bottom: "20pt" }} onClick={addDialog[1]}>
                    <AddIcon />
                </Fab>);

    if(chroots.length === 0) return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#acacacff", fontFamily: "Roboto", fontWeight: "lighter", fontSize: "35pt", minHeight: "90vh"}}>
                <div>Welcome To Neutron</div>
            </div>
            {add}
            {addDialog[0]}
        </>
    );
    
    return (
        <>
            {...buttons}
            {add}
            {addDialog[0]}
        </>
    );
};

export default MainScreen;