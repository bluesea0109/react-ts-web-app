import 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { useMutation } from '@apollo/client';
import { Button, TextInput } from '@bavard/react-components';
import Box from '@material-ui/core/Box';
import FormGroup from '@material-ui/core/FormGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import makeStyles from '@material-ui/styles/makeStyles';
import Typography from '@material-ui/core/Typography';
import InputMask from 'react-input-mask';

import { getIdToken } from '../../apollo-client';
import config from '../../config';
import { currentUser } from '../../atoms';

import {
  ENABLE_BILLING,
  GET_CURRENT_USER,
  GET_WORKSPACES,
} from '../../common-gql-queries';
import ApolloErrorPage from '../ApolloErrorPage';

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

  const [
    doEnableBilling,
    { loading: enablingBilling, error: billingError },
  ] = useMutation(ENABLE_BILLING, {
    refetchQueries: [{ query: GET_CURRENT_USER }, { query: GET_WORKSPACES }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      sessionStorage.removeItem('token');
      getIdToken();
      closeDialog();
    },
  });

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
      },
    );
  };

  useEffect(() => {
    (window.Stripe as any)?.setPublishableKey(config.stripePublicKey);
  });

  if (billingError) {
    return <ApolloErrorPage error={billingError} />;
  }

  return (
    <Box paddingX={4}>
      {enablingBilling && <LinearProgress color="secondary" />}
      <form>
        <FormGroup className={classes.formGroup}>
          <Typography variant="subtitle1" className={classes.label}>
            User Name
          </Typography>
          <InputMask
            mask={[/[*]/]}
            value={userName}
            maskPlaceholder=" "
            className={classes.textInput}
            onChange={handleUserNameChange}
          />
        </FormGroup>
        <FormGroup className={classes.formGroup}>
          <Typography variant="subtitle1" className={classes.label}>
            Credit Card Number
          </Typography>
          <InputMask
            mask="9999 9999 9999 9999"
            value={creditNumber}
            maskPlaceholder=" "
            className={classes.textInput}
            onChange={handleCreditCardChange}
          />
        </FormGroup>
        <FormGroup className={classes.formGroup}>
          <Box display="flex" flexDirection="row" marginX={-1}>
            <Box paddingX={1}>
              <Typography variant="subtitle1" className={classes.label}>
                Exp Date
              </Typography>
              <InputMask
                mask="99/99"
                value={expDate}
                maskPlaceholder=" "
                className={classes.textInput}
                onChange={handleExpDateChange}
              />
            </Box>
            <Box paddingX={1}>
              <Typography variant="subtitle1" className={classes.label}>
                CVV
              </Typography>
              <InputMask
                mask="999"
                value={cvv}
                maskPlaceholder=" "
                className={classes.textInput}
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
  formGroup: {
    margin: '1rem 0px',
  },
  label: {
    marginRight: 4,
    fontWeight: 'bold',
  },
  textInput: {
    padding: '0.5rem',
    fontSize: '1rem',
  },
  submitPaymentButton: {
    color: 'white',
    width: '100%',
    background: 'linear-gradient(91.71deg, #03B3FD 0.54%, #4F4FBB 86.24%)',
  },
}));
