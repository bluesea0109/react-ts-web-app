import React, { useState } from 'react';
import { Button } from '@bavard/react-components';
import { TextInput } from '@bavard/react-components';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import makeStyles from '@material-ui/styles/makeStyles';

const BillingDetails = () => {
  const classes = useStyles();

  const [creditNumber, setCreditNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCVV] = useState('');
  const [isSaveCard, setIsSaveCard] = useState(false);

  const handleCreditCardChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCreditNumber(e.target.value);
  };

  const handleExpDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setExpDate(e.target.value);
  };

  const handleCVVChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setCVV(e.target.value);
  };

  const handleIsSaveCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSaveCard(e.target.checked);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Credit Card Number"
          labelType="Typography"
          labelPosition="top"
          value={creditNumber}
          onChange={handleCreditCardChange}
        />
        <FormGroup row>
          <TextInput
            label="Exp Date"
            labelType="Typography"
            labelPosition="top"
            value={expDate}
            onChange={handleExpDateChange}
          />
          <TextInput
            label="Exp Date"
            labelType="Typography"
            labelPosition="top"
            value={cvv}
            onChange={handleCVVChange}
          />
        </FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={isSaveCard}
              onChange={handleIsSaveCardChange}
              name="save card"
              color="primary"
            />
          }
          label="Primary"
        />
        <Button
          type="submit"
          title="Submit Payment"
          className={classes.submitPaymentButton}
          onClick={() => {}}
        />
      </form>
    </Box>
  );
};

export default BillingDetails;

const useStyles = makeStyles(() => ({
  submitPaymentButton: {
    background: 'linear-gradient(91.71deg, #03B3FD 0.54%, #4F4FBB 86.24%)',
    color: 'white',
  },
}));
