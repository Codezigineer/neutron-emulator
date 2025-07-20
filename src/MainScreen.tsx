import { MouseEventHandler, useState } from 'react';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Button, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FormDialog from './NewChrootMenu';

function ChrootButton(name: string)
{
    return <Button sx={{ borderRadius: 15 }}>
        {name}
    </Button>;
};

async function runCmd(params: string[])
{
    
};

async function addChroot(file: File, name: string)
{
    const tarballCmd = ["/bin/tar", "-xvzf", `./${name}.tar.gz`];
    const scriptCmd = ["/bin/sh"];

    await Filesystem.mkdir({
        path: `./${name}`,
        directory: Directory.External
    });

    const reader = new FileReader();
    reader.readAsDataURL(file);
    await new Promise((res, _) => reader.addEventListener("loadend", res));

    if(name)
    {
        await Filesystem.writeFile({
            path: `./${name}/script.sh`,
            directory: Directory.External,
            data: (reader.result as string).replace("data:*/*;base64,", "")
        });
        const scriptPath = (await Filesystem.getUri({
            path: `./${name}/script.sh`,
            directory: Directory.External
        })).uri.replace("content://", "");
        var newscript = scriptCmd.map(s => s);
        newscript.push(scriptPath);
        await runCmd(newscript);
        await Filesystem.deleteFile({
            path: `./${name}/script.sh`,
            directory: Directory.External
        });
    } else 
    {
        await Filesystem.writeFile({
            path: `./${name}.tar.gz`,
            directory: Directory.External,
            data: (reader.result as string).replace("data:*/*;base64,", "")
        });
        await Filesystem.rmdir({
            path: `./${name}`,
            directory: Directory.External
        });
        const tarPath = (await Filesystem.getUri({
            path: `./${name}.tar.gz`,
            directory: Directory.External
        })).uri.replace("content://", "");
        var newtar = tarballCmd.map(s => s);
        newtar.push(tarPath);
        await runCmd(newtar);
        await Filesystem.deleteFile({
            path: `./${name}.tar.gz`,
            directory: Directory.External
        });
    };

    location.reload();
};

function MainScreen()
{
    const [ chroots, setChroots ] = useState([""]);
    Filesystem.readdir({ path: "./", directory: Directory.External }).then(ls => setChroots(ls.files.filter(f => f.type === "directory").map(f => f.name)));
    const buttons = chroots.map(ChrootButton);
    const addDialog = FormDialog(addChroot);
    const add = <Fab color="primary" aria-label="add" sx={{ position: "absolute", right: "20pt", bottom: "20pt" }}>
                    <AddIcon />
                </Fab>
    (add as unknown as HTMLButtonElement).addEventListener("click", (..._: any[]) => (addDialog[1]()))

    if(chroots.length === 0) return (
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#acacacff", fontFamily: "Roboto", fontWeight: "lighter", fontSize: "35pt", minHeight: "90vh"}}>
                <div>Welcome To Neutron</div>
            </div>
            {add}
        </>
    );
    
    return (
        <>
            {...buttons}
            {add}
        </>
    );
};

export default MainScreen;