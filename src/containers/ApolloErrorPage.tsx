import { ApolloError } from '@apollo/client';
import { useSnackbar } from 'notistack';
import React from 'react';
import BillingUpgradeDialog from './Billing/BillingUpgradeDialog';

interface IErrorPageProps {
  error: ApolloError;
  onClose?: () => void;
}

const ApolloErrorPage: React.FC<IErrorPageProps> = ({ error, onClose }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCloseBillingUpgradeDialog = () => {
    onClose?.();
  };

  const qlErrors = error?.graphQLErrors || [];
  if (!qlErrors.length) return null;

  const isBillingError = !!qlErrors.find(
    (error) => error.extensions?.code === 'BILLING_REQUIRED',
  );
  if (isBillingError) {
    return (
      <BillingUpgradeDialog
        isOpen={true}
        onClose={handleCloseBillingUpgradeDialog}
      />
    );
  }

  const commonError = qlErrors.find((error) => error.extensions?.code);
  if (commonError) {
    enqueueSnackbar(commonError.message, {
      variant: 'error',
    });
    return null;
  }

  enqueueSnackbar(
    `An unexpected error occurred. Please refresh the page and try again. If the problem persists, please email support@bavard.ai.`,
    {
      variant: 'error',
    },
  );
  return null;
};

export default ApolloErrorPage;
