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
              accept="application/zip"
              required 
              style={{ display: "none" }} 
            /> as unknown as HTMLInputElement;
  const inputNode = input as unknown as ReactNode;
  const submit = (_: unknown) => onSubmit((input.files as FileList)[0], (name as unknown as { htmlInput: HTMLInputElement }).htmlInput.name);

  return [<>
      <Dialog open={open} onClose={close}>
        <DialogTitle>New VM</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <form onSubmit={submit}>
            {name}
            {inputNode}
            <Card variant="outlined" onClick={input.click}>
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