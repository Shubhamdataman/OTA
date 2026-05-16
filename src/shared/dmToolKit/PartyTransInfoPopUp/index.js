import {
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  IconButton,
  CheckIcon,
  CloseIcon,
  DialogContent,
  Grid,
  Snackbar,
  Alert,
} from '@mui/material';
import DmTextfield from '../DmTextfield';
import { useState } from 'react';

const PartyTransInfoPopUp = ({title, open, onClose, handleSubmit, initialData}) => {
  const [formData, setFormData] = useState({
    subCode: '',
    name: '',
    siteCode: '',
    legalName: '',
    displayName: '',
    tradeName: '',
    gstin: '',
    gstinDate: '',
    transporterId: '',
    gstCountryCode: '',
    adPlaceOfBusinessSNo: '',
    adPlaceOfBusinessName: '',
    address1: '',
    address2: '',
    cityCode: '',
    cityName: '',
    districtCode: '',
    districtName: '',
    stateCode: '',
    stateName: '',
    countryCode: '',
    countryName: '',
    stateNumericCode: '',
    pinCode: '',
    mobile: '',
    phone: '',
    email: '',
    pan: '',
    tan: '',
    ...initialData,
  });
  const userVisible = false;
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontWeight: 600,
          }}
        >
          {title}
          <Box>
            <IconButton
              onClick={(e) => handleSubmit(e, formData)}
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : <CheckIcon />}
            </IconButton>
            <IconButton
              onClick={() => onClose(false)}
              color="error"
              disabled={loading}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            backgroundColor: 'background.default',
            p: '20px 10px !important',
            paddingTop: '0px !important',
            boxShadow: 'inset 0px 0px 5px #ccc',
            borderRadius: '4px',
          }}
        >
          {loading ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '20px',
              }}
            >
              <CircularProgress />
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {userVisible && (
                  <Grid sx={{xs:12, sm:4}}>
                    <DmTextfield
                      fullWidth
                      label="Sub Code"
                      name="subCode"
                      value={formData.subCode}
                      onChange={handleChange}
                      disabled
                    />
                  </Grid>
                )}

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Display Name"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Legal Name"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Trade Name"
                    name="tradeName"
                    value={formData.tradeName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="GSTIN"
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="GSTIN Date"
                    name="gstinDate"
                    value={formData.gstinDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Transporter ID"
                    name="transporterId"
                    value={formData.transporterId}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:8}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Additional Place Of Business"
                    name="adPlaceOfBusinessName"
                    value={formData.adPlaceOfBusinessName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:6}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Address Line 1"
                    name="address1"
                    value={formData.address1}
                    onChange={handleChange}
                    required
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:6}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Address Line 2"
                    name="address2"
                    value={formData.address2}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                {/* <Grid sx={{xs:12, sm:6}}>
                  <Autocomplete
                    options={cities}
                    getOptionLabel={(option) => option.cityName}
                    value={
                      cities.find(
                        (city) => city.cityCode === formData.cityCode
                      ) || ''
                    }
                    onChange={handleCityChange}
                    loading={cityLoading}
                    renderInput={(params) => (
                      <DmTextfield
                        {...params}
                        label="City"
                        size="small"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {cityLoading ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : ''}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid> */}

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="City"
                    name="cityName"
                    value={formData.cityName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="State"
                    name="stateName"
                    value={formData.stateName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="District"
                    name="districtName"
                    value={formData.districtName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Country"
                    name="countryName"
                    value={formData.countryName}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Pincode"
                    name="pinCode"
                    value={formData.pinCode}
                    onChange={handleChange}
                    type="number"
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    type="tel"
                    required
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email"
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="PAN"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>

                <Grid sx={{xs:12, sm:4}}>
                  <DmTextfield
                    fullWidth
                    size="small"
                    label="TAN"
                    name="tan"
                    value={formData.tan}
                    onChange={handleChange}
                    disabled
                  />
                </Grid>
              </Grid>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PartyTransInfoPopUp;
