import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@mui/material';

const DmConfirmationModal = ({
  state = 'close',
  openCloseModal,
  handleCloseModal,
}) => {

  return (
    <Dialog
      className="dmDialogContainerBackdrop"
      open={openCloseModal}
      // onClose={handleCloseModal}
      PaperProps={{
        className: 'dmDialogContainer',
        sx: {
          boxShadow: 24, // Enhanced shadow for better depth
        },
      }}
      // sx={{
      //   backdropFilter: 'blur(5px)', // Apply backdrop blur effect
      //   backgroundColor: 'rgba(0, 0, 0, 0.2)', // Dimmed overlay effect
      // }}
    >
      <DialogTitle className="dmDialogTitle">Are you sure? {state}</DialogTitle>

      <Divider className="dmDivider" />
      <DialogActions className="dmDialogActions">
        <Button
          className="dmDialogActionsYessButton"
          onClick={() => handleCloseModal(true)}
          sx={{ color: 'text.primary' }}
        >
          Yes
        </Button>
        <Button
          className="dmDialogActionsNoButton"
          onClick={() => handleCloseModal(false)}
          sx={{ color: 'text.primary' }}
        >
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DmConfirmationModal;
