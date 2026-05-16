import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import DataTable from 'react-data-table-component';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoveToInbox as MoveToInboxIcon,
  CancelPresentation as CancelPresentationIcon,
  Visibility as VisibilityIcon,
  BorderColor as BorderColorIcon,
  LocalDining as LocalDiningIcon,
} from '@mui/icons-material';
import MoreIcon from '@mui/icons-material/More';

// Table styles
const parentTableStyles = {
  tableWrapper: {
    style: {
      height: '320px',
      border: '2px solid #E4DDDD',
      borderRadius: '16px',
    },
  },
  rows: { style: { minHeight: '40px', fontSize: '10px' } },
  expanderCell: { style: { backgroundColor: '#C4D4CF', padding: '0 0px' } },
  headCells: {
    style: {
      minHeight: '40px',
      paddingLeft: '8px',
      paddingRight: '8px',
      fontSize: '10px',
      fontWeight: 600,
      backgroundColor: '#C4D4CF',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
      backgroundColor: '#F6F4F4',
      fontSize: '10px',
    },
  },
};

const childTableStyles = {
  tableWrapper: {
    style: { borderRadius: '16px', border: '2px solid #E3DDDD' },
  },
  rows: { style: { minHeight: '28px', fontSize: 12 } },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
      fontSize: '10px',
      backgroundColor: '#f9f9f9',
    },
  },
  head: { style: { display: 'none' } },
  headCells: { style: { display: 'none' } },
};

// Default expandable row renderer
const DefaultExpandedComponent = ({ data }) => {
  if (!data.componentMdlLst || data.componentMdlLst.length === 0) return null;

  const childColumns = [
    // { name: '#', cell: (_, index) => index + 1, width: '40px' },
    //  {
    //   field: '',
    //   name: '',
    // },
    {
      field: 'menuItemName',
      name: 'Menu Item',
      cell: (row) => row.menuItemName || '-',
      flex: 1,
    },
    {
      field: 'hsnNo',
      name: 'HSN',
      flex: 1,
      cell: (row) => row.hsnNo || '-',
    },
    {
      name: 'Pack Size',
      cell: (row) => row.packSize?.packSizeName || row.packSizeName || '',
    },
    {
      name: 'Add-ons',
      cell: (row) => (
        <Tooltip
          title={
            row.addOns?.map((a) => a.itemName || a.name).join(', ') ||
            'No add-ons'
          }
        >
          <IconButton
            size="small"
            onClick={() => handleViewAddOns(row)}
            disabled={!row.addOns || row.addOns.length === 0}
          >
            <Badge
              badgeContent={row.addOns?.length || 0}
              color="primary"
              sx={{ minWidth: '10px', height: '10px', fontSize: '0.4rem' }}
            >
              <LocalDiningIcon
                fontSize="small"
                sx={{ width: '0.8em', height: '0.8em' }}
              />
            </Badge>
          </IconButton>
        </Tooltip>
      ),
    },
    {
      field: 'packCount',
      name: 'Pack Count',
       cell: (row) => row.packCount || '-',
       flex: 1
    },
    {
      field: 'quantity',
      name: 'Qty',
       cell: (row) => row.quantity || '-',
       flex: 1
    },
    {
      field: 'rate',
      name: 'Rate',
       cell: (row) => row.rate || '-',
       flex: 1
    },
    {
      name: 'Discount',
      selector: (row) =>
        row.totalDiscount !== undefined && row.totalDiscount !== null
          ? Number(row.totalDiscount).toFixed(2)
          : '-',
    },
    {
      name: 'Amount',
      field: 'subTotal',
      cell: (row) =>
        row.subTotal !== undefined && row.subTotal !== null
          ? Number(row.subTotal).toFixed(2)
          : '-',
    },
  ];

  return (
    <Box sx={{ width: 'calc(100% - 168px)', ml: '168px' }}>
      <DataTable
        data={data.componentMdlLst}
        columns={childColumns}
        noHeader
        dense
        highlightOnHover
        customStyles={childTableStyles}
      />
    </Box>
  );
};

// Default action menu cell
const DefaultActionMenuCell = ({
  row,
  onEdit,
  onDelete,
  onToggleBoxStatus,
  onView,
  onEditOrder,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={handleClick}>
          <MoreIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiMenuItem-root': {
            minHeight: '32px',
            fontSize: '0.75rem',
            py: 0.5,
            px: 1.5,
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1rem',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            onEdit?.(row);
          }}
          disabled={!!row.parentId}
        >
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onDelete?.(row.id);
          }}
          disabled={!!row.parentId}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
        {/* <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            if (row.itemType === 'mix') {
              onToggleBoxStatus?.(row);
            }
            handleClose();
          }}
        >
          {row.isMixPackOpen ? (
            <MoveToInboxIcon fontSize="small" sx={{ mr: 1, color: 'green' }} />
          ) : (
            <CancelPresentationIcon
              fontSize="small"
              sx={{ mr: 1, color: 'red' }}
            />
          )}
          Toggle Box
        </MenuItem> */}

        <MenuItem
          onClick={() => {
            handleClose();
            onView?.(row);
          }}
          disabled={!!row.parentId}
        >
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          View
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onEditOrder?.(row);
          }}
          disabled={!!row.parentId}
        >
          <BorderColorIcon fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
      </Menu>
    </>
  );
};

const DmDataTable = ({
  data = [],
  columns = [],
  onEditItem,
  onDeleteItem,
  onToggleBoxStatus,
  onViewAddOns,
  onEditOrder,
  showIndex = true,
  showActions = true,
  expandableRows = true,
  renderActionMenuCell = DefaultActionMenuCell,
  renderExpandedComponent = DefaultExpandedComponent,
}) => {

  console.log("data-datatable---", data);
  // Add index column if needed
  const indexColumn = showIndex
    ? [
        {
          name: '#',
          selector: (_, index) => index + 1,
          width: '40px',
        },
      ]
    : [];

  // Add actions column if needed
  const actionsColumn = showActions
    ? [
        {
          name: 'Actions',
          cell: (row) =>
            renderActionMenuCell({
              row,
              onEdit: onEditItem,
              onDelete: onDeleteItem,
              onView: onViewAddOns,
              onEditOrder,
            }),
          width: '80px',
        },
      ]
    : [];

  // Final columns with nested field fallback selector
  const computedColumns = [
    ...indexColumn,
    ...actionsColumn,
    ...columns.map((col) => ({
      ...col,
      selector:
        col.selector ||
        ((row) =>
          col.field?.split('.').reduce((acc, key) => acc?.[key], row) ?? ''), // Safe nested access
    })),
  ];

  return (
    <DataTable
      columns={computedColumns}
      data={data}
      dense
      highlightOnHover
      expandableRows={expandableRows}
      expandableRowDisabled={(row) =>
        !row.componentMdlLst || row.componentMdlLst.length === 0
      }
      expandableRowsComponent={(props) =>
        expandableRows ? renderExpandedComponent(props) : null
      }
      customStyles={parentTableStyles}
      fixedHeader
      fixedHeaderScrollHeight="320px"
      noDataComponent={
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            color: '#888',
          }}
        >
          No Items added yet.
        </Box>
      }
    />
  );
};

export default DmDataTable;
