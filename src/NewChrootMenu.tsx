import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { ReactElement, ReactNode, useState } from 'react';
import Divider from '@mui/material/Divider';

function FormDialog(onSubmit: (arg0: File, arg1: string) => any): [ReactElement, () => void]
{
  const [open, setOpen] = useState(false);
  const openDialog = () => setOpen(true);
  const close = () => setOpen(false);
  const name = <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              type="text"
              fullWidth
              label="VM Name"
              variant="filled"
            />;
  const input = <input 
              type="file" 
              accept=".tar.gz,.sh"
              className='filepicker'
              required
              style={{ display: "none" }}
            />;
  var onClick = (_: any) => (document.getElementsByClassName("filepicker")[0] as HTMLInputElement).click();
  const inputNode = input as unknown as ReactNode;
  var fileOverride: File | undefined;
  const submit = function(_: unknown)
  {
    if((document.getElementsByClassName("filepicker")[0] as HTMLInputElement).hidden) 
      onSubmit(((document.getElementsByClassName("filepicker")[0] as HTMLInputElement).files as FileList)[0], (document.getElementsByName("name")[0] as HTMLInputElement).value);
    else onSubmit(fileOverride as File, (document.getElementsByName("name")[0] as HTMLInputElement).value);
    (document.getElementsByClassName("filepicker")[0] as HTMLInputElement).hidden = false;
    fileOverride = undefined;
  };

  async function downloadAlpine()
  {
    fileOverride = (await (await fetch("https://raw.githubusercontent.com/Codezigineer/neutron-emulator/refs/heads/main/scripts/alpine.sh")).blob()) as File;
    (document.getElementsByClassName("filepicker")[0] as HTMLInputElement).hidden = true;
  };

  return [<>
      <Dialog open={open} onClose={close}>
        <DialogTitle>New VM</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <form onSubmit={submit}>
            {name}
            {inputNode}
            <Divider />
            <Typography fontSize={"3vw"}>Presets</Typography>
            <Divider />
            <Button onClick={downloadAlpine}>Download Alpine</Button>
            <Divider />
            <Card variant="outlined" onClick={onClick}>
              <CardContent>
                <Typography variant='h4' alignItems="center" justifyContent="center">Add install script/tarball here</Typography>
              </CardContent>
            </Card>
            <DialogActions>
              <Button onClick={close}>Cancel</Button>
              <Button type="submit">Create</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </>, openDialog];
}

export default FormDialog;