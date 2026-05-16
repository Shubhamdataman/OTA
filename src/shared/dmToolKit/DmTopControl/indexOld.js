import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MoreIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import { Box, CardHeader, Menu, MenuItem, Typography } from '@mui/material';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import SearchIcon from '@mui/icons-material/Search';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import RefreshIcon from '@mui/icons-material/Refresh';
import { HotKeys } from 'react-hotkeys';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LastPageIcon from '@mui/icons-material/LastPage';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// import "./DmReactTheme.css";

const DmTopControl121 = ({
  formName,
  permission,
  isSearch,
  setIsEditable,
  setDeleteClicked,
  setIsSearch,
  setPrintClicked,
  setIsSaved,
  setIsCancel,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [toggle, setToggle] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handlers for menu toggle
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const baseOptions = [
    { id: 1, code: 'A', name: 'Add', icon: <AddIcon fontSize="small" /> },
    { id: 2, code: 'E', name: 'Edit', icon: <EditNoteIcon fontSize="small" /> },
    { id: 3, code: 'D', name: 'Delete', icon: <DeleteIcon fontSize="small" /> },
    { id: 4, code: 'P', name: 'Print', icon: <PrintIcon fontSize="small" /> },
    // { id: 6, name: 'Search', icon: <SearchIcon fontSize="small"/> },
    // { id: 7, name: 'Other', icon: <ShareIcon fontSize="small"/> },
    // { id: 8, name: 'Refresh', icon: <RefreshIcon fontSize="small"/> },
  ];
  useEffect(() => {
    if (permission) {
      setFilteredOptions(
        baseOptions.filter((item) => permission.includes(item.code))
      );
    }
  }, [permission, isSearch]); // Updated dependency list to include isSearch

  // useEffect(() => {
  //   console.log(permission);
  //   if (permission) {
  //     let arr = options.filter((item1) =>
  //       permission.some((item2) => item2 === item1?.code)
  //     );
  //     setNewOptions(arr);
  //   }
  // }, [permission]);

  const keyMap = {
    Add: 'F2',
    Edit: 'Ctrl + E',
    Delete: 'Ctrl + D',
    Card: 'Ctrl + T',
    Find: 'Ctrl + F',
    Other: 'Ctrl + O',
    Close: 'Escape',
    Save: 'Ctrl + S',
    Print: 'Ctrl + P',
    Refresh: 'Escape',
  };

  // const handleItem = (v, i) => {
  //   if (v?.name === 'Add') setIsEditable(true);
  //   if (v?.name === 'Edit') setIsEditable(true);
  //   if (v?.name === 'Delete') setDeleteClicked(true);
  //   if (v?.name === 'Print') setPrintClicked(true);
  //   if (v?.name === 'Search') setIsSearch(true);
  //   if (v?.name === 'Other') setOtherClicked(true);
  //   // if (v?.name === 'Card') {
  //   //   setCardClicked(true);
  //   //   setCurrentIndex(0);
  //   //   setToggle(!toggle);
  //   // }
  //   if (v?.name === 'Refresh') setRefreshClicked(true);
  //   if (v === 'Save') setIsSaved(true);
  //   if (v === 'Close') setIsCancel(true);
  //   // if (v === 'first') {
  //   //   setFirstNavigateClicked(true);
  //   //   setCurrentIndex((prev) => {
  //   //     return 0;
  //   //   });
  //   // }
  //   // if (v === 'previous') {
  //   //   setPreviousNavigateClicked(true);
  //   //   setCurrentIndex((prev) => {
  //   //     if (prev !== 0) return prev - 1;
  //   //     else return 0;
  //   //   });
  //   // }
  //   // if (v === 'next') {
  //   //   setNextNavigateClicked(true);
  //   //   setCurrentIndex((prev) => {
  //   //     if (prev !== items.length - 1) return prev + 1;
  //   //     else return items.length - 1;
  //   //   });
  //   // }
  //   // if (v === 'last') {
  //   //   setLastNavigateClicked(true);
  //   //   setCurrentIndex((prev) => {
  //   //     return items.length - 1;
  //   //   });
  //   // }

  //   handleClose();
  // };

  const handleAction = (action) => {
    switch (action) {
      case 'Add':
        setIsEditable(true);
        break;
      case 'Edit':
        setIsEditable(true);
        break;
      case 'Delete':
        setDeleteClicked(true);
        break;
      case 'Print':
        setPrintClicked(true);
        break;
      case 'Search':
        setIsSearch(true);
        break;
      case 'Save':
        setIsSaved(true);
        break;
      case 'Close':
        setIsCancel(true);
        break;
      default:
        break;
    }
    handleMenuClose();
  };

  const handlers = { Add: () => setIsEditable(true) };

  return (
    // <HotKeys keyMap={keyMap} handlers={handlers}>
    <Box variant="gradient" borderRadius="lg" coloredShadow="info" mb={2}>
      <AppBar position="static" sx={{ bgcolor: '#202936' }}>
        <Toolbar variant="dense">
          <Typography fontWeight="bold" sx={{ flexGrow: 1 }}>
            {formName}
          </Typography>
          {/* Buttons aligned right */}
          <Box ml="auto" display="flex" alignItems="center">
            {/* {selectedUser ?  */}
            <IconButton onClick={() => handleAction('Search')}>
              <SearchIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
            {/*   : ""} */}
            <IconButton onClick={() => handleAction('Save')}>
              <SaveIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>

            <IconButton onClick={() => handleAction('Close')}>
              <CloseIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>

            <IconButton
              edge="end"
              id="basic-button"
              aria-permission={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              <MoreIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
          </Box>

          {/* Dropdown menu */}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
            sx={{ ml: -10, mt: 1 }}
          >
            {filteredOptions.map((v, i) => (
              <MenuItem key={v.id} onClick={() => handleAction(v, i)}>
                {v?.icon} &nbsp; {v?.name}
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default DmTopControl121;
