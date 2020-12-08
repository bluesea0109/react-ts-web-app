import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Card,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
} from '@material-ui/core';
import { PersonAdd, Group, AddCircleOutline } from '@material-ui/icons';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { GET_WORKSPACES } from '../../../common-gql-queries';
import { IWorkspace, IUser } from '../../../models/user-service';
import ApolloErrorPage from '../../ApolloErrorPage';
import ContentLoading from '../../ContentLoading';
import InviteDialog from './InviteDialog';
import WorkspaceInvitedMember from './WorkspaceInvitedMember';
import WorkspaceMembersTable from './WorkspaceMembersTable';
import DisablePaymentDialog from './DisablePaymentDialog';
import EnablePaymentDialog from './EnablePaymentDialog';
import ApiKeys from './ApiKeys';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(2),
    },
    tableWrapper: {
      display: 'flex',
    },
    pageTitle: {
      fontSize: '26px',
      marginTop: '20px',
      marginBottom: theme.spacing(3),
    },
  }),
);

const theme = createMuiTheme({
  overrides: {
    MuiTab: {
      root: {
        maxWidth: '100%',
      },
      wrapper: {
        flexDirection: 'row',
        width: '100%',
        textTransform: 'lowercase',
        fontSize: '20px',
        '& > :first-letter': {
          textTransform: 'capitalize',
        },
        '& > span': {
          padding: '2px',
        },
      },
    },
  },
});

interface IWorkspaceSettingsProps {
  user: IUser;
  workspaceId?: String;
}

interface IGetWorkspaces {
  workspaces: IWorkspace[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      {...other}>
      {value === index && children}
    </div>
  );
}

export default function WorkspaceSettings(props: IWorkspaceSettingsProps) {
  const classes = useStyles();

  const { error, loading, data, refetch } = useQuery<IGetWorkspaces>(
    GET_WORKSPACES,
    {
      variables: { id: props.workspaceId },
    },
  );

  const [viewInviteDialog, showInviteDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number) => {
    setTabValue(newValue);
  };

  if (error) {
    return <ApolloErrorPage error={error} />;
  }

  if (loading || !data) {
    return <ContentLoading shrinked={true} />;
  }

  if (data.workspaces.length === 0) {
    return <Typography>{'Error: failed to load workspace data'}</Typography>;
  }

  const workspace = data.workspaces[0];
  return (
    <div>
      <Grid item={true} container={true} xs={10} spacing={2}>
        <Grid item={true} xs={12} sm={12}>
          <ThemeProvider theme={theme}>
            <div style={{ position: 'relative' }}>
              <Paper>
                <Tabs
                  value={tabValue}
                  onChange={handleChangeTab}
                  indicatorColor="primary">
                  <Tab
                    icon={<Group style={{ padding: '10px' }} />}
                    label={
                      <>
                        <span>Organization</span> <span>Members</span>
                      </>
                    }
                  />
                  <Tab
                    icon={<PersonAdd style={{ padding: '10px' }} />}
                    label={
                      <>
                        <span>Invited</span> <span>Organization</span>{' '}
                        <span>Members</span>
                      </>
                    }
                  />
                </Tabs>
              </Paper>
              <Button
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '20px',
                  display: !tabValue ? 'none' : '',
                }}
                color="primary"
                onClick={() => showInviteDialog(true)}
                endIcon={<AddCircleOutline />}>
                Invite a Member
              </Button>
              <div
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '13px',
                  display: tabValue === 1 ? 'none' : '',
                }}>
                {workspace.billingEnabled === true && <DisablePaymentDialog />}
                {workspace.billingEnabled === false && <EnablePaymentDialog />}
              </div>
            </div>
          </ThemeProvider>
          <TabPanel value={tabValue} index={0}>
            <Card>
              <WorkspaceMembersTable
                user={props.user}
                workspace={workspace}
                refetchWorkspaces={refetch}
              />
            </Card>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <WorkspaceInvitedMember workspaceId={props.workspaceId} />
            {viewInviteDialog && (
              <InviteDialog
                open={viewInviteDialog}
                onClose={() => showInviteDialog(false)}
                onSuccess={() => showInviteDialog(false)}
                user={props.user}
                workspaceId={props.workspaceId}
              />
            )}
          </TabPanel>
        </Grid>
      </Grid>
      <Grid item={true} container={true} xs={10} spacing={2}>
        <ApiKeys workspaceId={props.workspaceId} />
      </Grid>
    </div>
  );
}
