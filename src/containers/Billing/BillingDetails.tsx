import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';
import { Button } from '@bavard/react-components';
import { TextInput } from '@bavard/react-components';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import makeStyles from '@material-ui/styles/makeStyles';
import { currentUser } from '../../atoms';

import { ENABLE_BILLING } from '../Dashboard/WorkspaceSettings/gql';
import config from '../../config';

interface BillingDetailsProps {
  closeDialog: () => void;
}

const BillingDetails: React.FC<BillingDetailsProps> = ({ closeDialog }) => {
  const classes = useStyles();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [user] = useRecoilState(currentUser);

  const [userName, setUserName] = useState('');
  const [creditNumber, setCreditNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvv, setCVV] = useState('');

  const [doEnableBilling, enableBillingResp] = useMutation(ENABLE_BILLING);

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

  const handleUserNameChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUserName(e.target.value);
  };

  const handleSubmit = async () => {
    const expirations = expDate.split('/');
    (window.Stripe as any)?.card.createToken(
      {
        name: userName,
        number: creditNumber,
        cvc: cvv,
        exp_month: expirations[0],
        exp_year: expirations[1],
      },
      async (status: any, response: any) => {
        if (response.error) {
          // handle error response
          return;
        }

        const stripeToken: string = response ? response.id : '';
        // enable billing
        await doEnableBilling({
          variables: {
            workspaceId,
            stripeToken,
            billingEmail: user?.email || '',
          },
        });

        closeDialog();
      },
    );
  };

  useEffect(() => {
    (window.Stripe as any)?.setPublishableKey(config.stripePublicKey);
  });

  return (
    <Box paddingX={4}>
      <form>
        <FormGroup row>
          <TextInput
            label="User Name"
            labelType="Typography"
            labelPosition="top"
            fullWidth={true}
            value={userName}
            onChange={handleUserNameChange}
          />
        </FormGroup>
        <FormGroup row>
          <TextInput
            label="Credit Card Number"
            labelType="Typography"
            labelPosition="top"
            fullWidth={true}
            value={creditNumber}
            onChange={handleCreditCardChange}
          />
        </FormGroup>
        <FormGroup row>
          <Box display="flex" flexDirection="row" marginX={-1} marginY={1}>
            <Box paddingX={1}>
              <TextInput
                label="Exp Date"
                labelType="Typography"
                labelPosition="top"
                fullWidth={true}
                value={expDate}
                onChange={handleExpDateChange}
              />
            </Box>
            <Box paddingX={1}>
              <TextInput
                label="CVV"
                labelType="Typography"
                labelPosition="top"
                fullWidth={true}
                value={cvv}
                onChange={handleCVVChange}
              />
            </Box>
          </Box>
        </FormGroup>
        <Box marginTop={4} marginBottom={1} width={1}>
          <Button
            type="submit"
            title="Submit Payment"
            className={classes.submitPaymentButton}
            onClick={handleSubmit}
          />
        </Box>
      </form>
    </Box>
  );
};

export default BillingDetails;

const useStyles = makeStyles(() => ({
  submitPaymentButton: {
    color: 'white',
    width: '100%',
    background: 'linear-gradient(91.71deg, #03B3FD 0.54%, #4F4FBB 86.24%)',
  },
}));
