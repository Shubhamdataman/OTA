import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useRef, useState, useCallback } from 'react';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { InputAdornment, IconButton, Box } from '@mui/material';
import DmTextfield from '../DmTextfield';

const DmMultiHelp = ({
  value,
  setValue,
  label,
  required,
  columns,
  rows = [],
  setRows,
  setSelectedRow,
  fieldName,
  fetchRows,
  pageSize = 5,
  disabled,
  sx,
}) => {
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchedRows, setFetchedRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchedRows, setSearchedRows] = useState(rows);
  const [isLast, setIsLast] = useState(false);
  const dataGridRef = useRef(null);
  const containerRef = useRef(null);
  const pageRef = useRef(1);
  const loadMoreData = useCallback(async () => {
    if (loading || isLast) return;
    setLoading(true);
    const tempData = await fetchRows(pageRef.current, pageSize);
    const newData = tempData?.data;
    console.log('newss', newData);
    setFetchedRows((prev) => [...prev, ...newData]);
    setRows((prev) => [...prev, ...newData]);
    setIsLast(tempData?.isLast);
    setLoading(false);
    setLoading(false);
  }, [loading, isLast]);

  useEffect(() => {
    if (isOpen) {
      pageRef.current = 1; // Reset page on modal open
      setFetchedRows([]); // Clear previous data
      loadMoreData(); // Load the first page
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedColumn(null); // Reset column selection
    }
  }, [isOpen]);

  useEffect(() => {
    const attachScrollListener = () => {
      const dataGridElement = dataGridRef.current?.querySelector(
        '.MuiDataGrid-virtualScroller'
      );

      if (dataGridElement) {
        const handleScroll = (event) => {
          const { scrollTop, scrollHeight, clientHeight } = event.target;
          if (
            scrollTop + clientHeight >= scrollHeight - 1 &&
            !isLast &&
            !loading
          ) {
            pageRef.current += 1;
            loadMoreData();
          }
        };

        dataGridElement.addEventListener('scroll', handleScroll);
        return () =>
          dataGridElement.removeEventListener('scroll', handleScroll);
      }
    };

    if (isOpen) {
      attachScrollListener();
    }
  }, [isOpen, isLast, loadMoreData]);

const handleColumnHeaderClick = (params) => {
    setSelectedHeader(params.colDef.field);
  };

  const enhancedColumns = columns.map((col) => ({
    ...col,
    headerClassName:
      col.field === selectedColumn ? 'selected-column-header' : '',
  }));

  const handleSearch = (e) => {
    setValue(e.target.value);
    setIsOpen(true);
    pageRef.current = 1;
  };

  const handleRowClick = (params) => {
    console.log('pa', params.row);
    console.log('feet', fetchedRows);
    const selectedRow = fetchedRows.find((row) => row.code === params.id);

    if (selectedRow) {
      setValue(selectedRow);
      setIsOpen(false);
    }
    setSelectedRow(params.row);
  };
  

  return (
      <Box ref={containerRef} sx={{ position: 'relative' }}>
        <DmTextfield
          label={label}
          required={required}
          value={value}
          onChange={handleSearch}
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!disabled) setIsOpen(!isOpen);
                  }}
                  edge="end"
                >
                  {isOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          disabled={disabled}
        />

        {isOpen && (
          <Box ref={dataGridRef} className="dmMultiHelpBox">
            <DataGrid
              columns={enhancedColumns}
              onColumnHeaderClick={handleColumnHeaderClick}
              onRowClick={handleRowClick}
              rows={fetchedRows.map((role) => ({ ...role, id: role.code }))}
              sx={{
                bgcolor: '#fff',
                '& .MuiDataGrid-footerContainer': { display: 'none' },
                '& .MuiDataGrid-row': { backgroundColor: 'transparent' },
                '& .MuiDataGrid-cell': {
                  borderRight: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: 'none',
                  fontSize: 10,
                },
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  fontSize: 12,
                },
                '& .MuiDataGrid-scrollbar': {
                  ariaHidden: 'false',
                },
                '& .MuiDataGrid-columnHeaders .selected-column-header': {
                  backgroundColor: '#e0f7fa',
                  color: '#00796b',
                  fontWeight: 'bold',
                },
              }}
              noRowsOverlay={
                <Box sx={{ padding: '20px', textAlign: 'center' }}>
                  No Data Found
                </Box>
              }
              disableAutosize
              disableColumnResize
              disableColumnMenu
              disableColumnSorting
              disableDensitySelector
              disableRowSelectionOnClick
              disableMultipleRowSelection
            />
          </Box>
        )}
      </Box>
  );
};

export default DmMultiHelp;
