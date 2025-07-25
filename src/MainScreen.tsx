import { useState } from 'react';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Button, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormDialog from './NewChrootMenu';

async function bootVM(name: string)
{
    const prootPath = (await Filesystem.getUri({
        path: `proot`,
        directory: Directory.External
    })).uri.replace("file://", "");

    const vmPath = (await Filesystem.getUri({
        path: `VMS/${name}`,
        directory: Directory.External
    })).uri.replace("file://", "");

    runCmd([prootPath, "-r", vmPath, "/bin/bash", "/boot.sh"]);
};

function ChrootButton(name: string)
{
    function run()
    {
        try {
            bootVM(name);
        } catch(e) 
        {
            alert((e as Error).toString());
        };
    };

    function delet()
    {
        if(confirm("Are you sure you want to delete this VM?"))
        Filesystem.rmdir({
            path: `VMS/${name}`,
            directory: Directory.External,
            recursive: true
        }).then(_ => location.reload());
    };

    return <>
        <Button sx={{ borderRadius: 3, borderWidth: 1, width: "20vw", height: "20vw", color: "#acacac", fontSize: "7vw", alignItems: "inherit", justifyContent: "inherit" }} onClick={run} variant="outlined">
            <Typography sx={{ paddingLeft: "1vw", paddingTop: "1vw" }}>
              {name}
            </Typography>
            <Typography sx={{ position: "absolute", left: "15vw", top: "17vw", zIndex: 30, fontSize: "1vw" }} onClick={delet}>
                Delete
            </Typography>
        </Button>
    </>;
};

async function runCmd(params: string[])
{
    const res = await new Promise<{ exitStatus: number, output: string }>((r, _) => (window as unknown as { baShellExec: { exec: (a: string[], b: (value: { exitStatus: number, output: string }) => void) => void } }).baShellExec.exec(params, r));
    if(res.exitStatus !== 0)
    {
        alert(`Error with command \`${params.join(" ")}\`: \n${res.output}`);
        throw new EvalError(`Error with command \`${params.join(" ")}\`: \n${res.output}`);
    } else return res;
};

async function addChroot(file: File, name: string)
{
    try {
    const tarballCmd = ["/bin/tar", "-xvzf", `./${name}.tar.gz`];
    const scriptCmd = ["/bin/bash"];

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
        })).uri.replace("file://", "");
        var newscript = scriptCmd.map(s => s);
        newscript.push(scriptPath);
        await Filesystem.deleteFile({
            path: `VMS/${name}/script.bash`,
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
        })).uri.replace("file://", "");
        var newtar = tarballCmd.map(s => s);
        newtar.push(tarPath);
        await runCmd(newtar);
        await Filesystem.deleteFile({
            path: `VMS/${name}.tar.gz`,
            directory: Directory.External
        });
    };

    location.reload();
    } catch(e)
    {
        alert((e as Error).toString());
    };
};

function MainScreen()
{
    const [ chroots, setChroots ] = useState([""].slice(0, 0));
    Filesystem.stat({
        path: "VMS",
        directory: Directory.External
    }).catch(_ => Filesystem.mkdir({ path: "VMS", directory: Directory.External })).then(() => Filesystem.readdir({ path: "VMS", directory: Directory.External }).then(ls => setChroots(ls.files.filter(f => f.type === "directory").map(f => f.name)))).catch(r => alert((r as Error).toString()));
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