import { Box } from '@mui/material'
import React from 'react'

function DmBox({sx, children}) {
  return (
    <Box sx={sx}>
        {children}
    </Box>
  )
}

export default DmBox