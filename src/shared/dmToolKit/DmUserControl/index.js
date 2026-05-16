import { Box, Typography, useMediaQuery } from '@mui/material';

function DmUserControl({ data }) {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <Box
      component="footer"
    >
      {data.map((item, index) => {
        return (
          <>
            <Typography fontSize={isMobile ? 8 : 10} fontWeight={700}>
              {item.label + ':'} {item.value}
            </Typography>
            {index !== data.length - 1 && (
              <Typography fontSize={isMobile ? 8 : 10} fontWeight={700}>
                |
              </Typography>
            )}
          </>
        );
      })}
      {/* <Typography fontSize={10} fontWeight={700}>
        Prepared By: Lorem Ipsum
      </Typography> */}
      {/* <Typography fontSize={10} fontWeight={700}>
        |
      </Typography> */}
      {/* <Typography fontSize={10} fontWeight={700}>
        Lorem Ipsum
      </Typography>
      <Typography fontSize={10} fontWeight={700}>
        |
      </Typography>
      <Typography fontSize={10} fontWeight={700}>
        Lorem Ipsum
      </Typography> */}
      {/* <Typography fontSize={10} fontWeight={700}>
        |
      </Typography>
      <Typography fontSize={10} fontWeight={700}>
        Last Modified By: Lorem Ipsum
      </Typography> */}
    </Box>
  );
}

export default DmUserControl;
